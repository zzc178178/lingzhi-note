import { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import NoteIframe from '../components/NoteIframe'
import { getNote, deleteNote } from '../utils/storage'
import { downloadNoteAsHtml } from '../utils/template-builder'
import { NoteData } from '../utils/note-model'
import './Note.scss'

export default function Note() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [note, setNote] = useState<NoteData | null>(null)
  const [showDelete, setShowDelete] = useState(false)

  const loadNote = useCallback(() => {
    if (!id) return
    const data = getNote(id)
    if (data) setNote(data)
  }, [id])

  useEffect(() => { loadNote() }, [loadNote])

  const handleExport = () => {
    if (!note) return
    downloadNoteAsHtml(note)
  }

  const handleDelete = () => setShowDelete(true)

  const confirmDelete = () => {
    if (!note) return
    deleteNote(note.id)
    setShowDelete(false)
    navigate('/notes', { replace: true })
  }

  if (!note) {
    return (
      <div className="note-page">
        <div className="empty-state">
          <div className="empty-icon">—</div>
          <div className="empty-text">笔记未找到</div>
          <div className="empty-hint">请从笔记列表重新打开</div>
          <button className="btn-primary" onClick={() => navigate('/notes')}>返回列表</button>
        </div>
      </div>
    )
  }

  return (
    <div className="note-page">
      <div className="top-bar">
        <button className="top-bar-back" onClick={() => navigate(-1)}>
          ← 返回
        </button>
        <div className="top-bar-actions">
          <button onClick={handleExport}>导出</button>
          <button className="danger" onClick={handleDelete}>删除</button>
        </div>
      </div>

      <NoteIframe note={note} />

      {showDelete && (
        <div className="modal-overlay" onClick={() => setShowDelete(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-title">删除笔记</div>
            <div className="modal-message">确定要删除这条笔记吗？删除后无法恢复。</div>
            <div className="modal-actions">
              <button className="btn-cancel" onClick={() => setShowDelete(false)}>取消</button>
              <button className="btn-confirm" onClick={confirmDelete}>删除</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
