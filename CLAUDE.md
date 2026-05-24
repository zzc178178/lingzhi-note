# ai-note-make

灵知笔记 — 双页签图文笔记生成器，三个子项目共享同一套 AI 提示词和设计语言。

## 子项目

| 项目 | 目录 | 平台 | 说明 |
|------|------|------|------|
| **ai-note-2.0 Skill** | `C:\Users\123\.claude\skills\ai-note-2.0\` | Claude Code 桌面端 | 源头，定义 template.html + SYSTEM_PROMPT + build.py |
| **ai-note-mini-app** | `.\ai-note-mini-app\` | 微信/支付宝小程序 | Taro 跨平台，React + SCSS。用 HtmlRenderer 把 HTML 转 Taro 组件 |
| **ai-note-h5** | `.\ai-note-h5\` | Web 浏览器 | React + Vite SPA，iframe Blob URL 渲染 skill 的 template.html |

## 核心数据流

```
用户输入(URL/文字)
  → ai-generate.ts (SYSTEM_PROMPT → DeepSeek API → JSON)
  → createNote()  (JSON → NoteData)
  → 渲染:
    - H5:     template-builder.ts → 完整 HTML → iframe srcdoc
    - Mini:   HtmlRenderer.tsx → Taro View/Text 组件
    - Skill:  build.py → template.html → 文件
```

## AI 生成统一格式

```json
{
  "title": "标题",
  "subtitle": "副标题",
  "tag": "标签",
  "source": "原文链接",
  "text_content": "<h2>一、章节</h2><p>内容...</p>",
  "diagram_content": "<div class='diagram-section'><h3>章节</h3>...</div>"
}
```

## 注意事项

- **目录外文件权限**：读取 `C:\Users\123\.claude\skills\` 的文件时可能触发不显示的权限弹窗，用 Bash `cat`/`sed` 替代 Read 工具
- **Edge 夜间模式插件**：会让 H5 网站看起来偏暖，是插件问题不是代码问题
- **CSS Grid 兼容**：小程序不支持，mini-app 需用 Flexbox 替
