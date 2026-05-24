import { View, Text } from '@tarojs/components'
import './StepList.scss'

interface Step {
  number: number
  color: string
  bgColor: string
  tag?: string
  tagColor?: string
  title: string
  desc: string
}

interface StepListProps {
  title: string
  desc?: string
  steps: Step[]
  footer?: string
}

export default function StepList({ title, desc, steps, footer }: StepListProps) {
  return (
    <View className='diagram-section'>
      <Text className='diagram-title'>{title}</Text>
      {desc && <Text className='diagram-desc'>{desc}</Text>}

      <View className='step-list'>
        {steps.map((step) => (
          <View key={step.number} className='step-item' style={{ background: step.bgColor }}>
            <View className='step-circle' style={{ background: step.color }}>
              <Text>{step.number}</Text>
            </View>
            <View className='step-content'>
              <View className='step-title-row'>
                <Text className='step-title'>{step.title}</Text>
                {step.tag && (
                  <Text className='step-tag' style={{ color: step.tagColor || step.color }}>
                    {step.tag}
                  </Text>
                )}
              </View>
              <Text className='step-desc'>{step.desc}</Text>
            </View>
          </View>
        ))}
      </View>

      {footer && (
        <View className='info-bar' style={{ textAlign: 'center' }}>
          <Text>{footer}</Text>
        </View>
      )}
    </View>
  )
}