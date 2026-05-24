import Taro from '@tarojs/taro'

export type Platform = 'weapp' | 'alipay' | 'h5' | 'unknown'

export function getPlatform(): Platform {
  if (process.env.TARO_ENV === 'weapp') return 'weapp'
  if (process.env.TARO_ENV === 'alipay') return 'alipay'
  if (process.env.TARO_ENV === 'h5') return 'h5'
  return 'unknown'
}

export function isWeapp(): boolean {
  return getPlatform() === 'weapp'
}

export function isAlipay(): boolean {
  return getPlatform() === 'alipay'
}

export function isH5(): boolean {
  return getPlatform() === 'h5'
}

export function isMiniProgram(): boolean {
  return isWeapp() || isAlipay()
}

export function getSystemInfo() {
  return Taro.getSystemInfoSync()
}

export function getStatusBarHeight(): number {
  const info = getSystemInfo()
  return info.statusBarHeight || 20
}