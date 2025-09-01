export type Position = 'GK' | 'DF' | 'MF' | 'FW'

export const POSITION_COLORS: Record<Position, string> = {
  GK: 'bg-gray-100',
  DF: 'bg-blue-100',
  MF: 'bg-green-100',
  FW: 'bg-red-100',
}
