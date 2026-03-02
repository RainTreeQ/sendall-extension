---
name: extension-popup-build-reload
description: 修改扩展弹窗后必须构建并重新加载扩展才能看到效果；含验证清单。Use when changing popup UI (app/src/popup, app/src/components/ui, app/src/index.css) or when user says popup changes don't appear.
---

# 扩展弹窗：构建 + 重新加载 才能生效

## 为什么改了代码却看不到？

本扩展的弹窗**不直接跑源码**，而是加载**构建产物**：

- **manifest.json** 里写的是：`"default_popup": "app/dist/popup.html"`
- 你改的是 **app/src/** 下的源码（Popup.jsx、index.css、switch 等）
- 只有执行 **构建** 后，修改才会被写入 **app/dist/**，弹窗打开时才会用新文件

所以：**只刷新扩展图标或重新打开弹窗不会看到源码的改动**，必须先构建再在扩展管理页「重新加载」扩展。

---

## 修改弹窗后必做两步

### 1. 构建前端

在项目根或 `app` 目录执行：

```bash
cd app && npm run build
```

确认终端里出现 `dist/popup.html`、`dist/assets/popup-*.js`、`dist/assets/button-*.css` 等输出且无报错。

### 2. 在浏览器里重新加载扩展

- **Chrome**：打开 `chrome://extensions`，找到本扩展，点击卡片上的 **重新加载**（圆形箭头）
- **Edge**：打开 `edge://extensions`，同上

然后再点击扩展图标打开弹窗，此时应看到最新 UI。

---

## 如何确认修改已进 dist（可选验证）

若怀疑构建没带上某次修改，可做快速检查：

1. **看构建时间**：`ls -la app/dist/popup.html`、`app/dist/assets/*.js` 的时间应为本次构建时间。
2. **在 dist 里搜关键字符串**（按你改的内容选）：
   - CSS 变量 / 设计系统：`grep -l 'switch-off\|switch-on\|prefers-color-scheme' app/dist/assets/*.css`
   - 弹窗里的类名/样式：`grep -l 'ring-black/30\|ring-white/30\|zinc-700' app/dist/assets/*.js app/dist/assets/*.css`
3. 若搜不到，说明要么没 build，要么改的文件不在 popup 的构建入口里（例如改错目录或改的是未引用的样式）。

---

## 与本弹窗相关的源码位置（便于改对地方）

| 想改的东西           | 主要改动的文件 |
|----------------------|----------------|
| 弹窗整体布局、AI 列表、发送区 | app/src/popup/Popup.jsx |
| 开关、按钮等 UI 组件  | app/src/components/ui/*.jsx |
| 主题色、深色模式、开关/描边变量 | app/src/index.css |
| 弹窗入口 HTML        | app/popup.html（一般不用改） |

构建入口：`app/vite.config.js` 里 `build.rollupOptions.input` 包含 `popup: popup.html`，会生成 `dist/popup.html` 和对应的 JS/CSS。

---

## 给 Agent 的提醒

当用户或你修改了以下任一类内容时，在回复里提醒用户（或直接执行）：

1. **先执行**：`cd app && npm run build`
2. **再提醒用户**：到 `chrome://extensions`（或 Edge 的扩展页）对本扩展点击「重新加载」，然后再打开弹窗查看效果。

若用户反馈「改了但没生效」，按本文「为什么改了代码却看不到？」和「必做两步」排查，并可选执行「如何确认修改已进 dist」做验证。
