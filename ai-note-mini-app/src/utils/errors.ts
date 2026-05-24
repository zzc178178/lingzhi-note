import Taro from '@tarojs/taro'

export interface AppError {
  code: string
  message: string
  detail?: string
}

export function createError(code: string, message: string, detail?: string): AppError {
  return { code, message, detail }
}

export const ErrorCodes = {
  NETWORK_ERROR: 'ERR_NETWORK',
  API_ERROR: 'ERR_API',
  TIMEOUT: 'ERR_TIMEOUT',
  PARSE_ERROR: 'ERR_PARSE',
  STORAGE_ERROR: 'ERR_STORAGE',
  UNKNOWN: 'ERR_UNKNOWN'
}

export function handleError(error: unknown): AppError {
  if (typeof error === 'object' && error !== null && 'code' in error && 'message' in error) {
    return error as AppError
  }

  if (error instanceof Error) {
    const msg = error.message || '未知错误'

    if (msg.includes('timeout') || msg.includes('Timeout')) {
      return createError(ErrorCodes.TIMEOUT, '请求超时，请稍后重试', msg)
    }
    if (msg.includes('Network') || msg.includes('network') || msg.includes('fetch')) {
      return createError(ErrorCodes.NETWORK_ERROR, '网络连接失败，请检查网络', msg)
    }
    if (msg.includes('parse') || msg.includes('JSON')) {
      return createError(ErrorCodes.PARSE_ERROR, '数据解析失败', msg)
    }

    return createError(ErrorCodes.UNKNOWN, msg)
  }

  return createError(ErrorCodes.UNKNOWN, '发生未知错误')
}

export function showErrorToast(error: AppError): void {
  Taro.showToast({
    title: error.message,
    icon: 'none',
    duration: 3000
  })
}

export function showSuccessToast(title: string): void {
  Taro.showToast({
    title,
    icon: 'success',
    duration: 2000
  })
}