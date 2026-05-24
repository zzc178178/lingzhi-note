import { View, Text } from '@tarojs/components'
import { useState, useEffect, PropsWithChildren } from 'react'
import './DualTabNavigation.scss'

interface Tab {
  key: string
  label: string
  icon: string
}

interface DualTabNavigationProps {
  tabs: Tab[]
  activeTab: string
  onChange: (key: string) => void
  children: (activeTab: string) => React.ReactNode
}

export default function DualTabNavigation({
  tabs,
  activeTab,
  onChange,
  children
}: DualTabNavigationProps) {
  const [animating, setAnimating] = useState(false)

  const handleChange = (key: string) => {
    if (key === activeTab) return
    setAnimating(true)
    onChange(key)
    setTimeout(() => setAnimating(false), 300)
  }

  return (
    <View className='dual-tab-container'>
      <View className={`tab-content ${animating ? 'animating' : ''}`}>
        {children(activeTab)}
      </View>

      <View className='tab-bar-fixed'>
        <View className='tab-nav'>
          {tabs.map((tab) => (
            <View
              key={tab.key}
              className={`tab-item ${activeTab === tab.key ? 'active' : ''}`}
              onClick={() => handleChange(tab.key)}
            >
              <Text className='tab-icon'>{tab.icon}</Text>
              <Text className='tab-label'>{tab.label}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  )
}