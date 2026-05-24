import { NoteData, NoteIndexItem, toIndexItem } from './note-model'

const NOTE_PREFIX = 'ai_note_'
const INDEX_KEY = 'ai_note_index'

export function getStorageJSON<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return null
    return JSON.parse(raw) as T
  } catch {
    return null
  }
}

export function setStorageJSON<T>(key: string, value: T): void {
  localStorage.setItem(key, JSON.stringify(value))
}

export function removeStorage(key: string): void {
  localStorage.removeItem(key)
}

export function getNoteIndex(): NoteIndexItem[] {
  return getStorageJSON<NoteIndexItem[]>(INDEX_KEY) || []
}

function saveIndex(items: NoteIndexItem[]): void {
  setStorageJSON(INDEX_KEY, items)
}

export function getNote(id: string): NoteData | null {
  return getStorageJSON<NoteData>(NOTE_PREFIX + id)
}

export function saveNote(note: NoteData): void {
  setStorageJSON(NOTE_PREFIX + note.id, note)

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

export function getApiConfig(): { url: string; key: string; model: string } {
  return {
    url: localStorage.getItem('ai_note_api_url') || 'https://api.deepseek.com',
    key: localStorage.getItem('ai_note_api_key') || '',
    model: localStorage.getItem('ai_note_api_model') || 'deepseek-chat'
  }
}

export function setApiConfig(config: Partial<{ url: string; key: string; model: string }>) {
  if (config.url !== undefined) localStorage.setItem('ai_note_api_url', config.url)
  if (config.key !== undefined) localStorage.setItem('ai_note_api_key', config.key)
  if (config.model !== undefined) localStorage.setItem('ai_note_api_model', config.model)
}

export function isApiConfigured(): boolean {
  const { key } = getApiConfig()
  return !!key
}

export function getProxyUrl(): string {
  return localStorage.getItem('ai_note_proxy_url') || 'http://127.0.0.1:8765'
}

export function setProxyUrl(url: string): void {
  localStorage.setItem('ai_note_proxy_url', url)
}
