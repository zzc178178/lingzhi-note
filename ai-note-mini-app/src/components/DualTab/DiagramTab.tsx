import { View, Text } from '@tarojs/components'
import HtmlRenderer from '../../utils/html-renderer'
import './DiagramTab.scss'

interface DiagramTabProps {
  htmlContent: string
}

export default function DiagramTab({ htmlContent }: DiagramTabProps) {
  if (!htmlContent || !htmlContent.trim()) {
    return (
      <View className='diagram-tab'>
        <View className='diagram-empty'>
          <Text className='empty-icon'>🎨</Text>
          <Text className='empty-text'>暂无图解内容</Text>
        </View>
      </View>
    )
  }

  return (
    <View className='diagram-tab'>
      <HtmlRenderer html={htmlContent} />
    </View>
  )
}
