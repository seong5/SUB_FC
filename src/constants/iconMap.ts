import type * as React from 'react'

type SvgComponent = React.ComponentType<React.SVGProps<SVGSVGElement>>
type SvgModule = { default: SvgComponent }
type Loader = () => Promise<SvgModule>

const ICON_MAP = {
  Kakao: () => import('@/assets/kakao.svg') as Promise<SvgModule>,
} satisfies Record<string, Loader>

export type IconName = keyof typeof ICON_MAP
export default ICON_MAP
