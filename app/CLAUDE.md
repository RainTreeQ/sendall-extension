# app/
> L2 | 父级: /CLAUDE.md

**落地页**（发布）+ **设计系统**（本地开发）已拆分为两个站点。

## 成员清单

- src/App.jsx: 落地页根组件，仅路由 Home
- src/main.jsx: 落地页入口
- src/design-system-main.jsx: 设计系统独立入口（dev only）
- design-system.html: 设计系统 HTML 入口
- vite.config.js: 主 build（index + popup，不含设计系统）
- vite.design-system.config.js: 设计系统 dev 配置，端口 5174
- src/components/layout/Header.jsx: 顶栏（落地页导航）
- src/components/layout/Footer.jsx: 页脚
- src/pages/Home.jsx: 落地页（Hero）
- src/pages/DesignSystem.jsx: 设计系统展示页（standalone 模式）

法则: 成员完整·一行一文件·父级链接·**所有 UI 仅用设计系统颜色与组件**

[PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
