# Changelog

所有重要的变更都将记录在此文件中。

格式基于 [Keep a Changelog](https://keepachangelog.com/zh-CN/1.0.0/)，
并且本项目遵循 [语义化版本](https://semver.org/lang/zh-CN/)。

---

## [0.1.0] - 2025-03-23

### ✨ 新增功能

- **AI 多平台广播** - 一次输入，同时向 ChatGPT、Claude、Gemini、DeepSeek、豆包、元宝、Kimi 等多个 AI 平台发送问题
- **三种发送模式** - 支持手动发送、自动发送、开启新对话三种模式
- **智能草稿保护** - 弹窗意外关闭时自动恢复未发送的草稿内容
- **多语言支持** - 支持简体中文、繁体中文、英语、日语、韩语、西班牙语、德语、法语
- **深色模式** - 支持 System / Light / Dark 三种主题模式自动切换

### 🎨 界面与设计

- 全新微拟物设计风格（Micro-Neumorphism）
- 高质感 3D 交互截图展示
- 多平台分屏对比演示图
- 响应式布局，支持移动端访问

### 🏗️ 技术架构

- 浏览器扩展 Manifest V3 架构
- Vite + React 19 + Tailwind CSS v4
- shadcn/ui 设计系统组件库
- 设计系统独立站点（本地开发）

### 📄 开源与文档

- AGPL-3.0 开源协议
- 完整的安装与使用文档
- Pro 版候补名单功能（Supabase 集成）

---

## 版本说明

- `MAJOR` - 不兼容的 API 修改或重大架构变更
- `MINOR` - 向下兼容的功能性新增
- `PATCH` - 向下兼容的问题修正

</content>