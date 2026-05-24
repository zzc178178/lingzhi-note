# AI 笔记小程序 - 图解页签修复方案

## 问题诊断

### 症状
图解页签显示为纯文字列表，没有可视化组件（卡片、步骤、流程图等）

### 根本原因分析

通过查看截图和数据流，发现三个问题：

1. **AI 没有按照 JSON 格式输出** - 截图显示的是 HTML 内联样式渲染结果，说明 AI 返回的仍是 HTML 而不是 JSON 数据结构
2. **prompt 可能不够严格** - AI 可能忽略了 diagramModules 字段要求
3. **数据流验证** - 需要确认 diagramContent 在存储和读取时是否完整

## 修复步骤

### 步骤 1：强化 AI Prompt，强制 JSON 输出

修改 `src/services/ai-generate.ts` 中的 `SYSTEM_PROMPT`：

**关键改动：**
- 在 prompt 开头用大写强调 JSON 格式
- 添加 JSON Schema 定义
- 移除所有 HTML 相关的说明
- 在 prompt 末尾再次强调输出格式

### 步骤 2：添加响应解析和降级逻辑

在 `callAI` 函数中：

```typescript
// 1. 尝试解析 JSON
// 2. 如果失败，尝试从响应中提取 JSON
// 3. 如果 diagramModules 为空，使用默认模板
```

### 步骤 3：优化 DiagramTab 组件

当前 `DiagramTab.tsx` 的组件实现是正确的，问题在于数据格式。需要：

1. **保持现有的组件化渲染逻辑**
2. **添加更详细的调试信息**
3. **添加数据格式转换** - 如果 AI 返回了 HTML，尝试转换为组件格式

### 步骤 4：添加 Mock 数据作为 fallback

在 `generateMockNote` 中提供完整的图解模块数据，确保 API 未配置时也能看到效果

### 步骤 5：端到端测试

1. 清除所有旧笔记
2. 配置 API
3. 生成新笔记
4. 验证图解页签显示可视化组件

## 技术细节

### AI Prompt 改进要点

```
【强制】你必须输出 JSON 格式，不要输出 HTML！

diagramModules 数组中每个元素必须包含：
- type: "grid3" | "steps" | "flow" | "tags"
- title: 模块标题
- desc: 模块描述
- items: 数据项数组
```

### 数据结构

```typescript
interface DiagramModule {
  type: 'grid3' | 'steps' | 'flow' | 'tags' | 'text'
  title: string
  desc: string
  items: Array<{
    // grid3
    label?: string
    title?: string
    desc?: string
    // steps
    num?: string
    bg?: string
    // flow
    text?: string
    arrow?: string
    // tags
    pills?: string[]
  }>
}
```

### 预期效果

修复后，图解页签应该显示：
- 🎴 三列卡片网格（带标签、标题、描述）
-  步骤列表（带彩色圆圈编号、卡片背景）
- 🔗 流程图（带箭头连接的节点）
- 🏷️ 标签网格（分组 + 标签）

这些应该和 ai-note-2.0 skill 的图解效果完全一致。
