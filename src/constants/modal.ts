import { OnlyTextContent } from '@/components//OnlyTextContent'
import { PostMatchContent } from '@/components/PostMatchContent'
import { WarningContent } from '@/components/WarningContent'

type ContentMapType = {
  [V in ModalVariant]: React.FC<Extract<ModalProps, { variant: V }>>
}

export const ContentMap: ContentMapType = {
  onlyText: OnlyTextContent,
  warning: WarningContent,
  postMatch: PostMatchContent,
} as const

export type ModalVariant = 'onlyText' | 'warning' | 'postMatch'

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

export interface PostMatchProps {
  variant: 'postMatch'
  onClose: () => void
  onSubmit: (data: { date: string; opponent: string; place: string }) => void
}

export type ModalProps = OnlyTextModalProps | WarningModalProps | PostMatchProps
