import { NextResponse, type NextRequest } from 'next/server'
import { createServerClientForRoute } from '@/libs/supabase/server-route'

export const dynamic = 'force-dynamic'
export const revalidate = 0

type QuarterRow = { quarter: number; conceded: number; score_after: string }
type GoalRow = {
  quarter: number
  minute: number | null
  scorer_id: string
  scorer_name: string | null
  assist_id: string | null
  assist_name: string | null
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ matchId: string }> } // Next15: params는 Promise
) {
  // 환경변수 없으면 빌드/런타임 모두에서 깔끔히 실패
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return NextResponse.json(
      { error: 'Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY' },
      { status: 500 }
    )
  }

  const { matchId } = await context.params
  const id = Number(matchId)
  if (!Number.isFinite(id)) return NextResponse.json({ error: 'Invalid id' }, { status: 400 })

  // createClient 직접 쓰지 말고, 서버용 헬퍼 사용
  const { supabase, cookieResponse } = createServerClientForRoute(request)

  // 1) 경기 기본 + 장소 조인
  const { data: match, error: mErr } = await supabase
    .from('matches')
    .select(
      `id, date, opponent, place, score, place_id,
       places:place_id ( id, name, address, lat, lng )`
    )
    .eq('id', id)
    .single<{
      id: number
      date: string
      opponent: string
      place: string
      score: string
      place_id: number | null
      places: { id: number; name: string; address: string; lat: number; lng: number } | null
    }>()

  if (mErr || !match) {
    const json = NextResponse.json({ error: mErr?.message ?? 'Not found' }, { status: 404 })
    cookieResponse.headers.forEach((v, k) => json.headers.set(k, v))
    return json
  }

  // 2) 쿼터
  const { data: quarters, error: qErr } = await supabase
    .from('match_quarters')
    .select('quarter, conceded, score_after')
    .eq('match_id', id)
    .order('quarter', { ascending: true })
    .returns<QuarterRow[]>()

  if (qErr) {
    const json = NextResponse.json({ error: qErr.message }, { status: 500 })
    cookieResponse.headers.forEach((v, k) => json.headers.set(k, v))
    return json
  }

  // 3) 골 이벤트 (이름 포함 뷰)
  const { data: goals, error: gErr } = await supabase
    .from('v_match_goals')
    .select('quarter, minute, scorer_id, scorer_name, assist_id, assist_name')
    .eq('match_id', id)
    .order('quarter', { ascending: true })
    .order('minute', { ascending: true, nullsFirst: true })
    .returns<GoalRow[]>()

  if (gErr) {
    const json = NextResponse.json({ error: gErr.message }, { status: 500 })
    cookieResponse.headers.forEach((v, k) => json.headers.set(k, v))
    return json
  }

  // 합치기
  const byQuarter = new Map<
    number,
    {
      goals: Array<{ minute: number | null; scorer: string; assist?: string }>
      conceded: number
      scoreAfter: string
    }
  >()
  for (const q of quarters ?? [])
    byQuarter.set(q.quarter, { goals: [], conceded: q.conceded, scoreAfter: q.score_after })
  for (const g of goals ?? []) {
    const slot = byQuarter.get(g.quarter)
    if (!slot) continue
    slot.goals.push({
      minute: g.minute,
      scorer: g.scorer_name ?? `#${g.scorer_id}`,
      assist: g.assist_name ?? undefined,
    })
  }
  const resultQuarters = Array.from(byQuarter.entries())
    .sort((a, b) => a[0] - b[0])
    .map(([quarter, v]) => ({
      label: `${quarter} 쿼터`,
      goals: v.goals,
      conceded: v.conceded,
      scoreAfter: v.scoreAfter,
    }))

  const json = NextResponse.json(
    {
      matchId: match.id,
      date: match.date,
      opponent: match.opponent,
      finalScore: match.score,
      place: match.place,
      place_name: match.places?.name ?? null,
      place_address: match.places?.address ?? null,
      place_lat: match.places?.lat ?? null,
      place_lng: match.places?.lng ?? null,
      quarters: resultQuarters,
    },
    { status: 200 }
  )
  cookieResponse.headers.forEach((v, k) => json.headers.set(k, v))
  return json
}

export async function DELETE(
  _req: NextRequest,
  context: { params: Promise<{ id?: string; matchId?: string }> }
) {
  const { id, matchId } = await context.params
  const targetId = id ?? matchId // 폴더명이 [id]든 [matchId]든 대응
  if (!targetId) {
    return NextResponse.json({ error: 'Missing id' }, { status: 400 })
  }

  const { supabase } = createServerClientForRoute(_req)

  //matches 테이블에서 id 기준 삭제
  const { error } = await supabase.from('matches').delete().eq('id', Number(targetId))

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  // 삭제 후 리다이렉트
  return NextResponse.redirect(new URL('/', _req.url))
}
