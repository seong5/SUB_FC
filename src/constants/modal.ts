import { OnlyTextContent } from '@/components//OnlyTextContent'
import { WarningContent } from '@/components/WarningContent'

type ContentMapType = {
  [V in ModalVariant]: React.FC<Extract<ModalProps, { variant: V }>>
}

export const ContentMap: ContentMapType = {
  onlyText: OnlyTextContent,
  warning: WarningContent,
} as const

export type ModalVariant = 'onlyText' | 'warning'

export interface OnlyTextModalProps {
  variant: 'onlyText'
  message: string
  onClose: () => void
}

export interface WarningModalProps {
  variant: 'warning'
  message: string
  onCancel: () => void
  onConfirm: () => void
  cancelText?: string
  confirmText?: string
}

export type ModalProps = OnlyTextModalProps | WarningModalProps
