import { getStorageJSON, setStorageJSON, removeStorage, getStorage } from '../utils/storage'
import { NoteData, NoteIndexItem, createNote, toIndexItem, generateId } from '../utils/note-model'

const NOTE_PREFIX = 'ai_note_'
const INDEX_KEY = 'ai_note_index'

export function getNoteIndex(): NoteIndexItem[] {
  return getStorageJSON<NoteIndexItem[]>(INDEX_KEY) || []
}

function saveIndex(items: NoteIndexItem[]): void {
  setStorageJSON(INDEX_KEY, items)
}

export function getNote(id: string): NoteData | null {
  const key = NOTE_PREFIX + id
  const result = getStorageJSON<NoteData>(key)
  console.log('[getNote] key=', key, 'found=', !!result)
  return result
}

export function saveNote(note: NoteData): void {
  try {
    setStorageJSON(NOTE_PREFIX + note.id, note)
    console.log('[saveNote] OK key=', NOTE_PREFIX + note.id, 'title=', note.title)
  } catch (err) {
    console.error('[saveNote] FAILED:', err)
    throw err
  }

  const index = getNoteIndex()
  const existing = index.findIndex((item) => item.id === note.id)
  if (existing >= 0) {
    index[existing] = toIndexItem(note)
  } else {
    index.push(toIndexItem(note))
  }

  index.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
  saveIndex(index)
}

export function deleteNote(id: string): void {
  removeStorage(NOTE_PREFIX + id)
  const index = getNoteIndex().filter((item) => item.id !== id)
  saveIndex(index)
}

export function getAllNotes(): NoteData[] {
  const index = getNoteIndex()
  return index
    .map((item) => getNote(item.id))
    .filter((n): n is NoteData => n !== null)
}

export function searchNotes(query: string): NoteData[] {
  const q = query.toLowerCase()
  return getAllNotes().filter(
    (n) =>
      n.title.toLowerCase().includes(q) ||
      n.tag.toLowerCase().includes(q)
  )
}

export async function generateNoteFromContent(
  content: string,
  sourceUrl: string = ''
): Promise<NoteData> {
  const note = createNote({
    title: '新笔记',
    subtitle: '正在生成中...',
    tag: 'AI',
    source: sourceUrl,
    textContent: content,
    diagramContent: ''
  })
  saveNote(note)
  return note
}