export type Position = 'GK' | 'DF' | 'MF' | 'FW'

export const POSITION_COLORS: Record<Position, string> = {
  GK: 'bg-gray-100',
  DF: 'bg-blue-100',
  MF: 'bg-green-100',
  FW: 'bg-red-100',
}

export const POSITION_GRADIENT: Record<Position, string> = {
  FW: 'from-red-500 to-orange-500',
  MF: 'from-blue-500 to-cyan-500',
  DF: 'from-emerald-500 to-teal-500',
  GK: 'from-amber-400 to-yellow-500',
}

export const POSITION_BADGE_BG: Record<Position, string> = {
  FW: 'bg-red-500/10',
  MF: 'bg-blue-500/10',
  DF: 'bg-emerald-500/10',
  GK: 'bg-yellow-500/10',
}

export const POSITION_BORDER: Record<Position, string> = {
  FW: 'border-l-red-500',
  MF: 'border-l-blue-500',
  DF: 'border-l-emerald-500',
  GK: 'border-l-amber-400',
}
