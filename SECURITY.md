# 敏感数据安全指南 / Sensitive Data Security Guide

## `.auth/storage-state.json` 保护措施

### 当前风险
此文件包含 ChatGPT 等平台的 session token、cookie 等敏感信息，泄露可能导致：
- 账号被盗用
- 会话被劫持
- 隐私数据泄露

### 已实施的保护

| 层级 | 措施 | 状态 |
|------|------|------|
| 1. Git 保护 | `.gitignore` 排除 | ✅ 已配置 |
| 2. 文件权限 | 600 (仅所有者可读写) | ✅ 脚本已创建 |
| 3. Pre-commit 检查 | 阻止敏感文件提交 | ✅ 已集成 |
| 4. 磁盘加密 | FileVault/BitLocker | ⚠️ 需手动启用 |

### 快速加固

```bash
# 1. 立即执行权限加固
chmod +x scripts/security-harden.sh
./scripts/security-harden.sh

# 2. 验证保护状态
ls -la .auth/
# 应该显示: drwx------ 或 -rw-------

# 3. 测试 pre-commit hook
echo 'test' >> .auth/storage-state.json
git add .auth/storage-state.json
git commit -m "test"  # 应该被拒绝
```

### 日常安全习惯

1. **提交前检查**
   ```bash
   git status  # 确认 .auth/ 不在待提交列表
   ```

2. **使用部分提交**
   ```bash
   git add -p  # 逐块审查代码
   ```

3. **定期清理**
   ```bash
   # 删除旧的 auth 文件（每周或每月）
   rm .auth/storage-state.json
   ```

### 进阶保护（可选）

#### 方案 A: 加密存储
```bash
# 使用 GPG 加密（需要设置 GPG 密钥）
gpg --symmetric --cipher-algo AES256 .auth/storage-state.json
# 使用后解密
gpg --decrypt .auth/storage-state.json.gpg > .auth/storage-state.json
```

#### 方案 B: 环境变量存储
不保存到文件，仅通过环境变量传递：
```bash
export PLATFORM_AUTH_STATES_B64=$(cat .auth/storage-state.json | base64)
# 在脚本中通过 process.env.PLATFORM_AUTH_STATES_B64 读取
```

#### 方案 C: 使用密钥管理服务
- macOS: Keychain
- Windows: Credential Manager
- 跨平台: 1Password CLI, Bitwarden CLI

### 紧急响应

**如果不小心提交了敏感文件：**

```bash
# 1. 立即撤销提交（如果未 push）
git reset HEAD~1

# 2. 如果已 push，需要强制清理历史（谨慎操作）
git filter-branch --force --index-filter \
  'git rm --cached --ignore-unmatch .auth/storage-state.json' \
  HEAD

# 3. 撤销已泄露的 token
# - ChatGPT: 修改密码或登出所有设备
# - 其他平台: 在账号设置中撤销所有会话
```

### 检查清单

- [ ] 执行 `./scripts/security-harden.sh`
- [ ] 启用磁盘加密 (FileVault/BitLocker)
- [ ] 验证 `.auth/` 在 `.gitignore` 中
- [ ] 测试 pre-commit hook 能阻止敏感文件提交
- [ ] 设置定期清理提醒（日历提醒）

---

## English Version

### Current Risks
This file contains session tokens and cookies for platforms like ChatGPT. Leakage may lead to:
- Account compromise
- Session hijacking
- Privacy data exposure

### Protection Layers Implemented

| Layer | Measure | Status |
|-------|---------|--------|
| 1. Git protection | `.gitignore` exclusion | ✅ Configured |
| 2. File permissions | 600 (owner only) | ✅ Script created |
| 3. Pre-commit check | Block sensitive files | ✅ Integrated |
| 4. Disk encryption | FileVault/BitLocker | ⚠️ Manual setup |

### Quick Hardening

```bash
# Run the hardening script
chmod +x scripts/security-harden.sh
./scripts/security-harden.sh
```

### Emergency Response

**If sensitive file was committed:**

```bash
# If not pushed yet
git reset HEAD~1

# If already pushed (DANGEROUS - requires force push)
git filter-branch --force --index-filter \
  'git rm --cached --ignore-unmatch .auth/storage-state.json' \
  HEAD
git push --force

# Revoke leaked tokens immediately!
```
