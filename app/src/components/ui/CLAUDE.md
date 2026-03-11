# UI 组件库设计系统 (Micro-Neumorphism)

## 设计法则
- **微拟物光影质感**：渐变背景 + 立体阴影 + 微交互
- 禁止使用 `backdrop-blur` 和 `0 0 Npx` 的发光扩散阴影，以及硬编码的颜色值。
- 必须使用 CSS 变量 + `color-mix` 派生颜色，包含外投影、顶部高光、底部暗边的三层阴影结构，以及 `20px+` 的大圆角。

## 组件变体记录

### Button
- **Variant**: `default`, `primary`, `destructive`, `accent`, `secondary`, `outline`, `ghost`, `link`
- **Size**: `sm` (16px 圆角), `default` (20px), `md` (20px), `lg` (20px), `xl` (24px/32px), `icon`

### Card
- **Variant**:
  - `default`: 默认微拟物外凸卡片（包含外投影与高光边缘）。
  - `raised`: 增加投影与高光强度的卡片，适合可交互或需要更强层级的容器。
  - `inset`: 内凹阴影卡片（向内深陷的投影），适合用作次级面板、设置项承载区。

### Input
- **类型**: 微拟物内凹输入框
- 采用 `inset` 阴影结构，表现真实的输入区域质感，获取焦点时带有光环增强层。

### Badge
- **Variant**: `default`, `secondary`, `destructive`, `outline`
- 类似 Button 的微凸起光影结构，作为信息的标签化展示。
