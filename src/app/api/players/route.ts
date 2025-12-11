import { NextResponse, type NextRequest } from 'next/server'
import { createServerClientForRoute } from '@/libs/supabase/server-route'

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

  // 1. 모든 선수 기본 정보 가져오기
  const { data: players, error: playersError } = await supabase
    .from('players')
    .select('id, name, back_number, position, attendance_matches, attendance_percent, created_at')

  if (playersError) {
    const json = NextResponse.json({ error: playersError.message }, { status: 500 })
    cookieResponse.headers.forEach((v, k) => json.headers.set(k, v))
    return json
  }

  // 2. 모든 match_goals에서 득점과 도움 실시간 계산
  const { data: allGoals, error: goalsError } = await supabase
    .from('match_goals')
    .select('scorer_id, assist_id')

  if (goalsError) {
    const json = NextResponse.json({ error: goalsError.message }, { status: 500 })
    cookieResponse.headers.forEach((v, k) => json.headers.set(k, v))
    return json
  }

  // 3. 모든 match_moms에서 MOM 실시간 계산
  const { data: allMoms, error: momsError } = await supabase
    .from('match_moms')
    .select('player_id')

  if (momsError) {
    const json = NextResponse.json({ error: momsError.message }, { status: 500 })
    cookieResponse.headers.forEach((v, k) => json.headers.set(k, v))
    return json
  }

  // 4. 선수별 득점, 도움, MOM 집계
  const statsMap = new Map<string, { goals: number; assists: number; mom: number }>()

  // 초기화
  players?.forEach((player) => {
    statsMap.set(String(player.id), {
      goals: 0,
      assists: 0,
      mom: 0,
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

  // MOM 집계
  allMoms?.forEach((mom) => {
    if (mom.player_id) {
      const playerId = String(mom.player_id)
      const stats = statsMap.get(playerId)
      if (stats) {
        stats.mom++
      }
    }
  })

  // 5. 선수 정보와 통계 합치기
  const result = players?.map((player) => {
    const stats = statsMap.get(String(player.id)) || { goals: 0, assists: 0, mom: 0 }
    return {
      id: player.id,
      name: player.name,
      back_number: player.back_number,
      position: player.position,
      goals: stats.goals, // 실시간 계산된 득점
      assists: stats.assists, // 실시간 계산된 도움
      mom: stats.mom, // 실시간 계산된 MOM 횟수
      attendance_matches: player.attendance_matches,
      attendance_percent: player.attendance_percent,
      created_at: player.created_at,
    }
  })

  const json = NextResponse.json(result ?? [], { status: 200 })
  cookieResponse.headers.forEach((v, k) => json.headers.set(k, v))
  return json
}
