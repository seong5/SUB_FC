import { NextResponse, type NextRequest } from 'next/server'
import { createServerClientForRoute } from '@/shared/api/supabase'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET(request: NextRequest) {
  const { supabase, cookieResponse } = createServerClientForRoute(request)

  const { searchParams } = new URL(request.url)
  const playerIdParam = searchParams.get('playerId')
  const yearParam = searchParams.get('year')

  if (!playerIdParam) {
    return NextResponse.json({ error: 'playerId is required' }, { status: 400 })
  }

  const assistId = Number(playerIdParam)
  if (!Number.isFinite(assistId)) {
    return NextResponse.json({ error: 'invalid playerId' }, { status: 400 })
  }

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

  // 1. 내가 어시스트한 골들에서 scorer_id 집계
  let goalsQuery = supabase
    .from('match_goals')
    .select('match_id, scorer_id, assist_id')
    .eq('assist_id', assistId)

  if (isYearFilter && matchIds.length > 0) {
    goalsQuery = goalsQuery.in('match_id', matchIds)
  }

  const { data: goals, error: goalsError } = await goalsQuery
  if (goalsError) {
    const json = NextResponse.json({ error: goalsError.message }, { status: 500 })
    cookieResponse.headers.forEach((v, k) => json.headers.set(k, v))
    return json
  }

  const counts = new Map<number, number>()

  goals?.forEach((g) => {
    if (!g.scorer_id) return
    const id = Number(g.scorer_id)
    if (!Number.isFinite(id)) return
    counts.set(id, (counts.get(id) ?? 0) + 1)
  })

  if (counts.size === 0) {
    const empty = NextResponse.json([], { status: 200 })
    cookieResponse.headers.forEach((v, k) => empty.headers.set(k, v))
    return empty
  }

  const scorerIds = Array.from(counts.keys())

  // 2. 해당 선수들의 기본 정보
  const { data: scorers, error: playersError } = await supabase
    .from('players')
    .select('id, name, back_number, position')
    .in('id', scorerIds)

  if (playersError) {
    const json = NextResponse.json({ error: playersError.message }, { status: 500 })
    cookieResponse.headers.forEach((v, k) => json.headers.set(k, v))
    return json
  }

  const total = Array.from(counts.values()).reduce((sum, c) => sum + c, 0) || 1

  const result =
    scorers?.map((p) => {
      const c = counts.get(p.id) ?? 0
      return {
        id: p.id,
        name: p.name,
        back_number: p.back_number,
        position: p.position,
        goals_from_my_assist: c,
        goals_from_my_assist_percent: Math.round((c / total) * 100),
      }
    }) ?? []

  // 내가 가장 많이 도와준 선수만 정렬해서 반환
  const max = result.reduce((m, r) => (r.goals_from_my_assist > m ? r.goals_from_my_assist : m), 0)
  const top = result.filter((r) => r.goals_from_my_assist === max).sort((a, b) => a.back_number - b.back_number)

  const json = NextResponse.json(top, { status: 200 })
  cookieResponse.headers.forEach((v, k) => json.headers.set(k, v))
  return json
}

