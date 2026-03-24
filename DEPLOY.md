# Cloudflare Pages 部署指南

域名: `sendol.chat`

## 方式一：GitHub 自动部署（推荐）

### 1. 创建 Cloudflare Pages 项目

1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com)
2. 进入 **Workers & Pages** → **Create application** → **Pages**
3. 选择 **Connect to Git**
4. 授权 GitHub 仓库访问
5. 项目名填: `sendol`
6. 构建设置：
   - Framework preset: **None**
   - Build command: `npm run build:site`
   - Build output directory: `app/dist-site`

### 2. 配置 Secrets

在 GitHub 仓库 → Settings → Secrets and variables → Actions 添加：

```
CLOUDFLARE_API_TOKEN    # Cloudflare API Token
CLOUDFLARE_ACCOUNT_ID   # Cloudflare Account ID
```

获取方式：
- **API Token**: Cloudflare Dashboard → My Profile → API Tokens → Create Token
  - 模板选 "Cloudflare Pages" 或自定义：
    - Zone:Read, Page:Edit
- **Account ID**: Cloudflare Dashboard 右侧边栏

### 3. 绑定自定义域名

1. Cloudflare Pages 项目 → Custom domains
2. 添加 `sendol.chat`
3. 根据提示在域名注册商处添加 DNS 记录：
   - 类型: CNAME
   - 名称: `@` 或 `sendol.chat`
   - 目标: `sendol.pages.dev`

## 方式二：命令行手动部署

```bash
# 安装 Wrangler
npm install -g wrangler

# 登录 Cloudflare
wrangler login

# 创建项目（首次）
wrangler pages project create sendol

# 构建并部署
npm run build:site
npm run deploy:site
```

## 域名 DNS 设置

在你的域名注册商（Porkbun/Namecheap等）设置：

```
Type: CNAME
Name: @
Value: sendol.pages.dev
TTL: Auto
```

或 A 记录方式（推荐）：
```
Type: A
Name: @
Value: 192.0.2.1  # Cloudflare 会自动分配
```

## 验证部署

部署完成后访问：
- `https://sendol.pages.dev` (Cloudflare 默认域名)
- `https://sendol.chat` (自定义域名)

## 赞助按钮

在落地页添加赞助链接：

1. GitHub Sponsors: https://github.com/sponsors/[你的用户名]
2. Buy Me a Coffee: https://www.buymeacoffee.com/[你的用户名]
3. 爱发电: https://afdian.com/a/[你的用户名]
