import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getApiConfig, setApiConfig, getNoteIndex, deleteNote, getAllNotes, getProxyUrl, setProxyUrl, MODEL_PRESETS, getPresetById, saveApiKeyForPreset, getApiKeyForPreset } from '../utils/storage'
import './Settings.scss'

export default function Settings() {
  const navigate = useNavigate()
  const [presetId, setPresetId] = useState('deepseek')
  const [apiUrl, setApiUrl] = useState('')
  const [apiKey, setApiKey] = useState('')
  const [apiModel, setApiModel] = useState('')
  const [proxyUrl, setProxyLocal] = useState('')
  const [saved, setSaved] = useState(false)
  const [noteCount, setNoteCount] = useState(0)
  const [showKey, setShowKey] = useState(false)

  useEffect(() => {
    const config = getApiConfig()
    setPresetId(config.presetId)
    setApiUrl(config.url)
    setApiKey(config.key)
    setApiModel(config.model)
    setProxyLocal(getProxyUrl())

    const index = getNoteIndex()
    setNoteCount(index.length)
  }, [])

  const handlePresetChange = (newPresetId: string) => {
    const prevPresetId = presetId
    if (prevPresetId && apiKey) {
      saveApiKeyForPreset(prevPresetId, apiKey)
    }

    setPresetId(newPresetId)

    const preset = getPresetById(newPresetId)
    if (preset && newPresetId !== 'custom') {
      setApiUrl(preset.url)
      setApiModel(preset.model)
    }

    const rememberedKey = getApiKeyForPreset(newPresetId)
    if (rememberedKey) {
      setApiKey(rememberedKey)
    } else {
      setApiKey('')
    }
  }

  const handleSave = () => {
    if (presetId && apiKey) {
      saveApiKeyForPreset(presetId, apiKey)
    }
    setApiConfig({ url: apiUrl, key: apiKey, model: apiModel, presetId })
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

  const currentPreset = getPresetById(presetId)
  const hasRememberedKey = presetId ? !!getApiKeyForPreset(presetId) : false

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
          <h2>AI 模型</h2>
          <p className="section-desc">选择模型提供商，自动填充接口地址和模型名称</p>

          <label className="field-label">模型提供商</label>
          <div className="preset-grid">
            {MODEL_PRESETS.map(p => (
              <button
                key={p.id}
                className={`preset-btn ${presetId === p.id ? 'active' : ''}`}
                onClick={() => handlePresetChange(p.id)}
              >
                <span className="preset-name">{p.name}</span>
                <span className="preset-provider">{p.provider}</span>
              </button>
            ))}
          </div>

          <label className="field-label">
            接口地址
            {currentPreset && presetId !== 'custom' && (
              <span className="field-label-tag">预设</span>
            )}
          </label>
          <input
            className="field-input"
            value={apiUrl}
            onChange={(e) => setApiUrl(e.target.value)}
            placeholder="https://api.deepseek.com"
            readOnly={presetId !== 'custom'}
          />

          <label className="field-label">
            API Key
            {hasRememberedKey && !apiKey && (
              <span className="field-label-tag tag-green">已记忆</span>
            )}
          </label>
          <div className="key-input-row">
            <input
              className="field-input key-input"
              type={showKey ? 'text' : 'password'}
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="sk-..."
            />
            <button
              className="btn-toggle-key"
              onClick={() => setShowKey(!showKey)}
              type="button"
            >
              {showKey ? '隐藏' : '显示'}
            </button>
          </div>
          <p className="field-hint">切换模型时自动填充已保存的 Key，无需重复输入</p>

          <label className="field-label">
            模型名称
            {currentPreset && presetId !== 'custom' && (
              <span className="field-label-tag">预设</span>
            )}
          </label>
          <input
            className="field-input"
            value={apiModel}
            onChange={(e) => setApiModel(e.target.value)}
            placeholder="deepseek-chat"
            readOnly={presetId !== 'custom'}
          />

          <label className="field-label">解析代理地址</label>
          <input
            className="field-input"
            value={proxyUrl}
            onChange={(e) => setProxyLocal(e.target.value)}
            placeholder="http://127.0.0.1:8765"
          />
          <p className="field-hint">Cloudflare Pages 部署后自动使用同域代理，无需修改</p>

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
