import { View } from '@tarojs/components'
import HtmlRenderer from '../../utils/html-renderer'
import './TextTab.scss'

interface TextTabProps {
  htmlContent: string
}

export default function TextTab({ htmlContent }: TextTabProps) {
  if (!htmlContent || !htmlContent.trim()) {
    return (
      <View className='text-tab'>
        <View className='text-empty'>
          <View className='empty-text'>暂无文字内容</View>
        </View>
      </View>
    )
  }

  return (
    <View className='text-tab'>
      <View className='text-content'>
        <HtmlRenderer html={htmlContent} />
      </View>
    </View>
  )
}