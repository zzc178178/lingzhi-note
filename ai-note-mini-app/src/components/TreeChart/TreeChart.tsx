import { View, Text } from '@tarojs/components'
import { useState } from 'react'
import './TreeChart.scss'

interface TreeNode {
  label: string
  children?: TreeNode[]
}

interface TreeChartProps {
  title: string
  desc?: string
  tree: TreeNode
}

function TreeNodeItem({ node, depth = 0 }: { node: TreeNode; depth: number }) {
  const [expanded, setExpanded] = useState(true)
  const hasChildren = node.children && node.children.length > 0

  return (
    <View className='tree-node' style={{ marginLeft: depth > 0 ? '24px' : '0' }}>
      <View
        className={`tree-node-label ${hasChildren ? 'has-children' : ''}`}
        onClick={() => hasChildren && setExpanded(!expanded)}
      >
        {hasChildren && (
          <Text className='tree-toggle'>{expanded ? '▾' : '▸'}</Text>
        )}
        <Text className='tree-label-text'>{node.label}</Text>
      </View>
      {hasChildren && expanded && (
        <View className='tree-children'>
          {node.children!.map((child, i) => (
            <TreeNodeItem key={i} node={child} depth={depth + 1} />
          ))}
        </View>
      )}
    </View>
  )
}

export default function TreeChart({ title, desc, tree }: TreeChartProps) {
  return (
    <View className='diagram-section'>
      <Text className='diagram-title'>{title}</Text>
      {desc && <Text className='diagram-desc'>{desc}</Text>}
      <View className='css-tree'>
        <TreeNodeItem node={tree} />
      </View>
    </View>
  )
}