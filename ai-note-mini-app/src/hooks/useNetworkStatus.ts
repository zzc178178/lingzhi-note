import Taro from '@tarojs/taro'
import { useState, useEffect } from 'react'

export function useNetworkStatus() {
  const [isOnline, setIsOnline] = useState(true)

  useEffect(() => {
    Taro.getNetworkType().then((res) => {
      setIsOnline(res.networkType !== 'none')
    })

    const onNetworkChange = (res: Taro.onNetworkStatusChange.CallbackResult) => {
      setIsOnline(res.isConnected)
    }

    Taro.onNetworkStatusChange(onNetworkChange)

    return () => {
      Taro.offNetworkStatusChange(onNetworkChange)
    }
  }, [])

  return isOnline
}