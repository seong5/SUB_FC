// 서버에 보내는 페이로드(네가 이미 쓰는 타입들)
export interface PostMatchData {
  date: string
  opponent: string
  place: string
  score: string
}
export interface RosterData {
  formation: string
  GK: string[]
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
  scoreAfter: string
}

export interface CreateMatchPayload {
  match: PostMatchData
  roster: RosterData
  quarters: QuarterData[]
}

// 서버가 돌려주는 응답 타입(예상/계약에 맞춰 수정)
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

// UI에서 바로 쓰는 요약 타입
export type UIMatchSummary = {
  id: number
  name: string // opponent
  address: string // place
  date: string
}

// UI 매핑 함수
export function mapToUIMatchSummary(item: MatchListItem): UIMatchSummary {
  return {
    id: item.id,
    name: item.opponent,
    address: item.place,
    date: item.date,
  }
}
