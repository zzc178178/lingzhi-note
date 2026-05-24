import { View, Text, Textarea, Input, Button } from '@tarojs/components'
import { useState, useCallback } from 'react'
import Taro, { useDidShow } from '@tarojs/taro'
import { generateNoteFromUrl, generateNoteFromText, isApiConfigured } from '../../services/ai-generate'
import { saveNote } from '../../services/note-service'
import { useLoading } from '../../utils/loading'
import { showErrorToast } from '../../utils/errors'
import './create.scss'

export default function Create() {
  const [mode, setMode] = useState<'url' | 'text'>('url')
  const [url, setUrl] = useState('')
  const [text, setText] = useState('')
  const { isLoading, wrap } = useLoading()
  const [apiReady, setApiReady] = useState(false)
  const [errorDetail, setErrorDetail] = useState('')

  useDidShow(() => {
    setApiReady(isApiConfigured())
  })

  const handleGenerate = useCallback(async () => {
    setErrorDetail('')
    
    if (mode === 'url' && !url.trim()) {
      showErrorToast({ code: 'ERR', message: '请输入网页链接' })
      return
    }
    if (mode === 'text' && !text.trim()) {
      showErrorToast({ code: 'ERR', message: '请输入文字内容' })
      return
    }

    try {
      const note = await wrap(
        mode === 'url'
          ? generateNoteFromUrl(url.trim())
          : generateNoteFromText(text.trim())
      )
      console.log('[create] note.id=', note.id, 'title=', note.title)
      saveNote(note)
      console.log('[create] saved, navigating to id=', note.id)
      Taro.navigateTo({ url: `/pages/note/note?id=${note.id}` })
    } catch (err) {
      const msg = err instanceof Error ? err.message : '生成失败，请稍后重试'
      setErrorDetail(msg)
      showErrorToast({ code: 'ERR', message: msg })
    }
  }, [mode, url, text, wrap])

  const goToSettings = () => {
    Taro.navigateTo({ url: '/pages/settings/settings' })
  }

  return (
    <View className='create-page'>
      {!apiReady && (
        <View className='api-notice' onClick={goToSettings}>
          <Text className='notice-text'>⚠️ AI API 未配置，将使用示例数据。</Text>
          <Text className='notice-link'>去设置 →</Text>
        </View>
      )}

      {errorDetail && (
        <View className='error-detail'>
          <Text className='error-title'>❌ 错误详情</Text>
          <Text className='error-text'>{errorDetail}</Text>
        </View>
      )}

      <View className='mode-tabs'>
        <View
          className={`mode-tab ${mode === 'url' ? 'active' : ''}`}
          onClick={() => setMode('url')}
        >
          <Text>🔗 网页链接</Text>
        </View>
        <View
          className={`mode-tab ${mode === 'text' ? 'active' : ''}`}
          onClick={() => setMode('text')}
        >
          <Text>📝 纯文字</Text>
        </View>
      </View>

      <View className='input-section'>
        {mode === 'url' ? (
          <Input
            className='url-input'
            type='text'
            placeholder='请输入网页链接...'
            value={url}
            onInput={(e) => setUrl(e.detail.value)}
          />
        ) : (
          <Textarea
            className='text-input'
            placeholder='请输入或粘贴文字内容...'
            value={text}
            onInput={(e) => setText(e.detail.value)}
            autoHeight
          />
        )}
      </View>

      <Button
        className='btn-generate'
        hoverClass='btn-generate--hover'
        loading={isLoading}
        disabled={isLoading || (!url.trim() && !text.trim())}
        onClick={handleGenerate}
      >
        {isLoading ? (apiReady ? 'AI 正在分析内容...' : '生成示例笔记中...') : '🚀 生成笔记'}
      </Button>
    </View>
  )
}