import api from './axios'

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

export async function getTeamStats(): Promise<TeamStats> {
  const { data } = await api.get<TeamStats>('/teams/stats')
  return data
}

export async function getScheduleEvents(): Promise<ScheduleEvent[]> {
  const { data } = await api.get<ScheduleEvent[]>('/teams/schedule')
  return data
}

export async function createScheduleEvent(payload: CreateScheduleEventDto): Promise<ScheduleEvent> {
  const { data } = await api.post<ScheduleEvent>('/teams/schedule', payload)
  return data
}

export async function deleteScheduleEvent(eventId: string): Promise<void> {
  await api.delete(`/teams/schedule/${eventId}`)
}

