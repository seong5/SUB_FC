'use client'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createMatch, deleteMatch, getMatches } from './api'
import type { CreateMatchPayload, MatchCreatedResponse, UIMatchSummary } from './types'

export function useMatchesQuery() {
  return useQuery<UIMatchSummary[]>({
    queryKey: ['matches'],
    queryFn: () => getMatches(),
    refetchOnMount: true, // 컴포넌트 마운트 시 항상 리페치
    staleTime: 0, // 데이터를 즉시 stale로 처리
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
