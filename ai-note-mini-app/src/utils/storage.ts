import Taro from '@tarojs/taro'
import { isWeapp, isAlipay, isH5 } from './platform'

function h5Get(key: string): string | null {
  return localStorage.getItem(key)
}

function h5Set(key: string, value: string): void {
  localStorage.setItem(key, value)
}

function h5Remove(key: string): void {
  localStorage.removeItem(key)
}

function weappGet(key: string): string | null {
  try {
    return Taro.getStorageSync(key)
  } catch {
    return null
  }
}

function weappSet(key: string, value: string): void {
  Taro.setStorageSync(key, value)
}

function weappRemove(key: string): void {
  Taro.removeStorageSync(key)
}

export function getStorage(key: string): string | null {
  if (isH5()) return h5Get(key)
  if (isWeapp() || isAlipay()) return weappGet(key)
  return null
}

export function setStorage(key: string, value: string): void {
  if (isH5()) h5Set(key, value)
  else weappSet(key, value)
}

export function removeStorage(key: string): void {
  if (isH5()) h5Remove(key)
  else weappRemove(key)
}

export function getStorageJSON<T>(key: string): T | null {
  const raw = getStorage(key)
  if (!raw) return null
  try {
    return JSON.parse(raw) as T
  } catch {
    return null
  }
}

export function setStorageJSON<T>(key: string, value: T): void {
  setStorage(key, JSON.stringify(value))
}