export type QuarterLabel = '1 쿼터' | '2 쿼터' | '3 쿼터' | '4 쿼터'

export type QuarterScore = {
  label: QuarterLabel
  getScore: string[]
  assists: string[]
  lostScore: '실점'
  scoreAfter: string
}

export type MatchSummary = {
  matchId: string
  date: string
  opponent: string
  quarters: QuarterLabel
  totalScore: string
}
