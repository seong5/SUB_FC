'use client'
import { useQuery } from '@tanstack/react-query'
import { getPlayers } from './api'
import type { Player } from './types'

export function usePlayersQuery() {
  return useQuery<Player[]>({
    queryKey: ['players'],
    queryFn: getPlayers,
  })
}
