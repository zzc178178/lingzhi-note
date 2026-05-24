import { View, Text, Switch, Input } from '@tarojs/components'
import { useState, useCallback } from 'react'
import Taro, { useDidShow } from '@tarojs/taro'
import { useTheme } from '../../hooks/useTheme'
import { getNoteIndex, deleteNote } from '../../services/note-service'
import { getApiConfig, setApiConfig, isApiConfigured } from '../../services/ai-generate'
import { showSuccessToast } from '../../utils/errors'
import './settings.scss'

export default function Settings() {
  const { isDark, toggleTheme } = useTheme()
  const [storageSize, setStorageSize] = useState('0 KB')
  const [noteCount, setNoteCount] = useState(0)
  const [apiConfig, setApiConfigState] = useState(getApiConfig())
  const [showApiConfig, setShowApiConfig] = useState(false)

  const refreshStats = useCallback(() => {
    const index = getNoteIndex()
    setNoteCount(index.length)
    const total = JSON.stringify(index).length
    if (total < 1024) setStorageSize(`${total} B`)
    else if (total < 1024 * 1024) setStorageSize(`${(total / 1024).toFixed(1)} KB`)
    else setStorageSize(`${(total / (1024 * 1024)).toFixed(1)} MB`)
  }, [])

  useDidShow(() => {
    refreshStats()
    setApiConfigState(getApiConfig())
  })

  const handleClearAll = () => {
    if (noteCount === 0) {
      Taro.showToast({ title: '没有笔记可删除', icon: 'none' })
      return
    }
    Taro.showModal({
      title: '清除所有笔记',
      content: `确定要删除全部 ${noteCount} 条笔记吗？此操作不可恢复。`,
      confirmText: '删除全部',
      confirmColor: '#e74c3c',
      success: (res) => {
        if (res.confirm) {
          const index = getNoteIndex()
          index.forEach((item) => deleteNote(item.id))
          showSuccessToast('已清除所有笔记')
          refreshStats()
        }
      }
    })
  }

  const handleSaveApiConfig = () => {
    setApiConfig(apiConfig)
    showSuccessToast('API 配置已保存')
  }

  const apiConfigured = isApiConfigured()

  return (
    <View className='settings-page'>
      <View className='settings-section'>
        <Text className='section-title'>AI 服务</Text>
        <View className='setting-item' onClick={() => setShowApiConfig(!showApiConfig)}>
          <Text className='setting-label'>API 配置</Text>
          <View className='setting-right'>
            <View className={`api-status ${apiConfigured ? 'connected' : 'disconnected'}`}>
              <View className='status-dot' />
              <Text className='status-text'>{apiConfigured ? '已配置' : '未配置'}</Text>
            </View>
            <Text className='setting-arrow'>{showApiConfig ? '▼' : '▶'}</Text>
          </View>
        </View>

        {showApiConfig && (
          <View className='api-config-panel'>
            <View className='config-field'>
              <Text className='config-label'>API 地址</Text>
              <Input
                className='config-input'
                placeholder='如 https://api.deepseek.com'
                value={apiConfig.url}
                onInput={(e) => setApiConfigState({ ...apiConfig, url: e.detail.value })}
              />
            </View>
            <View className='config-field'>
              <Text className='config-label'>API Key</Text>
              <Input
                className='config-input'
                type='safe-password'
                placeholder='sk-...'
                value={apiConfig.key}
                onInput={(e) => setApiConfigState({ ...apiConfig, key: e.detail.value })}
              />
            </View>
            <View className='config-field'>
              <Text className='config-label'>模型</Text>
              <Input
                className='config-input'
                placeholder='gpt-4o-mini / deepseek-chat'
                value={apiConfig.model}
                onInput={(e) => setApiConfigState({ ...apiConfig, model: e.detail.value })}
              />
            </View>
            <View className='config-hint'>
              <Text>支持 OpenAI 兼容接口（DeepSeek、通义千问、Kimi 等）</Text>
            </View>
            <View className='config-save' onClick={handleSaveApiConfig}>
              <Text className='save-btn'>保存配置</Text>
            </View>
          </View>
        )}
      </View>

      <View className='settings-section'>
        <Text className='section-title'>外观</Text>
        <View className='setting-item' onClick={toggleTheme}>
          <Text className='setting-label'>深色模式</Text>
          <Switch checked={isDark} color='#667eea' />
        </View>
      </View>

      <View className='settings-section'>
        <Text className='section-title'>数据</Text>
        <View className='setting-item'>
          <Text className='setting-label'>笔记数量</Text>
          <Text className='setting-value'>{noteCount} 条</Text>
        </View>
        <View className='setting-item'>
          <Text className='setting-label'>存储空间</Text>
          <Text className='setting-value'>{storageSize}</Text>
        </View>
        <View className='setting-item setting-item--danger' onClick={handleClearAll}>
          <Text className='setting-label setting-label--danger'>清除所有笔记</Text>
          <Text className='setting-arrow'>→</Text>
        </View>
      </View>

      <View className='settings-section'>
        <Text className='section-title'>关于</Text>
        <View className='setting-item'>
          <Text className='setting-label'>版本</Text>
          <Text className='setting-value'>v1.0.0</Text>
        </View>
        <View className='setting-item'>
          <Text className='setting-label'>灵知笔记</Text>
          <Text className='setting-desc'>双页签 AI 图文笔记生成器</Text>
        </View>
      </View>
    </View>
  )
}