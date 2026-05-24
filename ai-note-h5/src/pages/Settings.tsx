import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getApiConfig, setApiConfig, getNoteIndex, deleteNote, getAllNotes, getProxyUrl, setProxyUrl } from '../utils/storage'
import './Settings.scss'

export default function Settings() {
  const navigate = useNavigate()
  const [apiUrl, setApiUrl] = useState('')
  const [apiKey, setApiKey] = useState('')
  const [apiModel, setApiModel] = useState('')
  const [proxyUrl, setProxyLocal] = useState('')
  const [saved, setSaved] = useState(false)
  const [noteCount, setNoteCount] = useState(0)

  useEffect(() => {
    const config = getApiConfig()
    setApiUrl(config.url)
    setApiKey(config.key)
    setApiModel(config.model)
    setProxyLocal(getProxyUrl())

    const index = getNoteIndex()
    setNoteCount(index.length)
  }, [])

  const handleSave = () => {
    setApiConfig({ url: apiUrl, key: apiKey, model: apiModel })
    setProxyUrl(proxyUrl)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const handleClearAll = () => {
    if (noteCount === 0) {
      alert('没有笔记可删除')
      return
    }
    if (window.confirm('确定要删除所有笔记吗？此操作不可恢复。')) {
      const notes = getAllNotes()
      notes.forEach(n => deleteNote(n.id))
      setNoteCount(0)
    }
  }

  return (
    <div className="settings-page">
      <div className="top-bar">
        <button className="top-bar-back" onClick={() => navigate('/')}>
          ← 返回
        </button>
        <h1 className="page-title">设置</h1>
        <div style={{ width: 60 }} />
      </div>

      <div className="settings-body">
        <div className="settings-section">
          <h2>外观</h2>
          <p className="section-desc">切换深色/浅色主题</p>
          <label className="toggle-row">
            <span>深色模式</span>
            <input type="checkbox" defaultChecked={localStorage.getItem('dark') === '1'}
              onChange={(e) => {
                const on = e.target.checked
                localStorage.setItem('dark', on ? '1' : '0')
                document.body.classList.toggle('dark', on)
              }} />
          </label>
        </div>

        <div className="settings-section">
          <h2>API 配置</h2>
          <p className="section-desc">兼容 DeepSeek / OpenAI 接口格式，配置后启用真实 AI 生成</p>

          <label className="field-label">接口地址</label>
          <input
            className="field-input"
            value={apiUrl}
            onChange={(e) => setApiUrl(e.target.value)}
            placeholder="https://api.deepseek.com"
          />

          <label className="field-label">API Key</label>
          <input
            className="field-input"
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="sk-..."
          />

          <label className="field-label">模型名称</label>
          <input
            className="field-input"
            value={apiModel}
            onChange={(e) => setApiModel(e.target.value)}
            placeholder="deepseek-chat"
          />

          <label className="field-label">抓取代理地址</label>
          <input
            className="field-input"
            value={proxyUrl}
            onChange={(e) => setProxyLocal(e.target.value)}
            placeholder="http://127.0.0.1:8765"
          />
          <p className="field-hint">部署到 Cloudflare Worker 后替换为 Worker 地址</p>

          <button className="btn-save" onClick={handleSave}>
            {saved ? '已保存' : '保存配置'}
          </button>
        </div>

        <div className="settings-section">
          <h2>数据管理</h2>
          <p className="section-desc">当前共 {noteCount} 条笔记，数据存储在浏览器本地</p>
          <button className="btn-danger" onClick={handleClearAll}>
            清除所有笔记
          </button>
        </div>
      </div>
    </div>
  )
}
