import { Formation } from '@/shared/config/modal'

export interface PostMatchData {
  date: string
  opponent: string
  place: string
  score: string // "2-1" 같은 최종 스코어
}

export interface RosterData {
  formation: Formation // e.g. '4-2-3-1'
  GK: string[] // player ids (문자열 id 사용)
  DF: string[]
  MF: string[]
  FW: string[]
}

export interface QuarterGoal {
  minute?: number
  scorerId: string
  assistId?: string | null
}

export interface QuarterData {
  quarter: 1 | 2 | 3 | 4
  goals: QuarterGoal[]
  conceded: number
  scoreAfter: string // "1-0" 등
}

export interface CreateMatchPayload {
  match: PostMatchData
  roster: RosterData
  quarters: QuarterData[]
  mom_player_ids?: string[] // MOM 선정 선수 배열 (최대 2명)
}

export type MatchCreatedResponse = {
  id: number
  date: string
  opponent: string
  place: string
  score: string
  createdAt: string
}

export type MatchListItem = {
  id: number
  date: string
  opponent: string
  place: string
  score: string
}

export type PlayerLite = {
  id: string
  name: string
  position: 'GK' | 'DF' | 'MF' | 'FW'
}

export type UIMatchSummary = {
  id: number
  date: string
  opponent: string
  place: string
  score: string
  match?: PostMatchData
  roster?: RosterData
  quarters?: QuarterData[]
  scores?: QuarterData[]
  players?: PlayerLite[]
}

export function mapToUIMatchSummary(item: MatchListItem): UIMatchSummary {
  return {
    id: item.id,
    date: item.date,
    opponent: item.opponent,
    place: item.place,
    score: item.score, // 서버가 final_score라면 여기서 매핑
  }
}

export type MatchEditSeed = {
  match: PostMatchData
  roster: RosterData
  quarters: QuarterData[]
  scores: QuarterData[] // scores = quarters 그대로 복사
  players: PlayerLite[]
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
