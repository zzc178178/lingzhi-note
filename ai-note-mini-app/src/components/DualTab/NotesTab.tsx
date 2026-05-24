import { View, Textarea } from '@tarojs/components'
import { useState, useEffect, useCallback } from 'react'
import { getStorage, setStorage } from '../../utils/storage'
import './NotesTab.scss'

interface NotesTabProps {
  noteId: string
}

export default function NotesTab({ noteId }: NotesTabProps) {
  const storageKey = `ai_note_user_notes_${noteId}`
  const [content, setContent] = useState('')
  const [saved, setSaved] = useState(true)

  useEffect(() => {
    const savedContent = getStorage(storageKey) || ''
    setContent(savedContent)
  }, [noteId])

  const autoSave = useCallback((value: string) => {
    setContent(value)
    setSaved(false)

    setTimeout(() => {
      setStorage(storageKey, value)
      setSaved(true)
    }, 3000)
  }, [storageKey])

  return (
    <View className='notes-tab'>
      <View className='notes-toolbar'>
        <View className={`save-indicator ${saved ? 'saved' : 'saving'}`}>
          <View className='save-dot' />
          {saved ? '已保存' : '保存中...'}
        </View>
      </View>
      <Textarea
        className='notes-textarea'
        value={content}
        onInput={(e) => autoSave(e.detail.value)}
        placeholder='在这里写下你的思考和笔记...'
        placeholderClass='notes-placeholder'
        autoHeight
        maxlength={50000}
      />
    </View>
  )
}