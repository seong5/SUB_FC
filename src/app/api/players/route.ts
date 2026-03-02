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

  const { searchParams } = new URL(request.url)
  const yearParam = searchParams.get('year')
  const year = yearParam ? parseInt(yearParam, 10) : null
  const isYearFilter = year != null && Number.isFinite(year)

  let matchIds: number[] = []
  if (isYearFilter && year != null) {
    const yearStart = `${year}-01-01`
    const yearEnd = `${year + 1}-01-01`
    const { data: yearMatches, error: matchesError } = await supabase
      .from('matches')
      .select('id')
      .gte('date', yearStart)
      .lt('date', yearEnd)

    if (matchesError) {
      const json = NextResponse.json({ error: matchesError.message }, { status: 500 })
      cookieResponse.headers.forEach((v, k) => json.headers.set(k, v))
      return json
    }
    matchIds = (yearMatches ?? []).map((m) => m.id)
  }

  // 1. 모든 선수 기본 정보 가져오기
  const { data: players, error: playersError } = await supabase
    .from('players')
    .select('id, name, back_number, position, attendance_matches, attendance_percent, created_at')

  if (playersError) {
    const json = NextResponse.json({ error: playersError.message }, { status: 500 })
    cookieResponse.headers.forEach((v, k) => json.headers.set(k, v))
    return json
  }

  // 2. match_goals에서 득점과 도움 실시간 계산
  let goalsQuery = supabase.from('match_goals').select('match_id, scorer_id, assist_id')
  if (isYearFilter && matchIds.length > 0) {
    goalsQuery = goalsQuery.in('match_id', matchIds)
  }
  const { data: allGoals, error: goalsError } = await goalsQuery

  if (goalsError) {
    const json = NextResponse.json({ error: goalsError.message }, { status: 500 })
    cookieResponse.headers.forEach((v, k) => json.headers.set(k, v))
    return json
  }

  // 3. match_moms에서 MOM 실시간 계산
  let momsQuery = supabase.from('match_moms').select('match_id, player_id')
  if (isYearFilter && matchIds.length > 0) {
    momsQuery = momsQuery.in('match_id', matchIds)
  }
  const { data: allMoms, error: momsError } = await momsQuery

  if (momsError) {
    const json = NextResponse.json({ error: momsError.message }, { status: 500 })
    cookieResponse.headers.forEach((v, k) => json.headers.set(k, v))
    return json
  }

  // 4. (year 필터 시) match_roster에서 참석률 계산
  const attendanceMap = new Map<string, { matches: number; percent: number }>()
  if (isYearFilter && matchIds.length > 0) {
    const { data: rosters, error: rosterError } = await supabase
      .from('match_roster')
      .select('match_id, gk, df, mf, fw')
      .in('match_id', matchIds)

    if (!rosterError && rosters) {
      const totalMatches = matchIds.length
      const playerMatchCount = new Map<string, number>()
      const flatten = (arr: string[] | null | undefined): string[] =>
        Array.isArray(arr) ? arr.map(String) : []

      rosters.forEach((r) => {
        const allIds = [
          ...flatten(r.gk),
          ...flatten(r.df),
          ...flatten(r.mf),
          ...flatten(r.fw),
        ]
        const unique = new Set(allIds)
        unique.forEach((pid) => {
          playerMatchCount.set(pid, (playerMatchCount.get(pid) ?? 0) + 1)
        })
      })

      players?.forEach((p) => {
        const pid = String(p.id)
        const count = playerMatchCount.get(pid) ?? 0
        const percent = totalMatches > 0 ? Math.round((count / totalMatches) * 100) : 0
        attendanceMap.set(pid, { matches: count, percent })
      })
    }
  }

  // 5. 선수별 득점, 도움, MOM 집계
  const statsMap = new Map<string, { goals: number; assists: number; mom: number }>()

  players?.forEach((player) => {
    statsMap.set(String(player.id), {
      goals: 0,
      assists: 0,
      mom: 0,
    })
  })

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

  allMoms?.forEach((mom) => {
    if (mom.player_id) {
      const playerId = String(mom.player_id)
      const stats = statsMap.get(playerId)
      if (stats) {
        stats.mom++
      }
    }
  })

  // 6. 선수 정보와 통계 합치기
  const result = players?.map((player) => {
    const stats = statsMap.get(String(player.id)) || { goals: 0, assists: 0, mom: 0 }
    const pid = String(player.id)
    const attendance = attendanceMap.get(pid)

    return {
      id: player.id,
      name: player.name,
      back_number: player.back_number,
      position: player.position,
      goals: stats.goals,
      assists: stats.assists,
      mom: stats.mom,
      attendance_matches: attendance ? attendance.matches : player.attendance_matches,
      attendance_percent: attendance ? attendance.percent : player.attendance_percent,
      created_at: player.created_at,
    }
  })

  const json = NextResponse.json(result ?? [], { status: 200 })
  cookieResponse.headers.forEach((v, k) => json.headers.set(k, v))
  return json
}
