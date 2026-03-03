# Contributing to SendAll

感谢你对本项目的关注。贡献前请先本地验证扩展行为；若改动 `app/` 下的 React 页面，再额外执行构建验证。

## 开发环境

- Node.js 18+
- 项目根目录：`npm install`（安装 Playwright 等）
- `app` 目录：`cd app && npm install`

## 构建与加载扩展

1. 在 Chrome（或 Chromium 系浏览器）打开 `chrome://extensions/`，开启「开发者模式」
2. 点击「加载已解压的扩展程序」，选择**本仓库根目录**
3. 弹窗入口为 `popup.html`（无需先构建）
4. 若需构建 `app/` 下的 React 页面：`cd app && npm run build`

## 代码与设计约定

- **设计系统**：所有 UI 必须使用设计系统语义色与组件（见 `app/src/index.css`、`app/src/components/ui/`）。禁止在页面或组件中硬编码色值；颜色使用语义 token（如 `background`、`primary`、`muted-foreground`），组件使用 `@/components/ui`。
- **扩展逻辑**：`background.js`、`content.js` 保持纯 JS，与 Popup 通过 `chrome.runtime.sendMessage` 通信；消息协议见 `background.js`（`GET_AI_TABS`、`BROADCAST_MESSAGE`）。自动发送采用两阶段：先 `INJECT_MESSAGE`（autoSend: false）并行注入全部标签，再 `SEND_NOW` 并行触发发送。
- **Lint**：在 `app` 目录运行 `npm run lint`，修复 ESLint 报错。

## 测试

- Popup UI 回归：在项目根执行 `npm run test:popup`（需先执行 `cd app && npm run build`）
- 输入框支持情况：`npm run test:input`（会访问各 AI 站点并检测 content.js 选择器）
- 手动功能回归：按 README「测试」一节进行（加载扩展、刷新标签、发送、Storage 回填等）

## 提交与 PR

- 提交前请在本地完成构建与上述测试
- PR 描述请简要说明改动与验证方式
