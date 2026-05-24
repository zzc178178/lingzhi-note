import Taro from '@tarojs/taro'

interface RequestOptions {
  url: string
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
  data?: Record<string, unknown>
  headers?: Record<string, string>
  timeout?: number
}

export async function request<T = unknown>(options: RequestOptions): Promise<T> {
  const { url, method = 'GET', data, headers = {}, timeout = 30000 } = options

  try {
    const res = await Taro.request({
      url,
      method,
      data,
      header: headers,
      timeout
    })

    if (res.statusCode >= 200 && res.statusCode < 300) {
      return res.data as T
    }

    let msg = `请求失败: ${res.statusCode}`
    if (res.data && typeof res.data === 'object' && 'error' in res.data) {
      const err = res.data.error as { message?: string; type?: string }
      msg = err.message || JSON.stringify(res.data)
    }
    throw new Error(msg)
  } catch (err) {
    if (err instanceof Error) {
      throw new Error(`网络请求失败: ${err.message}`)
    }
    const errMsg = typeof err === 'object' ? JSON.stringify(err) : String(err)
    throw new Error(`网络请求失败: ${errMsg}`)
  }
}

export async function fetchContent(url: string): Promise<string> {
  const res = await Taro.request({
    url,
    method: 'GET',
    responseType: 'text',
    timeout: 15000
  })
  return res.data as string
}