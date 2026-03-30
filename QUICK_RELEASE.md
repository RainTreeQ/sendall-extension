# 快速发布指南

## 🚀 一键打包

```bash
# 完整构建（推荐）
npm run package:extension

# 快速打包（已构建过 popup）
npm run package:quick
```

## ✅ 发布前检查

参考 `RELEASE_CHECKLIST.md` 完整清单。

快速检查：
```bash
# 1. 构建
npm run package:extension

# 2. 测试
# - 打开 Chrome → chrome://extensions/
# - 开启"开发者模式"
# - 加载已解压的扩展 → 选择 release/extension/

# 3. 验证核心功能
# - 打开 kimi.com → 测试发送
# - 打开 gemini.google.com → 测试发送
```

## 📤 提交商店

1. 登录 https://chrome.google.com/webstore/devconsole
2. 上传 `release/sendol-extension-v0.1.0.zip`
3. 填写商店信息
4. 提交审核（预计 1-3 工作日）

## 📊 发布后监控

查看双周报告：
- 打开扩展 background 页面 console
- 或运行：
```javascript
chrome.runtime.sendMessage({ type: 'GET_BIWEEKLY_REPORT' }, console.log)
```

## 🛠️ 紧急修复

```bash
# 1. 修复代码
# 2. 更新 manifest.json 版本号
# 3. 重新构建
npm run package:extension
# 4. 上传新版本到商店
```
