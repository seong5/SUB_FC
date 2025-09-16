import api from './axios'
import {
  CreateMatchPayload,
  MatchCreatedResponse,
  MatchListItem,
  PostMatchData,
  UIMatchSummary,
  mapToUIMatchSummary,
  RosterData,
  QuarterData,
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

export async function getMatchDetail(id: number): Promise<UIMatchSummary> {
  const { data } = await api.get<MatchListItem>(`/matches/${id}`)
  return mapToUIMatchSummary(data)
}

export async function deleteMatch(id: number): Promise<void> {
  await api.delete(`/matches/${id}`)
}

export async function patchMatch(id: number, payload: Partial<PostMatchData>) {
  await api.patch(`/matches/${id}`, payload)
}

// Roster
export async function patchRoster(id: number, payload: RosterData): Promise<void> {
  await api.patch(`/matches/${id}/roster`, payload)
}

// Quarters
export async function patchQuarters(id: number, payload: QuarterData[]): Promise<void> {
  await api.patch(`/matches/${id}/quarters`, payload)
}

// Scores (득점/도움 → QuarterData에 goals 포함)
export async function patchScores(id: number, payload: QuarterData[]): Promise<void> {
  await api.patch(`/matches/${id}/scores`, payload)
}
