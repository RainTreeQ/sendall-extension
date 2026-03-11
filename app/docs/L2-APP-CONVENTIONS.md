# L2 — 应用配置与约定

> 分型初始化 · 第二层：应用级配置、目录规范与 UI/动效约定。

## 路径别名

- **`@/*`** → `./src/*`（在 `jsconfig.json` 与 `vite.config.js` 中一致配置）
- 示例：`import { Button } from '@/components/Button'`

## UI 与动效约定

| 用途 | 库 | 约定 |
|------|-----|------|
| 滑入 / 过渡动效 | **framer-motion** | 页面/区块入场、列表 stagger、模态动画 |
| 系统图标 | **lucide-react** | 通用 UI 图标（箭头、设置、勾选等） |
| 社媒/品牌图标 | **react-icons/si** | `Si` 前缀（如 SiOpenai、SiGoogle） |
| 条件 class 合并 | **clsx** | `clsx('base', isActive && 'active')` |
| 变体样式 | **tailwind-variants** | 组件 size/color 等变体，与 Tailwind 配合 |

## 推荐目录结构（后续可扩展）

```
app/src/
├── components/   # 通用组件
├── hooks/         # 自定义 hooks
├── pages/         # 页面级组件（若做多页）
├── styles/        # 额外 CSS（若有）
├── App.jsx
├── main.jsx
└── index.css
```

## 下一步

→ 见 [L3-EXTENSION-INTEGRATION.md](./L3-EXTENSION-INTEGRATION.md)：与浏览器扩展的集成与构建产出。
