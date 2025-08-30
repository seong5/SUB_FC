export type MatchResult = '승' | '무' | '패'

/** "5 : 3" | "5-3" | "5  -  3" 등 다양한 공백/구분자 대응 */
export function parseScoreString(score: string): { home: number; away: number } | null {
  const m = score.match(/^\s*(\d+)\s*[:\-]\s*(\d+)\s*$/)
  if (!m) return null
  return { home: Number(m[1]), away: Number(m[2]) }
}

/** 우리팀이 왼쪽(홈) 점수라고 가정해서 승/무/패 반환 */
export function getResultFromFinalScore(score: string): MatchResult | null {
  const parsed = parseScoreString(score)
  if (!parsed) return null
  if (parsed.home > parsed.away) return '승'
  if (parsed.home < parsed.away) return '패'
  return '무'
}

/** quarters의 마지막 스코어로 계산하고 싶을 때 (예: "5 - 3") */
export function getResultFromQuarters(quarters: { scoreAfter: string }[]): MatchResult | null {
  if (!quarters.length) return null
  const last = parseScoreString(quarters[quarters.length - 1].scoreAfter)
  if (!last) return null
  if (last.home > last.away) return '승'
  if (last.home < last.away) return '패'
  return '무'
}
