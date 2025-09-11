import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'
export const revalidate = 0

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

type QuarterRow = { quarter: number; conceded: number; score_after: string }
type GoalRow = {
  quarter: number
  minute: number | null
  scorer_id: string
  scorer_name: string | null
  assist_id: string | null
  assist_name: string | null
}

export async function GET(_req: NextRequest, context: { params: Promise<{ matchId: string }> }) {
  const { matchId } = await context.params
  const id = Number(matchId)
  if (!Number.isFinite(id)) {
    return NextResponse.json({ error: 'Invalid id' }, { status: 400 })
  }

  // 1) 경기 기본 정보 + 장소 조인
  const { data: match, error: mErr } = await supabase
    .from('matches')
    .select('id, date, opponent, place, score')
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
    return NextResponse.json({ error: mErr?.message ?? 'Not found' }, { status: 404 })
  }

  // 2) 쿼터
  const { data: quarters } = await supabase
    .from('match_quarters')
    .select('quarter, conceded, score_after')
    .eq('match_id', id)
    .order('quarter', { ascending: true })
    .returns<QuarterRow[]>()

  // 3) 골 이벤트
  const { data: goals } = await supabase
    .from('v_match_goals')
    .select('quarter, minute, scorer_id, scorer_name, assist_id, assist_name')
    .eq('match_id', id)
    .order('quarter', { ascending: true })
    .order('minute', { ascending: true, nullsFirst: true })
    .returns<GoalRow[]>()

  // 4) 쿼터별로 데이터 합치기
  const byQuarter = new Map<
    number,
    {
      goals: Array<{ minute: number | null; scorer: string; assist?: string }>
      conceded: number
      scoreAfter: string
    }
  >()

  for (const q of quarters ?? []) {
    byQuarter.set(q.quarter, { goals: [], conceded: q.conceded, scoreAfter: q.score_after })
  }

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

  // 5) 최종 응답
  return NextResponse.json({
    matchId: match.id,
    date: match.date,
    opponent: match.opponent,
    finalScore: match.score,
    place: match.place, // 사용자가 입력한 원문
    place_name: match.places?.name ?? null, // 정규화 이름
    place_address: match.places?.address ?? null,
    place_lat: match.places?.lat ?? null,
    place_lng: match.places?.lng ?? null,
    quarters: resultQuarters,
  })
}
