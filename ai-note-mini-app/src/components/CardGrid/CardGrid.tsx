import { View, Text } from '@tarojs/components'
import './CardGrid.scss'

interface CardData {
  label?: string
  emoji?: string
  title: string
  subtitle?: string
  desc: string
}

interface CardGridProps {
  title: string
  desc?: string
  cards: CardData[]
  showIcon?: boolean
  effectBar?: string
  infoBar?: string
}

export default function CardGrid({ title, desc, cards, showIcon, effectBar, infoBar }: CardGridProps) {
  return (
    <View className='diagram-section'>
      <Text className='diagram-title'>{title}</Text>
      {desc && <Text className='diagram-desc'>{desc}</Text>}
      <View className='diagram-grid-3'>
        {cards.map((card, i) => (
          <View key={i} className={`grid-card ${showIcon ? 'grid-card-icon' : ''}`}>
            {card.label && <Text className='grid-card-label'>{card.label}</Text>}
            {showIcon && card.emoji && <Text className='grid-card-emoji'>{card.emoji}</Text>}
            <Text className='grid-card-title'>{card.title}</Text>
            {card.subtitle && <Text className='grid-card-sub'>{card.subtitle}</Text>}
            <Text className='grid-card-desc'>{card.desc}</Text>
          </View>
        ))}
      </View>
      {infoBar && (
        <View className='info-bar'>
          <Text>{infoBar}</Text>
        </View>
      )}
      {effectBar && (
        <View className='effect-bar'>
          <Text>{effectBar}</Text>
        </View>
      )}
    </View>
  )
}