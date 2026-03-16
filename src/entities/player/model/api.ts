import { api } from '@/shared/api'
import type { Player } from './types'

export async function getPlayers() {
  const { data } = await api.get<Player[]>('/players')
  return data
}

export async function getPlayersByYear(year: number) {
  const { data } = await api.get<Player[]>(`/players?year=${year}`)
  return data
}

export type TopAssistToMe = {
  id: number
  name: string
  back_number: number
  position: 'GK' | 'DF' | 'MF' | 'FW'
  assists_to_me: number
  assists_to_me_percent: number
}

export async function getTopAssistToMe(playerId: number, year?: number) {
  const params = new URLSearchParams({ playerId: String(playerId) })
  if (year) params.set('year', String(year))
  const { data } = await api.get<TopAssistToMe[]>(`/players/top-assist-to-me?${params.toString()}`)
  return data
}

export type TopAssistedByMe = {
  id: number
  name: string
  back_number: number
  position: 'GK' | 'DF' | 'MF' | 'FW'
  goals_from_my_assist: number
  goals_from_my_assist_percent: number
}

export async function getTopAssistedByMe(playerId: number, year?: number) {
  const params = new URLSearchParams({ playerId: String(playerId) })
  if (year) params.set('year', String(year))
  const { data } = await api.get<TopAssistedByMe[]>(`/players/top-assisted-by-me?${params.toString()}`)
  return data
}
