"use client"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { createMatch, deleteMatch, getMatchEditSeed, getMatchesRaw } from "./api"
import type { CreateMatchPayload, MatchCreatedResponse, MatchListItem, UIMatchSummary } from "./types"
import type { MatchForAttendWdl } from "../lib"

export function useMatchesQuery() {
  return useQuery<UIMatchSummary[]>({
    queryKey: ['matches'],
    queryFn: async () => {
      const raw = await getMatchesRaw()
      return (raw ?? []).map((m) => ({
        id: m.id,
        date: m.date,
        opponent: m.opponent,
        place: m.place,
        score: m.score,
      }))
    },
    refetchOnMount: true, // 컴포넌트 마운트 시 항상 리페치
    staleTime: 0, // 데이터를 즉시 stale로 처리
  })
}

type AttendMatchesParams = {
  year: number
  playerId: string
}

export function useAttendMatchesForPlayer({ year, playerId }: AttendMatchesParams) {
  return useQuery<MatchForAttendWdl[]>({
    queryKey: ["matches", "attendWdl", year, playerId],
    enabled: !!playerId && playerId !== "UNKNOWN",
    queryFn: async () => {
      const all: MatchListItem[] | null = await getMatchesRaw()
      const list = all ?? []
      const yearPrefix = String(year)
      const targets = list.filter((m) => m.date.startsWith(yearPrefix))

      const seeds = await Promise.all(targets.map((m) => getMatchEditSeed(m.id)))

      return seeds.map((seed) => ({
        roster: seed.roster,
        score: seed.match.score,
      }))
    },
  })
}

export function useCreateMatchMutation() {
  const qc = useQueryClient()
  return useMutation<MatchCreatedResponse, Error, CreateMatchPayload>({
    mutationKey: ['matches', 'create'],
    mutationFn: (payload) => createMatch(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['matches'] }),
  })
}

export function useDeleteMatchMutation() {
  const qc = useQueryClient()
  return useMutation<void, Error, number>({
    mutationKey: ['matches', 'delete'],
    mutationFn: (id) => deleteMatch(id),
    onSuccess: () => {
      // 경기 목록 캐시 무효화 및 즉시 리페치
      qc.invalidateQueries({ queryKey: ['matches'] })
      qc.refetchQueries({ queryKey: ['matches'] })
      // 경기 상세 캐시도 무효화
      qc.invalidateQueries({ queryKey: ['match'] })
    },
  })
}
