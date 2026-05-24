import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { generateNoteFromUrl, generateNoteFromText } from '../utils/ai-generate'
import { saveNote, isApiConfigured } from '../utils/storage'
import './Home.scss'

type GenStatus = 'idle' | 'fetching' | 'ai' | 'done'

const STATUS_LABEL: Record<GenStatus, string> = {
  idle: '生成笔记',
  fetching: '正在抓取网页...',
  ai: 'AI 分析中...',
  done: '渲染中...',
}

export default function Home() {
  const navigate = useNavigate()
  const [mode, setMode] = useState<'url' | 'text'>('url')
  const [url, setUrl] = useState('')
  const [text, setText] = useState('')
  const [status, setStatus] = useState<GenStatus>('idle')
  const [error, setError] = useState('')
  const loading = status !== 'idle'
  const apiReady = isApiConfigured()

  const handleGenerate = useCallback(async () => {
    setError('')

    if (mode === 'url' && !url.trim()) {
      setError('请输入网页链接')
      return
    }
    if (mode === 'text' && !text.trim()) {
      setError('请输入文字内容')
      return
    }

    setStatus(mode === 'url' ? 'fetching' : 'ai')
    try {
      const note = await (mode === 'url'
        ? generateNoteFromUrl(url.trim())
        : generateNoteFromText(text.trim())
      )
      if (mode === 'url') setStatus('ai')
      saveNote(note)
      setStatus('done')
      setTimeout(() => navigate(`/note/${note.id}`), 200)
    } catch (err) {
      const msg = err instanceof Error ? err.message : '生成失败，请稍后重试'
      setError(msg)
      setStatus('idle')
    }
  }, [mode, url, text, navigate])

  return (
    <div className="home-page">
      <div className="hero-section">
        <div className="hero-mark">—</div>
        <h1 className="hero-title">
          灵知<span>笔记</span>
        </h1>
        <p className="hero-desc">输入链接或文字，AI 自动生成精美的双页签图文笔记</p>
        <div className="hero-rule" />
      </div>

      {!apiReady && (
        <div className="api-notice">
          <span>API 未配置，使用示例数据演示</span>
          <button onClick={() => navigate('/settings')}>设置</button>
        </div>
      )}

      {error && (
        <div className="error-banner">
          <span>{error}</span>
          <button onClick={handleGenerate}>重试</button>
        </div>
      )}

      <div className="mode-tabs">
        <button
          className={`mode-tab ${mode === 'url' ? 'active' : ''}`}
          onClick={() => setMode('url')}
        >
          网页链接
        </button>
        <button
          className={`mode-tab ${mode === 'text' ? 'active' : ''}`}
          onClick={() => setMode('text')}
        >
          纯文字
        </button>
      </div>

      <div className="input-section">
        {mode === 'url' ? (
          <input
            className="url-input"
            type="url"
            placeholder="粘贴网页链接..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
        ) : (
          <textarea
            className="text-input"
            placeholder="输入或粘贴文字内容..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={8}
          />
        )}
      </div>

      <button
        className="btn-generate"
        disabled={loading || (!url.trim() && !text.trim())}
        onClick={handleGenerate}
      >
        {loading ? STATUS_LABEL[status] : STATUS_LABEL.idle}
      </button>

      <div className="bottom-nav">
        <button onClick={() => navigate('/notes')}>我的笔记</button>
        <button onClick={() => navigate('/settings')}>设置</button>
      </div>
    </div>
  )
}
