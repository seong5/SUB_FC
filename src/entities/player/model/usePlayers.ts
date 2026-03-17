"use client"
import { useQuery } from "@tanstack/react-query"
import {
  getPlayers,
  getPlayersByYear,
  getTopAssistToMe,
  getTopAssistedByMe,
  type TopAssistToMe,
  type TopAssistedByMe,
} from "./api"
import type { Player } from "./types"

export function usePlayersQuery() {
  return useQuery<Player[]>({
    queryKey: ['players'],
    queryFn: getPlayers,
  })
}

export function usePlayersByYearQuery(year: number) {
  return useQuery<Player[]>({
    queryKey: ['players', year],
    queryFn: () => getPlayersByYear(year),
  })
}

export function useTopAssistToMeQuery(playerId: number, year?: number) {
  return useQuery<TopAssistToMe[]>({
    queryKey: ["players", "topAssistToMe", playerId, year],
    enabled: !!playerId && playerId !== -1,
    queryFn: () => getTopAssistToMe(playerId, year),
  })
}

export function useTopAssistedByMeQuery(playerId: number, year?: number) {
  return useQuery<TopAssistedByMe[]>({
    queryKey: ["players", "topAssistedByMe", playerId, year],
    enabled: !!playerId && playerId !== -1,
    queryFn: () => getTopAssistedByMe(playerId, year),
  })
}
