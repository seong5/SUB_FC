'use client'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createMatch, getMatches } from '@/libs/matchesApi'
import type { CreateMatchPayload, MatchCreatedResponse, UIMatchSummary } from '@/types/match'

export function useMatchesQuery() {
  return useQuery<UIMatchSummary[]>({
    queryKey: ['matches'],
    queryFn: () => getMatches(),
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
