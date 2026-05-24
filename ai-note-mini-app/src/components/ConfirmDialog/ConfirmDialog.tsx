import { View, Text } from '@tarojs/components'
import './ConfirmDialog.scss'

interface ConfirmDialogProps {
  visible: boolean
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  onConfirm: () => void
  onCancel: () => void
}

export default function ConfirmDialog({
  visible,
  title,
  message,
  confirmText = '确认',
  cancelText = '取消',
  onConfirm,
  onCancel
}: ConfirmDialogProps) {
  if (!visible) return null

  return (
    <View className='dialog-overlay' onClick={onCancel}>
      <View className='dialog-box' onClick={(e) => e.stopPropagation()}>
        <Text className='dialog-title'>{title}</Text>
        <Text className='dialog-message'>{message}</Text>
        <View className='dialog-actions'>
          <View className='dialog-btn dialog-cancel' onClick={onCancel}>
            <Text>{cancelText}</Text>
          </View>
          <View className='dialog-btn dialog-confirm' onClick={onConfirm}>
            <Text>{confirmText}</Text>
          </View>
        </View>
      </View>
    </View>
  )
}