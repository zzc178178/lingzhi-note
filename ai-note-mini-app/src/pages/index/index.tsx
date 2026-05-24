import { View, Text, Button } from '@tarojs/components'
import Taro, { useLoad } from '@tarojs/taro'
import { getNoteIndex } from '../../services/note-service'
import { useState } from 'react'
import './index.scss'

export default function Index() {
  const [noteCount, setNoteCount] = useState(0)

  useLoad(() => {
    const index = getNoteIndex()
    setNoteCount(index.length)
  })

  const goToCreate = () => {
    Taro.navigateTo({ url: '/pages/create/create' })
  }

  const goToNotes = () => {
    Taro.navigateTo({ url: '/pages/notes/notes' })
  }

  const goToSettings = () => {
    Taro.navigateTo({ url: '/pages/settings/settings' })
  }

  return (
    <View className='home-page'>
      <View className='hero-section'>
        <View className='hero-icon'>📝</View>
        <Text className='hero-title'>AI 笔记</Text>
        <Text className='hero-desc'>输入链接或文字，AI 自动生成双页签图文笔记</Text>
      </View>

      <View className='action-section'>
        <Button className='btn-create' hoverClass='btn-create--hover' onClick={goToCreate}>
          ✨ 创建笔记
        </Button>
      </View>

      {noteCount > 0 && (
        <View className='recent-section'>
          <View className='section-header'>
            <Text className='section-title'>我的笔记</Text>
            <Text className='section-more' onClick={goToNotes}>查看全部 →</Text>
          </View>
          <Text className='note-count'>共 {noteCount} 条笔记</Text>
        </View>
      )}

      <View className='bottom-nav'>
        <View className='bottom-link' onClick={goToNotes}>
          <Text>📋 我的笔记</Text>
        </View>
        <View className='bottom-link' onClick={goToSettings}>
          <Text>⚙️ 设置</Text>
        </View>
      </View>
    </View>
  )
}