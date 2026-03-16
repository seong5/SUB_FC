"use client"
import { useQuery } from "@tanstack/react-query"
import { getPlayers, getTopAssistToMe, type TopAssistToMe } from "./api"
import type { Player } from "./types"

export function usePlayersQuery() {
  return useQuery<Player[]>({
    queryKey: ['players'],
    queryFn: getPlayers,
  })
}

export function useTopAssistToMeQuery(playerId: number, year?: number) {
  return useQuery<TopAssistToMe[]>({
    queryKey: ["players", "topAssistToMe", playerId, year],
    enabled: !!playerId && playerId !== -1,
    queryFn: () => getTopAssistToMe(playerId, year),
  })
}
