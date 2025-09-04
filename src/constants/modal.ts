import { OnlyTextContent } from '@/components/common/modal-contents/OnlyTextContent'
import { PostMatchContent } from '@/components/common/modal-contents/PostMatchContent'
import ScheduleContent from '@/components/common/modal-contents/ScheduleContent'
import { WarningContent } from '@/components/common/modal-contents/WarningContent'
import { EventsType } from '@/mocks/calenderEvents'

type ContentMapType = {
  [V in ModalVariant]: React.FC<Extract<ModalProps, { variant: V }>>
}

export const ContentMap: ContentMapType = {
  onlyText: OnlyTextContent,
  warning: WarningContent,
  postMatch: PostMatchContent,
  scheduleEvent: ScheduleContent,
} as const

export type ModalVariant = 'onlyText' | 'warning' | 'postMatch' | 'scheduleEvent'

export type PostMatchData = {
  date: string
  opponent: string
  place: string
  score: string
}

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
  onSubmit: (data: { date: string; opponent: string; place: string; score: string }) => void
}

export interface ScheduleContentProps {
  variant: 'scheduleEvent'
  onClose: () => void
  onSubmit: (data: { date: string; type: EventsType; title?: string; place?: string }) => void
}

export type ModalProps =
  | OnlyTextModalProps
  | WarningModalProps
  | PostMatchProps
  | ScheduleContentProps
