# Selector 平台维护模板

本文件用于平台级 selector 维护与回归记录，配合 `docs/SELECTOR-REMOTE-MAINTENANCE.md` 使用。

关联文档：

- 远程维护手册：`docs/SELECTOR-REMOTE-MAINTENANCE.md`
- 变更日志模板：`docs/SELECTOR-CHANGELOG-TEMPLATE.md`
- 注入层经验：`docs/INJECT-ADAPTER-LESSONS.md`

使用方式：

- 每次平台 DOM 更新时，仅更新对应平台小节。
- 改完后在"回归记录"填写结果，便于追溯。

## 通用记录模板

```md
### <platformId>
- 站点域名：
- mode：override | merge | disabled
- findInput（按优先级）：
  -
  -
- findSendBtn（按优先级）：
  -
  -
- 风险点：
  -
- 回归记录：
  - 日期：
  - 页面：
  - 输入定位：通过/失败
  - 发送定位：通过/失败
  - 兜底路径：未触发/heuristic/enter
  - 备注：
```

---

## 平台清单

### chatgpt
- 站点域名：`chatgpt.com`、`chat.openai.com`
- 编辑器类型：**混合** — 旧版 `textarea#prompt-textarea`，新版 `div[contenteditable][data-lexical-editor]`
- 关键点：selector `#prompt-textarea` 同时命中 textarea 和 div（取决于版本），注入路径自动分流
- 风险点：
  - A/B UI 导致同一选择器指向不同元素类型（textarea vs div）
  - 新版 Lexical 编辑器的 paste 事件验证可能耗时 200ms+
  - 主页（`chatgpt.com/`）的输入框即使存在也可能不可见，导致注入失败
- 发送按钮：`[data-testid="send-button"]`，通常稳定
- ⚠️ 自动修复注意：`#prompt-textarea` 可能是 div 而非 textarea，不要用 `textarea#prompt-textarea` 精确匹配标签

### claude
- 站点域名：`claude.ai`
- 编辑器类型：ProseMirror (`div.ProseMirror[contenteditable="true"]`)
- 关键点：发送按钮在 `fieldset button` 或 `form button` 内，优先找有 SVG 的非 attach/file/upload 按钮
- 风险点：附件/上传按钮与发送按钮语义接近，易误命中
- 回归步骤：验证发送命中的不是 attach/upload 按钮

### gemini
- 站点域名：`gemini.google.com`
- 编辑器类型：Quill (`ql-editor` contenteditable)
- 关键点：`ql-editor` 与 `mattooltip` 相关按钮
- 风险点：发送按钮常延迟渲染；不同语言文案差异大
- 回归步骤：注入后立即发送和等待 1~2 秒发送都要测试

### grok
- 站点域名：`grok.com`
- 编辑器类型：**React 受控 `textarea`**（2026年3月后从 ProseMirror 迁移而来）
- 关键点：
  - 输入框是 `textarea`，不是 contenteditable
  - 发送按钮 `button[type="submit"]` 在输入为空时 `disabled=true` 且父容器有 `class="hidden"`
  - 发送按钮的 aria-label 随 locale 变化：中文页面为 `"提交"`，英文为 `"Submit"`
- 风险点：
  - 按钮必须通过 SVG path 签名（`M6 11L12 5`）或 aria-label 定位，因为 disabled 状态下普通选择器不命中
  - React controlled textarea — `setReactValue` 设值后 React 可能在下一渲染周期重置
  - `confirmSendCheck` 需要同时检查输入框清空 + 页面线程内容变化，任一满足即认为发送成功
- ⚠️ 自动修复注意：
  - **不要**修改发送按钮为 `button[type="submit"]:not([disabled])` — 因为按钮在注入前是 disabled 的
  - **不要**修改 `findInput` 为更严格的选择器，Grok 的 textarea 在未 focus 时高度可能 < 20px
  - 正确的 findSendBtn 应允许 disabled 状态：`button[type="submit"][aria-label="Submit"], button[type="submit"][aria-label="提交"]`

### deepseek
- 站点域名：`deepseek.com`、`chat.deepseek.com`
- 关键点：`chat-input` 相关 textarea/contenteditable 双路径
- 风险点：输入容器从 textarea 切到 contenteditable 时易失效；登录跳转页面不能注入
- 回归步骤：同时验证 textarea 版和 contenteditable 版页面

### doubao
- 站点域名：`doubao.com`
- 关键点：需排除人机验证页干扰
- 风险点：验证页会导致输入发送都不可用
- 回归步骤：正常页验证通过；验证页应返回明确错误而非误注入

### qianwen
- 站点域名：`tongyi.aliyun.com`、`qianwen.com`
- 编辑器类型：**Slate.js** (`div[data-slate-editor="true"]`)
- 关键点：通过 React fiber 找到 Slate editor 实例，调用 `editor.deleteFragment()` + `editor.insertText()`
- 风险点：
  - `editor.deleteFragment()` 只能调用一次，多次调用会导致 Slate state 损坏 → "发生未知错误"
  - `runStrategies` 的策略间 `clearElement(execCommand selectAll+delete)` 会破坏 Slate state，已用 `skipClear:true` 保护
  - 任务助手弹层影响发送按钮命中
- ⚠️ 自动修复注意：fiber 遍历找 editor 后必须 `break`，不能循环多次

### yuanbao
- 站点域名：`yuanbao.tencent.com`
- 关键点：Quill 编辑器路径
- 风险点：发送按钮文本和 aria 可能不稳定
- 回归步骤：selector 发送失败时 Enter 兜底应可工作

### kimi
- 站点域名：`moonshot.cn`、`kimi.ai`、`kimi.com`
- 编辑器类型：ProseMirror-like contenteditable (`div.chat-input-editor[contenteditable="true"]`)
- 关键点：ClipboardEvent paste 是最可靠的注入路径（不用 setReactValue）
- 风险点：容器 class 变体较多；`verifyContent` 对于 ProseMirror 编辑器需要 400ms+ 等待
- ⚠️ 自动修复注意：Kimi 的注入策略链独立，不走通用 setContentEditable，选择器只影响 findInput/findSendBtn

### mistral
- 站点域名：`chat.mistral.ai`
- 关键点：基础通用路径（textarea/contenteditable + submit/send）
- 风险点：新接入平台，优先观察稳定性
- 回归步骤：至少验证 3 次连续注入发送成功率

---

## 每次变更后的最小回归

- 仅改 1 个平台时：回归该平台 + 任意 1 个未改平台
- 改多个平台时：每个平台至少 1 次输入/发送完整链路
- 若出现误命中：优先回滚远程 JSON，再定位具体 selector
- 改 `injection.js` 通用代码时：必须回归**全部**平台（通用改动影响所有路径）
