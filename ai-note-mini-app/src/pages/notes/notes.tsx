import { View, Text, Input } from '@tarojs/components'
import { useState, useEffect, useCallback } from 'react'
import Taro, { useDidShow } from '@tarojs/taro'
import { getNoteIndex, NoteIndexItem } from '../../utils/note-model'
import { getNoteIndex as getIndex } from '../../services/note-service'
import './notes.scss'

export default function Notes() {
  const [notes, setNotes] = useState<NoteIndexItem[]>([])
  const [search, setSearch] = useState('')

  const loadNotes = useCallback(() => {
    const index = getIndex()
    setNotes(index)
  }, [])

  useEffect(() => {
    loadNotes()
  }, [])

  useDidShow(() => {
    loadNotes()
  })

  const filtered = notes.filter(
    (n) => n.title.includes(search) || n.tag.includes(search)
  )

  const handleOpenNote = (id: string) => {
    Taro.navigateTo({ url: `/pages/note/note?id=${id}` })
  }

  return (
    <View className='notes-page'>
      <View className='search-bar'>
        <Input
          className='search-input'
          placeholder='搜索笔记...'
          value={search}
          onInput={(e) => setSearch(e.detail.value)}
        />
      </View>

      {filtered.length === 0 ? (
        <View className='empty-state'>
          <Text className='empty-icon'>📭</Text>
          <Text className='empty-text'>还没有笔记</Text>
          <Text className='empty-hint'>去首页创建你的第一篇 AI 笔记吧</Text>
        </View>
      ) : (
        <View className='note-list'>
          {filtered.map((note) => (
            <View
              key={note.id}
              className='note-card'
              onClick={() => handleOpenNote(note.id)}
            >
              <View className='card-content'>
                <View className='card-tag'>{note.tag}</View>
                <Text className='card-title'>{note.title}</Text>
                <Text className='card-date'>{note.createdAt.substring(0, 10)}</Text>
              </View>
              <Text className='card-arrow'>→</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  )
}