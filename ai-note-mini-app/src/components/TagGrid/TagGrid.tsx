import { View, Text } from '@tarojs/components'
import './TagGrid.scss'

interface TagCard {
  title: string
  tags: Array<{
    label: string
    color: 'blue' | 'purple' | 'green' | 'orange'
  }>
}

interface TagGridProps {
  title: string
  desc?: string
  cards: TagCard[]
}

const tagColorMap = {
  blue: { bg: '#e8f0fe', text: '#667eea' },
  purple: { bg: '#f0ebff', text: '#7c3aed' },
  green: { bg: '#e8faf0', text: '#10b981' },
  orange: { bg: '#fef4e8', text: '#f59e0b' }
}

export default function TagGrid({ title, desc, cards }: TagGridProps) {
  return (
    <View className='diagram-section'>
      <Text className='diagram-title'>{title}</Text>
      {desc && <Text className='diagram-desc'>{desc}</Text>}

      <View className='tag-grid-2'>
        {cards.map((card, i) => (
          <View key={i} className='tag-card'>
            <Text className='tag-card-title'>{card.title}</Text>
            <View className='tag-group'>
              {card.tags.map((tag, j) => (
                <View
                  key={j}
                  className='tag-pill'
                  style={{
                    background: tagColorMap[tag.color].bg,
                    color: tagColorMap[tag.color].text
                  }}
                >
                  <Text>{tag.label}</Text>
                </View>
              ))}
            </View>
          </View>
        ))}
      </View>
    </View>
  )
}