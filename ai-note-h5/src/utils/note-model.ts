export interface NoteData {
  id: string
  title: string
  subtitle: string
  tag: string
  source: string
  textContent: string
  diagramContent: string
  userNotes: string
  createdAt: string
  updatedAt: string
}

export function createNote(data: Partial<NoteData>): NoteData {
  const now = new Date().toISOString()
  return {
    id: data.id || generateId(),
    title: data.title || '',
    subtitle: data.subtitle || '',
    tag: data.tag || '',
    source: data.source || '',
    textContent: data.textContent || '',
    diagramContent: data.diagramContent || '',
    userNotes: data.userNotes || '',
    createdAt: data.createdAt || now,
    updatedAt: data.updatedAt || now
  }
}

export function generateId(): string {
  return `note_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
}

export interface NoteIndexItem {
  id: string
  title: string
  tag: string
  createdAt: string
  updatedAt: string
}

export function toIndexItem(note: NoteData): NoteIndexItem {
  return {
    id: note.id,
    title: note.title,
    tag: note.tag,
    createdAt: note.createdAt,
    updatedAt: note.updatedAt
  }
}
