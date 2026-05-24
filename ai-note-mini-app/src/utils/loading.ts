import { useState, useCallback } from 'react'

export type LoadingState = 'idle' | 'loading' | 'success' | 'error'

interface UseLoadingReturn {
  status: LoadingState
  isLoading: boolean
  isSuccess: boolean
  isError: boolean
  error: string | null
  startLoading: () => void
  setSuccess: () => void
  setError: (message: string) => void
  reset: () => void
  wrap: <T>(promise: Promise<T>) => Promise<T>
}

export function useLoading(): UseLoadingReturn {
  const [status, setStatus] = useState<LoadingState>('idle')
  const [error, setErrorState] = useState<string | null>(null)

  const startLoading = useCallback(() => {
    setStatus('loading')
    setErrorState(null)
  }, [])

  const setSuccess = useCallback(() => {
    setStatus('success')
    setErrorState(null)
  }, [])

  const setError = useCallback((message: string) => {
    setStatus('error')
    setErrorState(message)
  }, [])

  const reset = useCallback(() => {
    setStatus('idle')
    setErrorState(null)
  }, [])

  const wrap = useCallback(async <T>(promise: Promise<T>): Promise<T> => {
    startLoading()
    try {
      const result = await promise
      setSuccess()
      return result
    } catch (err) {
      const message = err instanceof Error ? err.message : '操作失败'
      setError(message)
      throw err
    }
  }, [startLoading, setSuccess, setError])

  return {
    status,
    isLoading: status === 'loading',
    isSuccess: status === 'success',
    isError: status === 'error',
    error,
    startLoading,
    setSuccess,
    setError,
    reset,
    wrap
  }
}