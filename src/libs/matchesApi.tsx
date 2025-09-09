import api from './axios'
import type { PostMatchData, RosterData, QuarterData } from '@/constants/modal'

export interface CreateMatchPayload {
  match: PostMatchData
  roster: RosterData
  quarters: QuarterData[]
}

// 경기 등록
export async function createMatch(payload: CreateMatchPayload) {
  const { data } = await api.post('/matches', payload)
  return data
}

// 경기 조회
export async function getMatches() {
  const { data } = await api.get('/matches')
  return data as CreateMatchPayload[]
}
