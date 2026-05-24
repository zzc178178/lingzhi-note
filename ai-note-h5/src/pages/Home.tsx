import { useState, useCallback, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { generateNoteFromUrl, generateNoteFromText } from '../utils/ai-generate'
import { saveNote, isApiConfigured } from '../utils/storage'
import { assetUrl } from '../utils/assets'
import './Home.scss'

type GenStatus = 'idle' | 'fetching' | 'ai' | 'done'

const STATUS_CONFIG: Record<GenStatus, { label: string; step: number }> = {
  idle: { label: '生成笔记', step: 0 },
  fetching: { label: '正在解析网页...', step: 1 },
  ai: { label: 'AI 分析内容...', step: 2 },
  done: { label: '生成笔记中...', step: 3 },
}

const URL_STEPS = [
  { num: 1, title: '解析内容', desc: '读取网页内容' },
  { num: 2, title: 'AI 分析', desc: '提取核心要点' },
  { num: 3, title: '生成笔记', desc: '排版美化输出' },
]

const TEXT_STEPS = [
  { num: 1, title: 'AI 分析', desc: '提取核心要点' },
  { num: 2, title: '生成笔记', desc: '排版美化输出' },
]

export default function Home() {
  const navigate = useNavigate()
  const [mode, setMode] = useState<'url' | 'text'>('url')
  const [url, setUrl] = useState('')
  const [text, setText] = useState('')
  const [status, setStatus] = useState<GenStatus>('idle')
  const [error, setError] = useState('')
  const [showFallback, setShowFallback] = useState(false)
  const loading = status !== 'idle'
  const currentStep = STATUS_CONFIG[status].step
  const apiReady = isApiConfigured()

  const steps = useMemo(() => mode === 'url' ? URL_STEPS : TEXT_STEPS, [mode])

  const getActiveStepIndex = useCallback(() => {
    if (mode === 'text') {
      if (status === 'ai') return 1
      if (status === 'done') return 2
      return 0
    }
    return currentStep
  }, [mode, status, currentStep])

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
      if (msg.includes('反爬') || msg.includes('无法获取') || msg.includes('无法解析')) {
        setShowFallback(true)
      }
    }
  }, [mode, url, text, navigate])

  const switchToTextMode = () => {
    setMode('text')
    setShowFallback(false)
    setError('')
  }

  const activeStep = getActiveStepIndex()

  return (
    <div className="home-page">
      <div className="hero-section">
        <img className="hero-logo" src={assetUrl('/logo.svg')} alt="灵知笔记" />
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
          <div className="error-content">
            <span className="error-text">{error}</span>
          </div>
          <div className="error-actions">
            <button className="btn-retry" onClick={handleGenerate}>重试</button>
            {showFallback && mode === 'url' && (
              <button className="btn-fallback" onClick={switchToTextMode}>
                粘贴原文
              </button>
            )}
          </div>
        </div>
      )}

      {showFallback && mode === 'url' && (
        <div className="fallback-tip">
          <div className="fallback-tip-title">兜底方案</div>
          <ol className="fallback-steps">
            <li>打开该网页，全选复制（Ctrl+A → Ctrl+C）</li>
            <li>点击上方「粘贴原文」切换到文字模式</li>
            <li>将复制的文字粘贴到文本框</li>
            <li>点击「生成笔记」让 AI 直接总结</li>
          </ol>
        </div>
      )}

      <div className="mode-tabs">
        <button
          className={`mode-tab ${mode === 'url' ? 'active' : ''}`}
          onClick={() => { setMode('url'); setShowFallback(false); }}
        >
          网页链接
        </button>
        <button
          className={`mode-tab ${mode === 'text' ? 'active' : ''}`}
          onClick={() => { setMode('text'); setShowFallback(false); }}
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
            placeholder={showFallback ? "在此粘贴从网页复制的文字内容..." : "输入或粘贴文字内容..."}
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
        {loading ? (
          <span className="btn-loading">
            <span className="spinner" />
            {STATUS_CONFIG[status].label}
          </span>
        ) : (
          STATUS_CONFIG.idle.label
        )}
      </button>

      {loading && (
        <div className="progress-steps">
          {steps.map((s, idx) => {
            const stepNum = idx + 1
            const active = activeStep >= stepNum
            const current = activeStep === stepNum
            return (
              <div key={s.title} className={`step ${active ? 'active' : ''} ${current ? 'current' : ''}`}>
                <div className="step-num">{active && !current ? '✓' : stepNum}</div>
                <div className="step-info">
                  <div className="step-title">{s.title}</div>
                  <div className="step-desc">{s.desc}</div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      <div className="bottom-nav">
        <button onClick={() => navigate('/notes')}>我的笔记</button>
        <button onClick={() => navigate('/settings')}>设置</button>
        <button onClick={() => navigate('/about')}>关于</button>
      </div>
    </div>
  )
}
