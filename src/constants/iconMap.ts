import type * as React from 'react'

type SvgComponent = React.ComponentType<React.SVGProps<SVGSVGElement>>
type SvgModule = { default: SvgComponent }
type Loader = () => Promise<SvgModule>

const ICON_MAP = {
  Kakao: () => import('@/assets/kakao.svg') as Promise<SvgModule>,
  ChevDown: () => import('@/assets/chevron-down.svg') as Promise<SvgModule>,
  More: () => import('@/assets/more-icon.svg') as Promise<SvgModule>,
  Youtube: () => import('@/assets/youtube.svg') as Promise<SvgModule>,
  ChevLeft: () => import('@/assets/chevron-left.svg') as Promise<SvgModule>,
  ChevRight: () => import('@/assets/chevron-right.svg') as Promise<SvgModule>,
  OpenEye: () => import('@/assets/open-eye.svg') as Promise<SvgModule>,
  CloseEye: () => import('@/assets/close-eye.svg') as Promise<SvgModule>,
  SoccerBall: () => import('@/assets/soccer-ball.svg') as Promise<SvgModule>,
  Calender: () => import('@/assets/input-calender.svg') as Promise<SvgModule>,
  Notification: () => import('@/assets/notification-yes.svg') as Promise<SvgModule>,
  NotificationNone: () => import('@/assets/notification-none.svg') as Promise<SvgModule>,
} satisfies Record<string, Loader>

export type IconName = keyof typeof ICON_MAP
export default ICON_MAP
