# 落地页组件库 (Landing Page Sections)

本目录包含组成 Landing Page 的所有区段级（Section-level）组件。

## 组件规范
- 必须基于 `framer-motion` 实现视口入场动画（Scroll Reveal）。
- 必须使用 `src/components/ui/` 下的微拟物风格组件（Button, Card, Badge, Input）。
- 必须严格遵守全局 `index.css` 提供的 CSS 变量作为颜色来源。
- 采用响应式设计，针对移动端（`<768px`）和桌面端优化排版。

## 包含组件
| 组件名 | 说明 |
| --- | --- |
| `Hero.jsx` | 页面头部首屏区域，包含主视觉与核心 CTA |
| `LogoBar.jsx` | 客户/媒体信任背书 Logo 展示墙 |
| `ProblemSection.jsx` | 痛点引发共鸣区域 |
| `FeaturesSection.jsx` | 核心功能展示，Bento Grid 布局 |
| `HowItWorks.jsx` | 工作原理与使用步骤展示 |
| `Testimonials.jsx` | 用户评价与社交证明 |
| `Pricing.jsx` | 产品定价方案卡片组合 |
| `FAQ.jsx` | 常见问题手风琴组件 |
| `FinalCTA.jsx` | 页面底部最终引导转化动作区 |
| `Footer.jsx` | 站点页脚组件 |
