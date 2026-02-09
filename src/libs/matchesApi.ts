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
  MatchEditSeed,
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

/** GET /api/matches/:id 전체 응답 (쿼터/득점 포함) - 한 번만 호출해 Formation에서 공유용 */
export type MatchDetailFull = {
  matchId: number
  date: string
  opponent: string
  finalScore: string
  place: string
  quarters: Array<{
    label: string
    goals: Array<{ minute?: number | null; scorer?: string; assist?: string }>
    conceded: number
    scoreAfter: string
  }>
  place_name?: string | null
  place_address?: string | null
  place_lat?: number | null
  place_lng?: number | null
}

export async function getMatchDetailFull(id: number): Promise<MatchDetailFull> {
  const { data } = await api.get<MatchDetailFull>(`/matches/${id}`)
  return data
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

export async function getMatchEditSeed(id: number): Promise<MatchEditSeed> {
  const { data } = await api.get<MatchEditSeed>(`/matches/${id}/edit-seed`)
  return data
}
