import { NoteData, createNote } from './note-model'
import { getApiConfig, isApiConfigured, getProxyUrl } from './storage'

const SYSTEM_PROMPT = `你是一个专业的笔记生成助手。你的任务是将用户提供的网页链接或文字内容转化为精美的双页签图文笔记。

你必须输出纯 JSON 格式，不要输出任何其他内容。

## 输出 JSON 格式

{
  "title": "笔记标题（简短）",
  "subtitle": "副标题/补充说明",
  "tag": "分类标签",
  "source": "原文链接（无则为空字符串）",
  "text_content": "文字页签的完整 HTML 内容",
  "diagram_content": "图解页签的完整 HTML 内容"
}

⚠️ HTML 属性必须使用单引号：JSON 字符串内部使用双引号包裹，HTML 属性用单引号避免转义冲突。
✅ 正确：<div class='tag-pill tag-blue'>内容</div>
❌ 错误：<div class="tag-pill tag-blue">内容</div>

## 内容质量标准（必读）

### 核心原则
- **忠于原文**：只总结用户提供的内容，不要添加任何原文没有的信息、分析或观点
- **精炼简洁**：文字页签篇幅应 ≤ 原文长度的 80%，避免过度展开
- **结构清晰**：合理组织内容，不要强行增加标题层级

### 文字页签标题层级规则

h2 — 主要章节（根据内容自然划分，不强求数量）
├─ h3 — 子主题/要点分类
│  ├─ p/ul/ol — 正文内容
│  ├─ .highlight-box — 重点强调
│  └─ blockquote — 引用

编号规范：
- h2 标题前缀：一、二、三、……（中文大写数字 + 顿号）
- h3 标题前缀：1. 2. 3. ……（阿拉伯数字 + 点号）
- 列表内细分可用 (1)、(2)、(3) 或 ①②③
- 每个 h2 下至少有一个 h3 或直接跟内容
- h2 → h3 → p/ul 一级一级往下，不得跳级

文字页签可用 HTML 组件：
- 正文标题和段落：h2/h3/p/ul/ol
- 单条重点强调：<div class='highlight-box highlight-blue'>...</div>（蓝/橙/绿三种）
- 引用观点：<blockquote>...</blockquote>
- 源码示例：<pre><code>...</code></pre>
- 对比数据：<table>
- 内联标记：<span class='tag-*'>...</span>
- 底部关键词：<div class='footer-tags'><span class='footer-tag tag-blue'>标签</span></div>
- 文字页签不要出现任何卡片样式组件

### 图解页签视觉图表选型

图解页签的内容必须放"一眼扫过去就能获得洞察"的视觉内容。

不同类型的内容使用不同的组件（以下组件在 template.css 中都有样式定义）：

1. 复杂系统架构/多分支流程图（>4节点）→ Mermaid flowchart TB（纵向）
   示例：<div class='mermaid'>flowchart TB\\nA[起点]-->B[终点]</div>
   特殊符号避坑：≥改用>=，→改用->，≤改用<=，≠改用!=，下划线避免使用

2. 简单线性流程（≤4节点，无分支）→ CSS Flow Nodes
   示例：<div class='css-flow'><div class='css-flow-row'><span class='css-node blue'>节点1</span><span class='css-arrow'>→</span><span class='css-node green'>节点2</span></div></div>
   节点类：blue / green / orange

3. 并列概念/方案对比（3-4项）→ CSS 多列卡片网格
   示例（3列）：<div class='diagram-grid-3'>
     <div class='grid-card'><div class='grid-card-label'>标签</div><div class='grid-card-title'>标题</div><div class='grid-card-desc'>描述</div></div>
     ...重复
   </div>
   带图标版本加 grid-card-icon 和 grid-card-emoji

4. 步骤递进（1→2→3顺序关系）→ CSS 纵向步骤卡片
   示例：<div class='step-list'>
     <div class='step-item' style='background:#e8f0fe;'>
       <div class='step-circle' style='background:#667eea;'>1</div>
       <div class='step-content'><div class='step-title'>第一级<span class='step-tag' style='color:#667eea;'>⚡标签</span></div><div class='step-desc'>描述</div></div>
     </div>
   </div>
   颜色递进规范：蓝(#e8f0fe/#667eea)→紫(#f0ebff/#7c3aed)→橙(#fef4e8/#f59e0b)

5. 多维度信息分组/功能要点 → CSS 两列网格+标签组
   示例：<div class='tag-grid-2'>
     <div class='tag-card'><div class='tag-card-title'>分组名</div><div class='tag-group'><span class='tag-pill tag-blue'>标签1</span><span class='tag-pill tag-purple'>标签2</span></div></div>
   </div>
   标签颜色：tag-blue(功能) / tag-purple(技术) / tag-green(性能) / tag-orange(监控)

6. 树形结构/分类/选型决策 → CSS Tree
   示例：<div class='tree-wrap'><ul><li><span class='node-root'>根节点</span><ul><li><span class='node-label'>分支 <span class='arrow'>→</span> 说明</span></li><li><span class='node-leaf'>叶子 <span class='tree-tag tag-green'>推荐</span></span></li></ul></li></ul></div>

7. 数据总结 → 效果条/信息条
   <div class='effect-bar'>📊 效果：xxx</div>
   <div class='info-bar'>说明信息 <span class='bar-sep'>|</span> 更多信息</div>

重要规则：
- diagram_content 中不同类型的模块用 <div class='diagram-section'> 包裹
- 每个 diagram-section 中可以包含：h3 标题、diagram-desc 描述、布局组件、effect-bar/info-bar
- 必须包含至少 3 个不同的 diagram-section 模块
- Mermaid 代码中不要用 ≥→≤≠≈∈ 等特殊符号，下划线避免使用
- 表格统一放在 text_content 中，图解页签用卡片/标签/树形替代
- 确保输出合法 JSON，HTML 中的换行用 \\n 表示`

interface AIResponse {
  title: string
  subtitle: string
  tag: string
  source: string
  text_content: string
  diagram_content: string
}

async function callAI(userContent: string): Promise<AIResponse> {
  const { url, key, model } = getApiConfig()

  const endpoint = url.endsWith('/')
    ? `${url}v1/chat/completions`
    : `${url}/v1/chat/completions`

  const res = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${key}`
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: userContent }
      ],
      temperature: 0.7,
      max_tokens: 16384
    }),
    signal: AbortSignal.timeout(120000)
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`API 请求失败 (${res.status}): ${text.substring(0, 200)}`)
  }

  const data = await res.json()
  const content = data.choices?.[0]?.message?.content
  if (!content) throw new Error('AI 返回内容为空')

  const jsonMatch = content.match(/\{[\s\S]*\}/)
  if (!jsonMatch) throw new Error(`AI 返回格式异常: ${content.substring(0, 200)}...`)

  const parsed = JSON.parse(jsonMatch[0]) as AIResponse

  if (!parsed.title || !parsed.text_content) {
    throw new Error('AI 返回内容不完整')
  }

  if (!parsed.diagram_content) {
    parsed.diagram_content = MOCK_DIAGRAM_CONTENT
  }

  if (!parsed.source) {
    parsed.source = ''
  }

  return parsed
}

// ============ 网页内容抓取 ============

async function fetchPageContent(url: string): Promise<string | null> {
  // 方案 1：CORS 代理（在线部署也能用，无需后端）
  const corsProxies = [
    'https://api.allorigins.win/raw?url=',
    'https://corsproxy.io/?',
  ]

  for (const proxy of corsProxies) {
    try {
      const res = await fetch(proxy + encodeURIComponent(url), {
        signal: AbortSignal.timeout(15000)
      })
      if (!res.ok) continue
      const html = await res.text()

      if (/captcha|验证|login|403|404/.test(html.substring(0, 500))) continue

      const mainMatch = html.match(/<(?:article|main)[^>]*>([\s\S]*?)<\/(?:article|main)>/i)
        || html.match(/<[^>]+role="main"[^>]*>([\s\S]*?)<\/[^>]+>/i)
        || html.match(/<[^>]+class="[^"]*(?:rich_media|content|article|post|entry)[^"]*"[^>]*>([\s\S]*?)<\/[^>]+>/i)

      const body = mainMatch ? mainMatch[1] : html

      let text = body
        .replace(/<(script|style|nav|footer|header|aside|noscript|iframe|svg)[^>]*>[\s\S]*?<\/\1>/gi, '')
        .replace(/<[^>]+>/g, ' ')
        .replace(/&[a-z]+;|&#\d+;/gi, ' ')
        .replace(/\s+/g, ' ')
        .trim()

      if (!text || text.length < 100) continue
      return text
    } catch { /* 继续尝试 */ }
  }

  // 方案 2：本地 Python 代理（开发环境）
  const proxyBase = getProxyUrl()
  if (proxyBase) {
    try {
      const proxyUrl = `${proxyBase}/fetch?url=${encodeURIComponent(url)}`
      const res = await fetch(proxyUrl, { signal: AbortSignal.timeout(30000) })
      if (res.ok) {
        const data = await res.json()
        if (data.ok && data.text && data.text.length >= 100) return data.text
      }
    } catch { /* 代理未启动 */ }
  }
  const proxies = [
    'https://api.allorigins.win/raw?url=',
    'https://corsproxy.io/?',
  ]

  for (const proxy of proxies) {
    try {
      const res = await fetch(proxy + encodeURIComponent(url), {
        signal: AbortSignal.timeout(15000)
      })
      if (!res.ok) continue
      const html = await res.text()

      if (/captcha|验证|login|403|404/.test(html.substring(0, 500))) continue

      const mainMatch = html.match(/<(?:article|main)[^>]*>([\s\S]*?)<\/(?:article|main)>/i)
        || html.match(/<[^>]+role="main"[^>]*>([\s\S]*?)<\/[^>]+>/i)
        || html.match(/<[^>]+class="[^"]*(?:rich_media|content|article|post|entry)[^"]*"[^>]*>([\s\S]*?)<\/[^>]+>/i)

      const body = mainMatch ? mainMatch[1] : html

      let text = body
        .replace(/<(script|style|nav|footer|header|aside|noscript|iframe|svg)[^>]*>[\s\S]*?<\/\1>/gi, '')
        .replace(/<[^>]+>/g, ' ')
        .replace(/&[a-z]+;|&#\d+;/gi, ' ')
        .replace(/\s+/g, ' ')
        .trim()

      if (!text || text.length < 100) continue

      return text
    } catch {
      continue
    }
  }

  console.warn('无法抓取网页内容（可能需登录或反爬保护）')
  return null
}

// ============ 生成入口 ============

export async function generateNoteFromUrl(url: string): Promise<NoteData> {
  if (!isApiConfigured()) return generateMockNote(url)

  try {
    // 先尝试抓取网页文字
    const pageText = await fetchPageContent(url)

    if (!pageText) {
      throw new Error('无法获取网页内容（该网站可能有反爬保护或需要登录）')
    }

    const aiResult = await callAI(
      `请根据以下网页内容生成笔记：\n\n来源链接：${url}\n\n网页内容：\n${pageText}`
    )

    return createNote({
      title: aiResult.title,
      subtitle: aiResult.subtitle,
      tag: aiResult.tag,
      source: aiResult.source || url,
      textContent: aiResult.text_content,
      diagramContent: aiResult.diagram_content
    })
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    // 网页抓取失败：直接抛错，让用户看到明确提示
    if (msg.includes('无法获取网页内容')) throw err
    // AI API 失败：降级为 mock
    console.error('AI 生成失败，使用 mock 数据:', err)
    return generateMockNote(url)
  }
}

export async function generateNoteFromText(text: string): Promise<NoteData> {
  if (!isApiConfigured()) return generateMockNote(text)

  try {
    const aiResult = await callAI(
      `请根据以下内容生成笔记：\n\n${text}`
    )

    return createNote({
      title: aiResult.title,
      subtitle: aiResult.subtitle,
      tag: aiResult.tag,
      source: aiResult.source || '',
      textContent: aiResult.text_content,
      diagramContent: aiResult.diagram_content
    })
  } catch (err) {
    console.error('AI 生成失败，使用 mock 数据:', err)
    return generateMockNote(text)
  }
}

// ============ Mock 数据 ============

const MOCK_TEXT_CONTENT = `
<h2>一、核心概念</h2>
<p>灵知笔记系统是一个智能化的知识管理工具，能够自动将任意内容转换为结构化的双页签笔记。</p>

<div class='highlight-box highlight-blue'>
<strong>✨ 核心价值</strong>：将碎片化信息转化为可回顾、可分享的知识资产，阅读效率提升 3 倍以上。
</div>

<h3>1. 三大核心能力</h3>
<p>灵知笔记系统围绕三个核心能力构建：</p>
<ul>
<li><strong>内容理解</strong>：自动提取 URL 或文本中的核心知识点，识别逻辑关系和层级结构</li>
<li><strong>智能摘要</strong>：生成简洁的要点总结和关键概念，降低信息过载</li>
<li><strong>可视化</strong>：将复杂逻辑转化为直观的图表和流程图，实现"一眼看懂"</li>
</ul>

<h3>2. 工作流程</h3>
<p>笔记生成系统采用四阶段流水线，从原始内容到精美笔记：</p>
<ol>
<li><strong>内容获取</strong> — 从网页、文本、音视频获取原始内容，支持多种输入格式</li>
<li><strong>内容分析</strong> — 提取 3-8 个核心知识点，识别逻辑关系和重要性排序</li>
<li><strong>结构化</strong> — 组织为文字笔记 + 图解笔记两种互补形式</li>
<li><strong>渲染输出</strong> — 生成精美的双页签 HTML 笔记，适配移动端和桌面端</li>
</ol>

<h2>二、双页签设计理念</h2>
<p>双页签设计的核心原则是"分工互补"：文字页签负责深度阐述，图解页签负责视觉总结。</p>

<h3>1. 文字页签：完整阐述</h3>
<p>文字页签的内容适合<strong>逐行阅读</strong>，用于完整理解知识：</p>
<ul>
<li>使用分层标题（h2→h3→p）构建清晰的知识骨架</li>
<li>高亮框标注重点内容，区分核心观点和辅助说明</li>
<li>引用块展示第三方观点和数据，增强可信度</li>
<li>底部标签区提供关键词索引，便于回顾</li>
</ul>

<blockquote>💡 一个好的灵知笔记应该让读者既能深度阅读（文字页签），又能一眼看懂（图解页签）。两者缺一不可。</blockquote>

<h3>2. 图解页签：视觉总结</h3>
<p>图解页签的内容适合<strong>扫读</strong>，用于快速获取洞察：</p>
<ul>
<li>流程图展示完整链路和分支逻辑</li>
<li>卡片网格并列展示概念对比</li>
<li>步骤列表展示递进关系</li>
<li>标签组多维分类，一眼看懂全貌</li>
</ul>

<h2>三、适用场景</h2>
<p>灵知笔记系统覆盖多个知识管理场景：</p>

<h3>1. 技术文档学习</h3>
<p>面对长篇技术文档，灵知笔记自动提取核心架构、关键接口和实现细节，生成结构化摘要。</p>

<h3>2. 产品方案分析</h3>
<p>分析竞品方案或产品设计文档时，灵知笔记自动对比不同方案的优劣势，输出并列对比卡片和决策树。</p>

<h3>3. 知识管理整理</h3>
<p>将碎片化信息统一转化为结构化的知识资产，建立个人知识库。</p>

<div class='footer-tags'>
<span class='footer-tag tag-blue'>灵知笔记</span>
<span class='footer-tag tag-purple'>知识管理</span>
<span class='footer-tag tag-green'>可视化</span>
<span class='footer-tag tag-orange'>双页签</span>
</div>
`

const MOCK_DIAGRAM_CONTENT = `
<div class='diagram-section'>
  <h3>🔄 笔记生成流程</h3>
  <div class='diagram-desc'>从输入到输出的完整处理链路</div>
  <div class='css-flow'>
    <div class='css-flow-row'>
      <span class='css-node blue'>用户输入</span>
      <span class='css-arrow'>→</span>
      <span class='css-node blue'>内容获取</span>
      <span class='css-arrow'>→</span>
      <span class='css-node blue'>知识提取</span>
      <span class='css-arrow'>→</span>
      <span class='css-node blue'>结构化</span>
      <span class='css-arrow'>→</span>
      <span class='css-node green'>渲染输出</span>
    </div>
  </div>
</div>

<div class='diagram-section'>
  <h3>📦 三阶段方案</h3>
  <div class='diagram-desc'>逐步增强的内容处理能力</div>
  <div class='diagram-grid-3'>
    <div class='grid-card'>
      <div class='grid-card-label'>📝 阶段一</div>
      <div class='grid-card-title'>内容获取</div>
      <div class='grid-card-desc'>从 URL 或文本中抓取原始内容，支持多种输入格式</div>
    </div>
    <div class='grid-card'>
      <div class='grid-card-label'>🧠 阶段二</div>
      <div class='grid-card-title'>AI 分析</div>
      <div class='grid-card-desc'>提取核心知识点，识别逻辑关系，标注重要性</div>
    </div>
    <div class='grid-card'>
      <div class='grid-card-label'>🎨 阶段三</div>
      <div class='grid-card-title'>美化输出</div>
      <div class='grid-card-desc'>渲染为双页签笔记，适配多端展示</div>
    </div>
  </div>
  <div class='effect-bar'>📊 效果：阅读效率提升 3 倍，信息保留率提高 60%</div>
</div>

<div class='diagram-section'>
  <h3>⚡ 实施步骤</h3>
  <div class='diagram-desc'>分阶段推进</div>
  <div class='step-list'>
    <div class='step-item' style='background:#e8f0fe;'>
      <div class='step-circle' style='background:#667eea;'>1</div>
      <div class='step-content'>
        <div class='step-title'>第一步 <span class='step-tag' style='color:#667eea;'>⚡ 收集</span></div>
        <div class='step-desc'>收集原始内容，支持网页链接和纯文本输入</div>
      </div>
    </div>
    <div class='step-item' style='background:#f0ebff;'>
      <div class='step-circle' style='background:#7c3aed;'>2</div>
      <div class='step-content'>
        <div class='step-title'>第二步 <span class='step-tag' style='color:#7c3aed;'>🧠 分析</span></div>
        <div class='step-desc'>AI 智能分析内容，提取核心知识点</div>
      </div>
    </div>
    <div class='step-item' style='background:#fef4e8;'>
      <div class='step-circle' style='background:#f59e0b;'>3</div>
      <div class='step-content'>
        <div class='step-title'>第三步 <span class='step-tag' style='color:#f59e0b;'>🎨 生成</span></div>
        <div class='step-desc'>生成精美图文笔记，支持分享和导出</div>
      </div>
    </div>
  </div>
</div>

<div class='diagram-section'>
  <h3>🏷 功能要点</h3>
  <div class='diagram-desc'>多维度能力分组</div>
  <div class='tag-grid-2'>
    <div class='tag-card'>
      <div class='tag-card-title'>📤 内容输入</div>
      <div class='tag-group'>
        <span class='tag-pill tag-blue'>网页链接</span>
        <span class='tag-pill tag-blue'>纯文本</span>
      </div>
    </div>
    <div class='tag-card'>
      <div class='tag-card-title'>🎯 核心能力</div>
      <div class='tag-group'>
        <span class='tag-pill tag-purple'>知识提取</span>
        <span class='tag-pill tag-purple'>图表生成</span>
      </div>
    </div>
    <div class='tag-card'>
      <div class='tag-card-title'>⚡ 输出形式</div>
      <div class='tag-group'>
        <span class='tag-pill tag-green'>文字笔记</span>
        <span class='tag-pill tag-green'>图解笔记</span>
      </div>
    </div>
    <div class='tag-card'>
      <div class='tag-card-title'>📊 数据指标</div>
      <div class='tag-group'>
        <span class='tag-pill tag-orange'>阅读效率 +300%</span>
        <span class='tag-pill tag-orange'>信息保留 +60%</span>
      </div>
    </div>
  </div>
  <div class='info-bar'><strong> 适用场景：</strong>技术文档 <span class='bar-sep'>|</span> 产品分析 <span class='bar-sep'>|</span> 知识整理</div>
</div>
`

async function generateMockNote(source: string): Promise<NoteData> {
  await new Promise((resolve) => setTimeout(resolve, 400))

  return createNote({
    title: '灵知笔记 - 双页签图文笔记生成器',
    subtitle: '智能知识管理 · 从内容到笔记只需一秒',
    tag: 'AI · 知识管理',
    source,
    textContent: MOCK_TEXT_CONTENT,
    diagramContent: MOCK_DIAGRAM_CONTENT
  })
}
