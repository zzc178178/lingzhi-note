import { NoteData, NoteIndexItem, toIndexItem } from './note-model'

const NOTE_PREFIX = 'ai_note_'
const INDEX_KEY = 'ai_note_index'
const API_KEYS_STORE = 'ai_note_api_keys_store'

export interface ModelPreset {
  id: string
  name: string
  provider: string
  url: string
  model: string
}

export const MODEL_PRESETS: ModelPreset[] = [
  { id: 'deepseek', name: 'DeepSeek', provider: '深度求索', url: 'https://api.deepseek.com', model: 'deepseek-chat' },
  { id: 'qwen', name: '通义千问', provider: '阿里云', url: 'https://dashscope.aliyuncs.com/compatible-mode', model: 'qwen-plus' },
  { id: 'glm', name: '智谱 GLM', provider: '智谱AI', url: 'https://open.bigmodel.cn/api/paas', model: 'glm-4-flash' },
  { id: 'moonshot', name: 'Kimi', provider: '月之暗面', url: 'https://api.moonshot.cn', model: 'moonshot-v1-8k' },
  { id: 'doubao', name: '豆包', provider: '字节跳动', url: 'https://ark.cn-beijing.volces.com/api', model: 'doubao-pro-32k' },
  { id: 'minimax', name: 'MiniMax', provider: 'MiniMax', url: 'https://api.minimax.chat', model: 'MiniMax-Text-01' },
  { id: 'hunyuan', name: '混元', provider: '腾讯云', url: 'https://api.hunyuan.cloud.tencent.com', model: 'hunyuan-lite' },
  { id: 'ernie', name: '文心一言', provider: '百度', url: 'https://qianfan.baidubce.com/v2', model: 'ernie-4.0-8k' },
  { id: 'custom', name: '自定义', provider: 'OpenAI 兼容', url: '', model: '' },
]

export function getPresetById(id: string): ModelPreset | undefined {
  return MODEL_PRESETS.find(p => p.id === id)
}

export function getApiConfig(): { url: string; key: string; model: string; presetId: string } {
  return {
    url: localStorage.getItem('ai_note_api_url') || 'https://api.deepseek.com',
    key: localStorage.getItem('ai_note_api_key') || '',
    model: localStorage.getItem('ai_note_api_model') || 'deepseek-chat',
    presetId: localStorage.getItem('ai_note_preset_id') || 'deepseek'
  }
}

export function setApiConfig(config: Partial<{ url: string; key: string; model: string; presetId: string }>) {
  if (config.url !== undefined) localStorage.setItem('ai_note_api_url', config.url)
  if (config.key !== undefined) localStorage.setItem('ai_note_api_key', config.key)
  if (config.model !== undefined) localStorage.setItem('ai_note_api_model', config.model)
  if (config.presetId !== undefined) localStorage.setItem('ai_note_preset_id', config.presetId)
}

type ApiKeysStore = Record<string, string>

function getApiKeysStore(): ApiKeysStore {
  return getStorageJSON<ApiKeysStore>(API_KEYS_STORE) || {}
}

function saveApiKeysStore(store: ApiKeysStore): void {
  setStorageJSON(API_KEYS_STORE, store)
}

export function saveApiKeyForPreset(presetId: string, key: string): void {
  if (!key) return
  const store = getApiKeysStore()
  store[presetId] = key
  saveApiKeysStore(store)
}

export function getApiKeyForPreset(presetId: string): string {
  const store = getApiKeysStore()
  return store[presetId] || ''
}

export function removeApiKeyForPreset(presetId: string): void {
  const store = getApiKeysStore()
  delete store[presetId]
  saveApiKeysStore(store)
}

export function isApiConfigured(): boolean {
  const { key } = getApiConfig()
  return !!key
}

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

export function getProxyUrl(): string {
  return localStorage.getItem('ai_note_proxy_url') || 'http://127.0.0.1:8765'
}

export function setProxyUrl(url: string): void {
  localStorage.setItem('ai_note_proxy_url', url)
}
