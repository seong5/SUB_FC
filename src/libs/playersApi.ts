import api from './axios'

export interface Player {
  id: number
  name: string
  back_number: number
  position: 'GK' | 'DF' | 'MF' | 'FW'
  goals: number
  assists: number
  attendance_matches: number
  attendance_percent: number
  created_at: string
}

export async function getPlayers() {
  const { data } = await api.get<Player[]>('/players')
  return data
}
