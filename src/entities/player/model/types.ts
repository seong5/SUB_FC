export interface Player {
  id: number
  name: string
  back_number: number
  position: 'GK' | 'DF' | 'MF' | 'FW'
  goals: number
  assists: number
  mom: number
  attendance_matches: number
  attendance_percent: number
  created_at: string
}
