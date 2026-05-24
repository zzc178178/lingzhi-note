import { View, Text } from '@tarojs/components'
import './NoteHeader.scss'

interface NoteHeaderProps {
  tag: string
  title: string
  subtitle?: string
  source?: string
}

export default function NoteHeader({ tag, title, subtitle, source }: NoteHeaderProps) {
  return (
    <View className='note-header'>
      <View className='note-tag'>{tag}</View>
      <Text className='note-title'>{title}</Text>
      {subtitle && <Text className='note-subtitle'>{subtitle}</Text>}
      {source && (
        <View className='note-source'>
          <Text className='source-label'>原文来源</Text>
          <Text className='source-link'>{source}</Text>
        </View>
      )}
    </View>
  )
}