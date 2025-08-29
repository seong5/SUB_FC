export type QuarterLabel = '1 쿼터' | '2 쿼터' | '3 쿼터' | '4 쿼터'

export type QuarterScore = {
  label: QuarterLabel
  goals: string[] //득점자 이름
  assists: string[] // 도움자 이름
  conceded: number // 실점 개수 (이름 없이 숫자만)
  scoreAfter: string // 쿼터 종료 스코어 ("2-1")
}

export type MatchSummary = {
  matchId: string
  date: string
  opponent: string
  quarters: QuarterScore[]
  finalScore: string
}

export const sampleMatch: MatchSummary = {
  matchId: '2025-08-24-LEAGUE-05',
  date: '2025-08-24T14:00:00+09:00',
  opponent: 'FC도전자',
  quarters: [
    {
      label: '1 쿼터',
      goals: ['신성오', '윤동관'],
      assists: ['차우현', '현신우'],
      conceded: 1,
      scoreAfter: '2-1',
    },
    {
      label: '2 쿼터',
      goals: ['제갈진석'],
      assists: ['윤동관'],
      conceded: 1,
      scoreAfter: '3-2',
    },
    {
      label: '3 쿼터',
      goals: [],
      assists: [],
      conceded: 1,
      scoreAfter: '3-3',
    },
    {
      label: '4 쿼터',
      goals: ['신성오', '신성오'],
      assists: ['현신우'],
      conceded: 0,
      scoreAfter: '5-3',
    },
  ],
  finalScore: '5-3',
}
