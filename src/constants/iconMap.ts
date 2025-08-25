import type * as React from 'react'

type SvgComponent = React.ComponentType<React.SVGProps<SVGSVGElement>>
type SvgModule = { default: SvgComponent }
type Loader = () => Promise<SvgModule>

const ICON_MAP = {
  Kakao: () => import('@/assets/chevron-down.svg') as Promise<SvgModule>,
  ChevDown: () => import('@/assets/kakao.svg') as Promise<SvgModule>,
  More: () => import('@/assets/more-icon.svg') as Promise<SvgModule>,
} satisfies Record<string, Loader>

export type IconName = keyof typeof ICON_MAP
export default ICON_MAP
