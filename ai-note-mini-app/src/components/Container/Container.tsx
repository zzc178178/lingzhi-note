import { View } from '@tarojs/components'
import { PropsWithChildren } from 'react'
import './Container.scss'

interface ContainerProps {
  className?: string
}

export default function Container({ children, className = '' }: PropsWithChildren<ContainerProps>) {
  return (
    <View className={`container ${className}`}>
      {children}
    </View>
  )
}