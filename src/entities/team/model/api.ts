import { api } from '@/shared/api'
import type { TeamStats, ScheduleEvent, CreateScheduleEventDto } from './types'

export async function getTeamStats(): Promise<TeamStats> {
  const { data } = await api.get<TeamStats>('/teams/stats')
  return data
}

export async function getTeamStatsByYear(year: number): Promise<TeamStats> {
  const { data } = await api.get<TeamStats>(`/teams/stats?year=${year}`)
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
