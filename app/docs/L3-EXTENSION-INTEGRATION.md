# L3 — 分型与扩展集成

> 分型初始化 · 第三层：Vite 应用与浏览器扩展的集成方式与后续指令入口。

## 当前关系

- **根目录**：Chrome 扩展（`manifest.json`、`background.js`、`content.js`、`shared/`、`icons/`）
- **app/**：Vite + React + Tailwind 应用，构建后 **弹窗** 使用 `app/dist-extension/popup.html`（见 manifest）

## ⚠️ 修改哪里才会生效（避免改错文件）

| 要改的东西 | 改哪个文件/目录 | 是否需要构建 | 说明 |
|------------|-----------------|--------------|------|
| **弹窗 UI**（Logo、按钮、样式、逻辑） | `app/src/popup/Popup.jsx` 及 `app/src/` 下被 popup 引用的组件 | ✅ 需要 | 改完后执行 `npm run build:extension`，再在扩展管理页点「重新加载」 |
| 弹窗入口 HTML | `app/popup.html` | ✅ 需要 | 同上，构建产物在 `app/dist-extension/popup.html` |
| **后台脚本** | 根目录 `background.js` | ❌ 不需要 | 直接改，保存后在扩展管理页点「重新加载」即可 |
| **注入页面的脚本** | 根目录 `content.js`、`shared/platform-registry.js` | ❌ 不需要 | 同上 |
| **扩展配置 / 图标** | 根目录 `manifest.json`、`icons/` | ❌ 不需要 | 同上 |
| 根目录的 `popup.html` / `popup.js` | — | **不生效** | 扩展未使用；实际弹窗来自 `app/dist-extension/popup.html` |

**结论**：只有「弹窗相关」的修改必须走 app 构建；其余扩展逻辑（background、content、manifest、icons）改根目录即可。

## 集成选项（待下一步指令）

1. **Popup 替换**：已采用。`app` 构建到 `dist-extension/`，manifest 的 `default_popup` 指向 `app/dist-extension/popup.html`。
2. **Options 页**：用 `app` 作为扩展的选项页（Options page），构建产物单独输出到 `extension/options/` 或由 manifest 指定。
3. **独立 Web 应用**：`app` 的 `index.html` 为独立设计系统/落地页，与扩展并行。

## 构建产出

- `app/dist-extension/`：`popup.html` + `assets/*`，仅供扩展运行
- `app/dist-site/`：`index.html` + `assets/*` + `public/*`，仅供站点发布

## 分型初始化状态

| 层级 | 文档 | 状态 |
|------|------|------|
| L1 | [L1-ENV-STACK-INIT.md](./L1-ENV-STACK-INIT.md) | ✅ 已完成 |
| L2 | [L2-APP-CONVENTIONS.md](./L2-APP-CONVENTIONS.md) | ✅ 已约定 |
| L3 | 本文档 | ✅ 已就绪，等待下一步指令 |

---

**等待下一步指令**：确定采用哪种集成方式后，可继续配置 manifest、构建输出路径与入口。
