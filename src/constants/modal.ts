import { OnlyTextContent } from '@/components/common/modal-contents/OnlyTextContent'
import { PostMatchContent } from '@/components/common/modal-contents/PostMatchContent'
import ScheduleContent from '@/components/common/modal-contents/ScheduleContent'
import { WarningContent } from '@/components/common/modal-contents/WarningContent'
import { EventsType } from '@/mocks/calenderEvents'
import PostRosterContent from '@/components/common/modal-contents/PostRosterContent'
import PostQuartersContent from '@/components/common/modal-contents/PostQuartersContent'

type ContentMapType = {
  [V in ModalVariant]: React.FC<Extract<ModalProps, { variant: V }>>
}

export const ContentMap: ContentMapType = {
  onlyText: OnlyTextContent,
  warning: WarningContent,
  postMatch: PostMatchContent,
  scheduleEvent: ScheduleContent,
  postRoster: PostRosterContent,
  postQuarters: PostQuartersContent,
} as const

export type ModalVariant =
  | 'onlyText'
  | 'warning'
  | 'postMatch'
  | 'scheduleEvent'
  | 'postRoster'
  | 'postQuarters'

export type Position = 'GK' | 'DF' | 'MF' | 'FW'
export type Formation = '4-4-2' | '4-2-3-1'

export type RosterData = {
  formation: Formation
  GK: string[]
  DF: string[]
  MF: string[]
  FW: string[]
}

export type PostMatchData = {
  date: string
  opponent: string
  place: string
  score: string
}

export type GoalEvent = { scorerId: string; assistId?: string | null }
export type QuarterData = { goals: GoalEvent[]; conceded: number; scoreAfter: string }

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
  onSubmit: (data: PostMatchData) => void
}

export interface ScheduleContentProps {
  variant: 'scheduleEvent'
  onClose: () => void
  onSubmit: (data: { date: string; type: EventsType; title?: string; place?: string }) => void
}

export interface PostRosterContentProps {
  variant: 'postRoster'
  onBack: () => void
  onClose: () => void
  // “다음” 누르면 참가자/포메이션 전달
  onSubmit: (data: RosterData) => void
  // 플레이어 소스 (id/name/position) 를 상위에서 주입
  players: { id: string; name: string; position: Position }[]
  // 필요하다면 초기값(수정 플로우) 지원
  initial?: RosterData
}

export interface PostQuartersContentProps {
  variant: 'postQuarters'
  onBack: () => void
  onClose: () => void
  onSubmit: (data: QuarterData[]) => void
  // 2단계에서 선택된 선수들만 득점/도움 후보로
  eligiblePlayers: { id: string; name: string }[]
  initial?: QuarterData[]
}

export type ModalProps =
  | OnlyTextModalProps
  | WarningModalProps
  | PostMatchProps
  | ScheduleContentProps
  | PostRosterContentProps
  | PostQuartersContentProps
