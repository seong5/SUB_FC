import api from './axios'
import {
  CreateMatchPayload,
  MatchCreatedResponse,
  MatchListItem,
  PostMatchData,
  UIMatchSummary,
  mapToUIMatchSummary,
} from '@/types/match'

export async function createMatch(payload: CreateMatchPayload) {
  const { data } = await api.post<MatchCreatedResponse>('/matches', payload)
  return data
}

export async function getMatchesRaw() {
  const { data } = await api.get<MatchListItem[]>('/matches')
  return data
}

export async function getMatches(): Promise<UIMatchSummary[]> {
  const list = await getMatchesRaw()
  return list.map(mapToUIMatchSummary)
}

export async function deleteMatch(id: number): Promise<void> {
  await api.delete(`/matches/${id}`)
}

export async function patchMatch(id: number, payload: Partial<PostMatchData>) {
  await api.patch(`/matches/${id}`, payload)
}
