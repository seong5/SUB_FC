import { NextResponse, type NextRequest } from 'next/server'
import { createServerClientForRoute } from '@/libs/supabase/server-route'
import { parseScoreString } from '@/utils/scoreCalculator'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET(request: NextRequest) {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return NextResponse.json(
      { error: 'Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY' },
      { status: 500 }
    )
  }

  const { supabase, cookieResponse } = createServerClientForRoute(request)

  // 모든 경기 데이터 가져오기 (score가 null이 아닌 것만)
  const { data: matches, error } = await supabase
    .from('matches')
    .select('score')
    .not('score', 'is', null)

  if (error) {
    const json = NextResponse.json({ error: error.message }, { status: 500 })
    cookieResponse.headers.forEach((v, k) => json.headers.set(k, v))
    return json
  }

  // 스코어 파싱하여 승/무/패 계산
  let wins = 0
  let draws = 0
  let losses = 0
  let validMatches = 0

  matches?.forEach((match) => {
    const score = match.score
    if (!score || typeof score !== 'string' || score.trim() === '') return

    // scoreCalculator의 parseScoreString 사용 (다양한 형식 지원: "2-1", "2:1", "2 - 1" 등)
    const parsed = parseScoreString(score)
    if (!parsed) return

    validMatches++

    // home이 우리팀 점수, away가 상대팀 점수
    const { home: ourScore, away: opponentScore } = parsed

    if (ourScore > opponentScore) {
      wins++
    } else if (ourScore === opponentScore) {
      draws++
    } else {
      losses++
    }
  })

  const totalMatches = validMatches
  const winRate = totalMatches > 0 ? Math.round((wins / totalMatches) * 100) : 0

  const json = NextResponse.json(
    {
      totalMatches,
      wins,
      draws,
      losses,
      winRate,
    },
    { status: 200 }
  )
  cookieResponse.headers.forEach((v, k) => json.headers.set(k, v))
  return json
}

