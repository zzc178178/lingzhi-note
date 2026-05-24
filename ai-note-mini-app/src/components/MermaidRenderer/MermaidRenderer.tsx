import { View, Text } from '@tarojs/components'
import { useEffect, useRef, useState } from 'react'
import { isMiniProgram, isH5 } from '../../utils/platform'
import './MermaidRenderer.scss'

interface MermaidRendererProps {
  code: string
}

export default function MermaidRenderer({ code }: MermaidRendererProps) {
  const [error, setError] = useState<string | null>(null)
  const [rendered, setRendered] = useState(false)
  const containerRef = useRef<string>('')

  useEffect(() => {
    if (isMiniProgram()) {
      setError('小程序环境暂不支持图表渲染，请使用 H5 版本查看')
      return
    }

    let mounted = true
    setError(null)

    import('mermaid')
      .then((mermaid) => {
        if (!mounted) return
        mermaid.default.initialize({
          startOnLoad: false,
          theme: 'default',
          securityLevel: 'loose'
        })
        const id = `mermaid-${Date.now()}`
        containerRef.current = id
        mermaid.default
          .render(id, code)
          .then((result) => {
            if (mounted) {
              const el = document.getElementById(`mermaid-container-${id}`)
              if (el) el.innerHTML = result.svg
              setRendered(true)
            }
          })
          .catch((err) => {
            if (mounted) {
              setError(err.message || 'Mermaid 渲染失败')
            }
          })
      })
      .catch(() => {
        if (mounted) setError('Mermaid 库加载失败')
      })

    return () => { mounted = false }
  }, [code])

  return (
    <View className='mermaid-renderer'>
      {error ? (
        <View className='mermaid-error'>
          <Text className='error-icon'>⚠️</Text>
          <Text className='error-text'>{error}</Text>
          <View className='mermaid-code-block'>
            <Text>{code}</Text>
          </View>
        </View>
      ) : (
        <View className='mermaid-svg-wrapper'>
          <View id={`mermaid-container-${containerRef.current}`}>
            {!rendered && <Text className='loading-text'>图表加载中...</Text>}
          </View>
        </View>
      )}
    </View>
  )
}