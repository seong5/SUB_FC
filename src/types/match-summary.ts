export type QuarterLabel = '1 쿼터' | '2 쿼터' | '3 쿼터' | '4 쿼터'

export type QuarterScore = {
  label: QuarterLabel
  goals: string[] // 득점자 이름
  assists: string[] // 도움자 이름
  conceded: number // 실점 개수
  scoreAfter: string // "2 - 1"
}

export type MatchSummary = {
  matchId: number
  date: string
  opponent: string
  finalScore: string
  quarters: QuarterScore[]
  place?: string
}
