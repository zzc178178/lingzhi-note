import { View, Text } from '@tarojs/components'
import { ReactNode } from 'react'

// ---------- HTML 解析 ----------

interface HtmlAttr {
  [key: string]: string
}

interface HtmlElement {
  type: 'element'
  tag: string
  attrs: HtmlAttr
  children: HtmlNode[]
}

interface HtmlText {
  type: 'text'
  text: string
}

type HtmlNode = HtmlElement | HtmlText

/** 将 HTML 字符串解析为节点树 */
function parseHtml(html: string): HtmlNode[] {
  const nodes: HtmlNode[] = []
  let i = 0
  while (i < html.length) {
    if (html[i] === '<') {
      const { node, end } = parseTag(html, i)
      if (node) nodes.push(node)
      i = end
    } else {
      const { text, end } = parseText(html, i)
      if (text.trim()) nodes.push({ type: 'text', text })
      i = end
    }
  }
  return nodes
}

/** 解析文本节点直到下一个 < */
function parseText(html: string, start: number): { text: string; end: number } {
  let end = start
  while (end < html.length && html[end] !== '<') end++
  return { text: html.slice(start, end), end }
}

/** 解析一个 HTML 标签（含子节点） */
function parseTag(html: string, start: number): { node: HtmlNode | null; end: number } {
  // 跳过 <
  let i = start + 1

  // 跳过注释 <!-- ... -->
  if (html.startsWith('!--', i)) {
    const close = html.indexOf('-->', i)
    return { node: null, end: close >= 0 ? close + 3 : html.length }
  }

  // 检查是否是结束标签 </xxx>
  if (html[i] === '/') {
    const close = html.indexOf('>', i)
    return { node: null, end: close >= 0 ? close + 1 : html.length }
  }

  // 提取标签名
  let tagName = ''
  while (i < html.length && /[a-zA-Z0-9]/.test(html[i])) {
    tagName += html[i]
    i++
  }
  if (!tagName) {
    const gt = html.indexOf('>', start)
    return { node: null, end: gt >= 0 ? gt + 1 : html.length }
  }

  const tag = tagName.toLowerCase()

  // 自闭合标签
  if (SELF_CLOSING.has(tag)) {
    // 跳过属性
    while (i < html.length && html[i] !== '>') i++
    return {
      node: { type: 'element', tag, attrs: {}, children: [] },
      end: i + 1
    }
  }

  // 提取属性
  const attrs: HtmlAttr = {}
  while (i < html.length && html[i] !== '>' && html[i] !== '/') {
    // 跳过空白
    while (i < html.length && /\s/.test(html[i])) i++
    if (html[i] === '>' || html[i] === '/') break

    // 属性名
    let attrName = ''
    while (i < html.length && /[a-zA-Z_:][a-zA-Z0-9_:.-]*/.test(html[i])) {
      attrName += html[i]
      i++
    }
    // 跳过 =
    while (i < html.length && /\s/.test(html[i])) i++
    if (html[i] === '=') {
      i++
      while (i < html.length && /\s/.test(html[i])) i++
      // 属性值
      const quote = html[i]
      if (quote === '"' || quote === "'") {
        i++
        let value = ''
        while (i < html.length && html[i] !== quote) {
          value += html[i]
          i++
        }
        i++ // 跳过结束引号
        attrs[attrName.toLowerCase()] = value
      }
    } else {
      attrs[attrName.toLowerCase()] = attrName
    }
  }

  // 跳过 /> 或 >
  const isSelfClose = html[i] === '/'
  if (isSelfClose) i++
  if (html[i] === '>') i++

  // 自闭合（如 <div class='x' />）
  if (isSelfClose) {
    return {
      node: { type: 'element', tag, attrs, children: [] },
      end: i
    }
  }

  // 解析子节点直到遇到 </tagName>
  const children: HtmlNode[] = []
  const endTag = `</${tag}`
  while (i < html.length) {
    // 检查结束标签
    if (html.startsWith(endTag, i)) {
      const close = html.indexOf('>', i)
      i = close >= 0 ? close + 1 : html.length
      break
    }
    if (html[i] === '<') {
      const { node, end } = parseTag(html, i)
      if (node) children.push(node)
      i = end
    } else {
      const { text, end } = parseText(html, i)
      // 保留空白用于 inline 内容，trim纯空白节点
      if (text.trim() || children.length === 0 || children[children.length - 1].type !== 'text') {
        children.push({ type: 'text', text })
      }
      i = end
    }
  }

  return {
    node: { type: 'element', tag, attrs, children },
    end: i
  }
}

const SELF_CLOSING = new Set(['br', 'hr', 'img', 'input', 'meta', 'link', 'area', 'base', 'col', 'embed', 'source', 'track', 'wbr'])

// ---------- 渲染 ----------

/** 块级标签使用 View，内联标签使用 Text */
const BLOCK_TAGS = new Set(['div', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'ul', 'ol', 'li', 'pre', 'blockquote', 'table', 'thead', 'tbody', 'tr', 'th', 'td'])

function isBlockTag(tag: string): boolean {
  return BLOCK_TAGS.has(tag)
}

/** 渲染节点为 Taro 组件 */
function renderNode(node: HtmlNode, index: number): ReactNode {
  if (node.type === 'text') {
    return <Text key={index}>{node.text}</Text>
  }

  const { tag, attrs, children } = node
  const className = attrs.class || attrs.className || ''
  const styleStr = attrs.style || ''

  // 内联样式字符串转对象
  const styleObj = parseInlineStyle(styleStr)
  const hasStyle = Object.keys(styleObj).length > 0

  const childElements = children.map((child, i) => renderNode(child, i))

  // 为 CSS 选择器添加 tag-* 类名
  const tagClass = `tag-${tag}`
  const combinedClass = className ? `${tagClass} ${className}` : tagClass

  // 特殊标签处理
  if (tag === 'br') {
    return <Text key={index}>{'\n'}</Text>
  }

  if (tag === 'strong' || tag === 'b') {
    return <Text key={index} className={combinedClass} style={{ fontWeight: '700' }}>{childElements}</Text>
  }

  if (tag === 'em' || tag === 'i') {
    return <Text key={index} className={combinedClass} style={{ fontStyle: 'italic' }}>{childElements}</Text>
  }

  if (tag === 'code') {
    return <Text key={index} className={combinedClass} style={{ fontFamily: "'Courier New', monospace", fontSize: '24px' }}>{childElements}</Text>
  }

  if (tag === 'a') {
    // 小程序无超链接，显示为文字
    return <Text key={index} className={combinedClass} style={{ color: '#667eea', textDecoration: 'underline' }}>{childElements}</Text>
  }

  if (tag === 'ul') {
    return <View key={index} className={`${combinedClass} html-ul`} style={hasStyle ? styleObj : undefined}>{childElements}</View>
  }

  if (tag === 'ol') {
    return <View key={index} className={`${combinedClass} html-ol`} style={hasStyle ? styleObj : undefined}>{childElements}</View>
  }

  if (tag === 'li') {
    return <View key={index} className={`${combinedClass} html-li`} style={hasStyle ? styleObj : undefined}>{childElements}</View>
  }

  // 块级元素 → View
  if (isBlockTag(tag)) {
    const props: any = { key: index, className: combinedClass, style: hasStyle ? styleObj : undefined }
    return <View {...props}>{childElements}</View>
  }

  // 内联元素（span 等）→ Text
  const props: any = { key: index, className: combinedClass }
  if (hasStyle) props.style = styleObj

  return <Text {...props}>{childElements}</Text>
}

/** 简单内联样式解析：'color:#667eea;font-size:14px' → { color: '#667eea', fontSize: '14px' } */
function parseInlineStyle(str: string): Record<string, string> {
  if (!str) return {}
  const result: Record<string, string> = {}
  str.split(';').forEach(part => {
    const colon = part.indexOf(':')
    if (colon > 0) {
      const key = part.slice(0, colon).trim()
      const val = part.slice(colon + 1).trim()
      if (key && val) {
        // 转驼峰
        const camelKey = key.replace(/-([a-z])/g, (_, c) => c.toUpperCase())
        result[camelKey] = val
      }
    }
  })
  return result
}

// ---------- 导出组件 ----------

interface HtmlRendererProps {
  html: string
}

/** HTML → Taro 组件渲染器 */
export default function HtmlRenderer({ html }: HtmlRendererProps) {
  if (!html || !html.trim()) {
    return null
  }

  try {
    const nodes = parseHtml(html)
    // 过滤掉只有空白的顶层文本节点
    const filtered = nodes.filter(n => {
      if (n.type === 'text' && !n.text.trim()) return false
      return true
    })
    return <>{filtered.map((node, i) => renderNode(node, i))}</>
  } catch (e) {
    console.error('HtmlRenderer parse error:', e)
    return <View style={{ padding: '16px', color: '#dc2626' }}>HTML 渲染异常</View>
  }
}
