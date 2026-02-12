import { api } from '@/shared/api'
import type { Player } from './types'

export async function getPlayers() {
  const { data } = await api.get<Player[]>('/players')
  return data
}
