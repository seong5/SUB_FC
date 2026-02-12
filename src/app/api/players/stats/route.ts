import { NextResponse, type NextRequest } from 'next/server'
import { createServerClientForRoute } from '@/shared/api/supabase'

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

  // 모든 경기에서 득점과 도움을 실시간으로 계산
  // match_goals 테이블에서 scorer_id와 assist_id를 집계

  // 1. 모든 선수 목록 가져오기
  const { data: players, error: playersError } = await supabase
    .from('players')
    .select('id, name')

  if (playersError) {
    const json = NextResponse.json({ error: playersError.message }, { status: 500 })
    cookieResponse.headers.forEach((v, k) => json.headers.set(k, v))
    return json
  }

  // 2. 모든 match_goals 데이터 가져오기
  const { data: allGoals, error: goalsError } = await supabase
    .from('match_goals')
    .select('scorer_id, assist_id')

  if (goalsError) {
    const json = NextResponse.json({ error: goalsError.message }, { status: 500 })
    cookieResponse.headers.forEach((v, k) => json.headers.set(k, v))
    return json
  }

  // 3. 선수별 득점과 도움 계산
  const statsMap = new Map<
    string,
    { name: string; goals: number; assists: number }
  >()

  // 초기화
  players?.forEach((player) => {
    statsMap.set(String(player.id), {
      name: player.name,
      goals: 0,
      assists: 0,
    })
  })

  // 득점과 도움 집계
  allGoals?.forEach((goal) => {
    if (goal.scorer_id) {
      const scorerId = String(goal.scorer_id)
      const stats = statsMap.get(scorerId)
      if (stats) {
        stats.goals++
      }
    }

    if (goal.assist_id) {
      const assistId = String(goal.assist_id)
      const stats = statsMap.get(assistId)
      if (stats) {
        stats.assists++
      }
    }
  })

  // 배열로 변환
  const stats = Array.from(statsMap.values()).sort((a, b) => b.goals - a.goals)

  const json = NextResponse.json(stats, { status: 200 })
  cookieResponse.headers.forEach((v, k) => json.headers.set(k, v))
  return json
}

