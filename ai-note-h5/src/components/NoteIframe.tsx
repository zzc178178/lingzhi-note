import { useEffect, useRef, useState, useCallback } from 'react'
import { buildNoteHtml } from '../utils/template-builder'
import { NoteData } from '../utils/note-model'

interface NoteIframeProps {
  note: NoteData
}

export default function NoteIframe({ note }: NoteIframeProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const [height, setHeight] = useState(0)
  const [loading, setLoading] = useState(true)

  const handleMessage = useCallback((event: MessageEvent) => {
    if (event.data?.type === '灵知笔记-resize' && event.data?.height) {
      setHeight(event.data.height)
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [handleMessage])

  useEffect(() => {
    setLoading(true)
    setHeight(0)

    const html = buildNoteHtml(note)
    const iframe = iframeRef.current
    if (!iframe) return

    const blob = new Blob([html], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    iframe.src = url

    return () => {
      URL.revokeObjectURL(url)
    }
  }, [note])

  return (
    <div style={{ position: 'relative', minHeight: loading ? '400px' : '0px' }}>
      {loading && (
        <div style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#f5f5f7',
          zIndex: 1
        }}>
          <span style={{
            fontSize: '0.875rem',
            color: 'var(--ink-muted, #78716c)',
            opacity: 0.5
          }}>
            排版中…
          </span>
        </div>
      )}
      <iframe
        ref={iframeRef}
        style={{
          width: '100%',
          height: height ? `${height}px` : '0px',
          border: 'none',
          overflow: 'hidden',
          opacity: loading ? 0 : 1,
          transition: 'opacity 0.2s'
        }}
        title={note.title}
        sandbox="allow-scripts allow-same-origin"
        scrolling="no"
      />
    </div>
  )
}
