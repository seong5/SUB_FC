export interface TeamStats {
  totalMatches: number
  wins: number
  draws: number
  losses: number
  winRate: number
}

export interface ScheduleEvent {
  id: string
  date: string
  type: '매치' | '회식' | '기타'
  title?: string
  place?: string
  created_at?: string
}

export interface CreateScheduleEventDto {
  date: string
  type: '매치' | '회식' | '기타'
  title?: string
  place?: string
}
