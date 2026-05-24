## Why

ai-note-2.0 是一个强大的双页签图文笔记生成技能，目前只能在 Claude Code 中使用。为了让更多用户能够便捷地生成精美的双页签笔记，我们需要将其转换为小程序/网页应用。用户可以通过输入 URL 或文本，快速获得包含「文字笔记」和「图解」两个页签的专业级笔记，大幅提升知识整理效率。

## What Changes

- **新增**：基于 Taro 框架构建跨端应用（小程序 + H5）
- **新增**：实现 AI 笔记生成核心功能（内容获取、分析、生成）
- **新增**：双页签笔记展示界面（文字页签 + 图解页签）
- **新增**：随手记编辑功能（富文本编辑器 + 本地存储）
- **新增**：笔记管理功能（收藏、分享、导出）
- **保留**：继承 ai-note-2.0 技能的全部视觉设计和布局模式

## Capabilities

### New Capabilities

- `ai-note-generator`: 核心笔记生成引擎，支持 URL 解析、文本分析、知识点提取、Markdown 转 HTML、Mermaid 图表渲染
- `dual-tab-ui`: 双页签 UI 组件库，包含文字页签、图解页签、随手记页签，以及 6 种可视化布局模式（Mermaid 流程图、三列卡片、纵向步骤、CSS Flow、标签网格、CSS Tree）
- `cross-platform-shell`: 跨端外壳，提供统一的导航、页面路由、主题系统和响应式布局
- `note-management`: 笔记管理模块，支持笔记列表、详情查看、分享、导出为 HTML、本地存储

### Modified Capabilities

- 无（全新项目）

## Impact

- **前端框架**：Taro 3.x + React + TypeScript
- **目标平台**：微信小程序、支付宝小程序、H5 网页
- **样式方案**：继承 ai-note-2.0 的 CSS 设计系统
- **图表渲染**：Mermaid.js（CDN 或本地化）
- **状态管理**：React Hooks + Context
- **存储方案**：本地存储（localStorage）+ 云端同步（可选）
