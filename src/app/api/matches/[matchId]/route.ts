import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'
export const revalidate = 0

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

type MatchRow = {
  id: number
  date: string
  opponent: string
  place: string
  score: string
  place_name: string | null
  place_address: string | null
  place_lat: number | null
  place_lng: number | null
}
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
  if (!Number.isFinite(id)) return NextResponse.json({ error: 'Invalid id' }, { status: 400 })

  const { data: match, error: mErr } = await supabase
    .from('matches')
    .select('id, date, opponent, place, score, place_name, place_address, place_lat, place_lng')
    .eq('id', id)
    .single<MatchRow>()
  if (mErr || !match)
    return NextResponse.json({ error: mErr?.message ?? 'Not found' }, { status: 404 })

  const { data: quarters } = await supabase
    .from('match_quarters')
    .select('quarter, conceded, score_after')
    .eq('match_id', id)
    .order('quarter', { ascending: true })
    .returns<QuarterRow[]>()

  const { data: goals } = await supabase
    .from('v_match_goals')
    .select('quarter, minute, scorer_id, scorer_name, assist_id, assist_name')
    .eq('match_id', id)
    .order('quarter', { ascending: true })
    .order('minute', { ascending: true, nullsFirst: true })
    .returns<GoalRow[]>()

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

  return NextResponse.json({
    matchId: match.id,
    date: match.date,
    opponent: match.opponent,
    finalScore: match.score,
    place: match.place, // 원문
    place_name: match.place_name, // 정규화명
    place_address: match.place_address,
    place_lat: match.place_lat,
    place_lng: match.place_lng,
    quarters: resultQuarters,
  })
}
