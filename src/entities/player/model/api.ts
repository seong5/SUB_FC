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
