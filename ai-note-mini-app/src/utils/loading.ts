import { useState, useCallback } from 'react'

export type LoadingState = 'idle' | 'loading' | 'success' | 'error'

export type GenStep = 'fetching' | 'ai' | 'done'

interface UseLoadingReturn {
  status: LoadingState
  step: GenStep | null
  isLoading: boolean
  isSuccess: boolean
  isError: boolean
  error: string | null
  startLoading: () => void
  setStep: (step: GenStep) => void
  setSuccess: () => void
  setError: (message: string) => void
  reset: () => void
  wrap: <T>(promise: Promise<T>) => Promise<T>
}

export function useLoading(): UseLoadingReturn {
  const [status, setStatus] = useState<LoadingState>('idle')
  const [step, setStepState] = useState<GenStep | null>(null)
  const [error, setErrorState] = useState<string | null>(null)

  const startLoading = useCallback(() => {
    setStatus('loading')
    setStepState('fetching')
    setErrorState(null)
  }, [])

  const setStep = useCallback((s: GenStep) => {
    setStepState(s)
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
    setStepState(null)
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
    step,
    isLoading: status === 'loading',
    isSuccess: status === 'success',
    isError: status === 'error',
    error,
    startLoading,
    setStep,
    setSuccess,
    setError,
    reset,
    wrap
  }
}