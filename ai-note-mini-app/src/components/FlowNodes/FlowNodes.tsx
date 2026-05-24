import { View, Text } from '@tarojs/components'
import './FlowNodes.scss'

interface FlowNode {
  label: string
  color?: 'blue' | 'green' | 'purple' | 'orange'
}

interface FlowNodesProps {
  title: string
  desc?: string
  nodes: FlowNode[]
}

const colorMap = {
  blue: '#e8f0fe',
  green: '#e8faf0',
  purple: '#f0ebff',
  orange: '#fef4e8'
}

const textColorMap = {
  blue: '#667eea',
  green: '#10b981',
  purple: '#7c3aed',
  orange: '#f59e0b'
}

export default function FlowNodes({ title, desc, nodes }: FlowNodesProps) {
  return (
    <View className='diagram-section'>
      <Text className='diagram-title'>{title}</Text>
      {desc && <Text className='diagram-desc'>{desc}</Text>}

      <View className='css-flow'>
        <View className='css-flow-row'>
          {nodes.map((node, i) => (
            <View key={i} className='css-flow-item'>
              <View
                className='css-node'
                style={{
                  background: colorMap[node.color || 'blue'],
                  color: textColorMap[node.color || 'blue']
                }}
              >
                <Text>{node.label}</Text>
              </View>
              {i < nodes.length - 1 && (
                <Text className='css-arrow'>→</Text>
              )}
            </View>
          ))}
        </View>
      </View>
    </View>
  )
}