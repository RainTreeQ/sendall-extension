# L1 — 环境与栈初始化

> 分型初始化 · 第一层：运行环境与技术栈就绪。

## 状态：✅ 已完成

## 检查清单

| 项 | 说明 | 验证 |
|---|------|------|
| Node.js | v18+ 推荐，LTS 更佳 | `node -v` |
| npm | 与 Node 同装 | `npm -v` |
| 项目创建 | Vite + React 模板 | 位于 `app/` |
| 依赖安装 | 根依赖已安装 | `app/node_modules` 存在 |
| TailwindCSS v4 | `tailwindcss` + `@tailwindcss/vite` | 见 `app/package.json` |
| Vite 配置 | `react()` + `tailwindcss()` 插件 | `app/vite.config.js` |
| 全局样式 | 仅 `@import "tailwindcss"` | `app/src/index.css` |
| 路径别名 | `@` → `./src` | `app/jsconfig.json` + `vite.config.js` |
| UI 增强库 | framer-motion, lucide-react, clsx, tailwind-variants, react-icons | 已安装 |

## 常用命令

```bash
cd app
npm run dev    # 开发
npm run build  # 构建
npm run preview # 预览构建产物
```

## 下一步

→ 见 [L2-APP-CONVENTIONS.md](./L2-APP-CONVENTIONS.md)：应用级约定与目录规范。
