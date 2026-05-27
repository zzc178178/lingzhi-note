import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { NoteData } from '../utils/note-model'
import { getAllNotes, deleteNote } from '../utils/storage'
import { assetUrl } from '../utils/assets'
import './Notes.scss'

function snippet(note: NoteData): string {
  const text = note.textContent.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
  return text.length > 60 ? text.substring(0, 60) + '...' : text
}

export default function Notes() {
  const navigate = useNavigate()
  const [notes, setNotes] = useState<NoteData[]>([])
  const [search, setSearch] = useState('')

  const loadNotes = useCallback(() => {
    setNotes(getAllNotes())
  }, [])

  useEffect(() => { loadNotes() }, [loadNotes])

  const filtered = notes.filter(
    (n) => n.title.includes(search) || n.tag.includes(search)
  )

  return (
    <div className="notes-page">
      <div className="top-bar">
        <button className="top-bar-back" onClick={() => navigate('/')}>
          ← 首页
        </button>
        <h1 className="page-title">我的笔记</h1>
        <div style={{ width: 60 }} />
      </div>

      <div className="notes-body">
        <div className="search-bar">
          <input
            className="search-input"
            placeholder="搜索笔记..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {filtered.length === 0 ? (
          <div className="empty-state">
            <img className="empty-logo" src={assetUrl('/logo.svg')} alt="" />
            <div className="empty-text">还没有笔记</div>
            <div className="empty-hint">去首页创建第一篇灵知笔记</div>
            <button className="btn-primary" onClick={() => navigate('/')}>去创建</button>
          </div>
        ) : (
          <div className="note-list">
            {filtered.map((note) => (
              <div
                key={note.id}
                className="note-card"
                onClick={() => navigate(`/note/${note.id}`)}
              >
                <div className="card-content">
                  <span className="card-tag">{note.tag}</span>
                  <div className="card-title">{note.title}</div>
                  <div className="card-snippet">{snippet(note)}</div>
                  <div className="card-date">{note.createdAt.substring(0, 10)}</div>
                </div>
                <button
                  className="card-share"
                  onClick={(e) => {
                    e.stopPropagation()
                    const shareUrl = `${window.location.origin}${window.location.pathname}#/note/${note.id}`
                    navigator.clipboard.writeText(shareUrl)
                      .then(() => alert('链接已复制'))
                      .catch(() => alert('复制失败'))
                  }}
                >🔗</button>
                <button
                  className="card-delete"
                  onClick={(e) => {
                    e.stopPropagation()
                    if (window.confirm('删除这条笔记？')) {
                      deleteNote(note.id)
                      loadNotes()
                    }
                  }}
                >🗑</button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
