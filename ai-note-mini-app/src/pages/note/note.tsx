import { View, Text } from '@tarojs/components'
import Taro, { useRouter, useDidShow } from '@tarojs/taro'
import { useState, useEffect, useCallback } from 'react'
import NoteHeader from '../../components/NoteHeader/NoteHeader'
import DualTabNavigation from '../../components/DualTab/DualTabNavigation'
import TextTab from '../../components/DualTab/TextTab'
import DiagramTab from '../../components/DualTab/DiagramTab'
import NotesTab from '../../components/DualTab/NotesTab'
import ConfirmDialog from '../../components/ConfirmDialog/ConfirmDialog'
import { getNote, deleteNote } from '../../services/note-service'
import { downloadNoteAsHtml } from '../../services/export-service'
import { NoteData } from '../../utils/note-model'
import { showSuccessToast, showErrorToast } from '../../utils/errors'
import './note.scss'

const TABS = [
  { key: 'text', label: '文字', icon: '📝' },
  { key: 'diagram', label: '图解', icon: '🎨' },
  { key: 'notes', label: '随手记', icon: '✏️' }
]

export default function Note() {
  const router = useRouter()
  const noteId = (router.params.id as string) || ''
  const [activeTab, setActiveTab] = useState('text')
  const [note, setNote] = useState<NoteData | null>(null)
  const [showDelete, setShowDelete] = useState(false)
  const [exporting, setExporting] = useState(false)

  const loadNote = useCallback(() => {
    console.log('[loadNote] noteId=', noteId, 'router.params=', router.params)
    if (!noteId) return
    const data = getNote(noteId)
    console.log('[loadNote] data found=', !!data)
    if (data) setNote(data)
  }, [noteId, router.params])

  useEffect(() => { loadNote() }, [loadNote])
  useDidShow(() => { loadNote() })

  const handleShare = () => {
    if (!note) return
    const text = `${note.title}\n${note.subtitle}`
    if (Taro.canIUse('setClipboardData')) {
      Taro.setClipboardData({ data: text }).then(() => {
        showSuccessToast('内容已复制到剪贴板')
      })
    } else {
      showSuccessToast('分享功能开发中')
    }
  }

  const handleExport = async () => {
    if (!note || exporting) return
    setExporting(true)
    try {
      await downloadNoteAsHtml(note)
      showSuccessToast('笔记已导出')
    } catch {
      showErrorToast({ code: 'ERR', message: '导出失败，请重试' })
    } finally {
      setExporting(false)
    }
  }

  const handleDelete = () => {
    setShowDelete(true)
  }

  const confirmDelete = () => {
    if (!note) return
    deleteNote(note.id)
    showSuccessToast('笔记已删除')
    setShowDelete(false)
    Taro.navigateBack()
  }

  if (!note) {
    return (
      <View className='note-page'>
        <View className='note-empty'>
          <View className='empty-icon'>📭</View>
          <View className='empty-text'>笔记未找到</View>
          <View className='empty-hint'>请从笔记列表打开笔记</View>
        </View>
      </View>
    )
  }

  return (
    <View className='note-page'>
      <View className='note-top-bar'>
        <View className='top-bar-back' onClick={() => Taro.navigateBack()}>
          <Text className='top-bar-icon'>←</Text>
          <Text className='top-bar-text'>返回</Text>
        </View>
        <View className='top-bar-actions'>
          <View className='top-bar-btn' onClick={handleShare}>
            <Text className='top-bar-btn-icon'>📤</Text>
            <Text className='top-bar-btn-text'>分享</Text>
          </View>
          <View className={`top-bar-btn ${exporting ? 'disabled' : ''}`} onClick={handleExport}>
            <Text className='top-bar-btn-icon'>💾</Text>
            <Text className='top-bar-btn-text'>{exporting ? '导出中' : '导出'}</Text>
          </View>
          <View className='top-bar-btn danger' onClick={handleDelete}>
            <Text className='top-bar-btn-icon'>🗑</Text>
            <Text className='top-bar-btn-text'>删除</Text>
          </View>
        </View>
      </View>

      <NoteHeader
        tag={note.tag}
        title={note.title}
        subtitle={note.subtitle}
      />

      <DualTabNavigation
        tabs={TABS}
        activeTab={activeTab}
        onChange={setActiveTab}
      >
        {(tab) => {
          switch (tab) {
            case 'text':
              return <TextTab htmlContent={note.textContent} />
            case 'diagram':
              return <DiagramTab htmlContent={note.diagramContent} />
            case 'notes':
              return <NotesTab noteId={note.id} />
            default:
              return null
          }
        }}
      </DualTabNavigation>

      <ConfirmDialog
        visible={showDelete}
        title='删除笔记'
        message='确定要删除这条笔记吗？删除后将无法恢复。'
        confirmText='删除'
        cancelText='取消'
        onConfirm={confirmDelete}
        onCancel={() => setShowDelete(false)}
      />
    </View>
  )
}