import { OnlyTextContent } from '@/components/common/modal-contents/OnlyTextContent'
import { PostMatchContent } from '@/components/common/modal-contents/PostMatchContent'
import ScheduleContent from '@/components/common/modal-contents/ScheduleContent'
import { WarningContent } from '@/components/common/modal-contents/WarningContent'
import PostRosterContent from '@/components/common/modal-contents/PostRosterContent'
import PostQuartersContent from '@/components/common/modal-contents/PostQuartersContent'
import PostScoresContent from '@/components/common/modal-contents/PostScoresContent'
import PostMomContent from '@/components/common/modal-contents/PostMomContent'

import type { PostMatchData, RosterData, QuarterData } from '@/types/match'
import type { EventsType } from '@/mocks/calenderEvents'
import type { FC } from 'react'
import type { Position } from './positionColor'

/** UI 전용 타입들 */
export type ModalVariant =
  | 'onlyText'
  | 'warning'
  | 'postMatch'
  | 'scheduleEvent'
  | 'postRoster'
  | 'postQuarters'
  | 'postScores'
  | 'postMom'

export type Formation = '4-4-2' | '4-2-3-1'

/** 각 모달 콘텐츠 컴포넌트가 받을 Props */
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
  mode?: 'create' | 'edit'
  initial?: {
    date: string
    place: string
    score: string
    opponent: string
  }
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
  onSubmit: (data: RosterData) => void
  players: { id: string; name: string; position: Position }[]
  initial?: RosterData
  mode?: 'create' | 'edit'
}

export interface PostQuartersContentProps {
  variant: 'postQuarters'
  onBack: () => void
  onClose: () => void
  onSubmit: (data: QuarterData[]) => void
  /** 2단계에서 선택된 선수들만 득점/도움 후보로 */
  eligiblePlayers: { id: string; name: string }[]
  initial?: QuarterData[]
  mode?: 'create' | 'edit'
}

export interface PostScoresContentProps {
  variant: 'postScores'
  onBack: () => void
  onClose: () => void
  onSubmit: (data: QuarterData[]) => void
  initial?: QuarterData[]
  eligiblePlayers: { id: string; name: string }[]
  mode?: 'create' | 'edit'
}

export interface PostMomContentProps {
  variant: 'postMom'
  onBack: () => void
  onClose: () => void
  onSubmit: (momPlayerIds: string[]) => void
  eligiblePlayers: { id: string; name: string }[]
  initial?: string[]
  mode?: 'create' | 'edit'
}

/** 모달 전체 유니언 */
export type ModalProps =
  | OnlyTextModalProps
  | WarningModalProps
  | PostMatchProps
  | ScheduleContentProps
  | PostRosterContentProps
  | PostQuartersContentProps
  | PostScoresContentProps
  | PostMomContentProps

/** variant → 컴포넌트 매핑 */
type ContentMapType = {
  [V in ModalVariant]: FC<Extract<ModalProps, { variant: V }>>
}

export const ContentMap: ContentMapType = {
  onlyText: OnlyTextContent,
  warning: WarningContent,
  postMatch: PostMatchContent,
  scheduleEvent: ScheduleContent,
  postRoster: PostRosterContent,
  postQuarters: PostQuartersContent,
  postScores: PostScoresContent,
  postMom: PostMomContent,
} as const
