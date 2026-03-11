# AI Broadcast Extension - 多屏同步浏览器插件 + 设计系统站点

技术栈: 浏览器扩展 (Manifest V3) + Vite + React + Tailwind v4 + shadcn/ui 设计系统

<directory>
├── app/           - 落地页 (发布) + 设计系统 (本地开发)
│   ├── src/components/ui/      - 基础原子组件库 (shadcn/ui + 微拟物重制)
│   ├── src/components/layout/ - Header, Hero, Footer
│   ├── src/pages/              - Home(落地页), DesignSystem(独立站点用)
│   ├── design-system.html      - 设计系统独立入口 (dev only)
│   └── src/lib/                - 工具函数与动画配置 (motion.js)
├── docs/          - 协议与架构文档 (COGNITIVE-ARCHITECTURE-AND-GEB-PROTOCOL.md)
├── popup.html     - 扩展弹窗入口
├── background.js  - 扩展后台脚本
├── content.js     - 页面注入脚本
└── manifest.json  - 扩展配置
</directory>

<config>
package.json      - 根包 (playwright 等)
app/package.json   - 前端应用依赖 (react, react-router-dom, tailwind, shadcn 相关)
app/components.json - shadcn CLI 配置
app/jsconfig.json - 路径别名 @/*
</config>

## 法则

- **设计系统铁律**：一切 UI 设计必须来自设计系统的颜色和组件。禁止在页面或组件中硬编码色值、随意写与设计系统无关的 class；颜色使用语义 token（如 background、primary、muted-foreground），组件使用 `@/components/ui` 与布局组件。
- **微拟物光影质感**：所有组件均采用微拟物风格，必须使用 CSS 变量和 `color-mix`（禁止使用 `backdrop-blur` 和 `0 0 Npx` 扩散阴影）。采用三层结构（外投影/内阴影 + 顶部高光 + 底部暗边），使用大圆角（20px+）与顺滑的微交互（scale动画）。
- 极简·稳定·导航·版本精确。
