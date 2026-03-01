# 主流大模型输入框支持情况测试

测试脚本：`scripts/test-input-support.mjs`，使用与 `content.js` 相同的选择器在对应站点检测输入框是否存在。

## 如何运行测试

```bash
npm install
npx playwright install chromium   # 首次需要
npm run test:input
```

## 最近一次测试结果（未登录环境）

| 平台     | 输入框检测 | 命中选择器                           | 说明 |
|----------|------------|--------------------------------------|------|
| ChatGPT  | ✓ 支持     | `#prompt-textarea`                   | 选择器有效 |
| Claude   | ✗ 未检测到 | -                                    | 需登录后才有输入框 |
| Gemini   | ✓ 支持     | `.ql-editor[contenteditable="true"]` | 选择器有效 |
| Grok     | ✓ 支持     | `textarea`                           | 选择器有效 |
| DeepSeek | ✗ 未检测到 | -                                    | 可能需登录或地区限制 |

**说明：**

- **未检测到** 在未登录或登录墙后面时属正常，插件在已登录的浏览器中注入时仍可能可用。
- 若某站在**已登录**下仍长期检测不到，可能是该站前端改版，需更新 `content.js` 中对应平台的 `findInput` 选择器。
- README 中提到的 **Copilot**、**Mistral** 当前未在 `content.js` 中实现，故未纳入本测试；若需支持可后续补充平台配置与选择器。

## 选择器与 content.js 对应关系

- **ChatGPT**: `#prompt-textarea` → 备选 `div[contenteditable="true"][data-lexical-editor]` 等  
- **Claude**: `div.ProseMirror[contenteditable="true"]` 等  
- **Gemini**: `.ql-editor[contenteditable="true"]`（Quill 编辑器）  
- **Grok**: `textarea[placeholder*="Ask"]` → 备选 `textarea`  
- **DeepSeek**: `textarea#chat-input` → 备选 `textarea`
