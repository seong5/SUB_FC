import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// 동적 처리 강제(캐시/프리렌더 이슈 회피)
export const dynamic = 'force-dynamic'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const id = Number(params.id)
  if (!Number.isFinite(id)) {
    return NextResponse.json({ error: 'Invalid id' }, { status: 400 })
  }

  // 1) 경기 기본 정보
  const { data: match, error: mErr } = await supabase
    .from('matches')
    .select('id, date, opponent, place, score')
    .eq('id', id)
    .single()

  if (mErr || !match) {
    return NextResponse.json({ error: mErr?.message ?? 'Not found' }, { status: 404 })
  }

  // 2) 쿼터
  const { data: quarters, error: qErr } = await supabase
    .from('match_quarters')
    .select('quarter, conceded, score_after')
    .eq('match_id', id)
    .order('quarter', { ascending: true })

  if (qErr) {
    return NextResponse.json({ error: qErr.message }, { status: 500 })
  }

  // 3) 골 이벤트 (이름이 scorer_id/assist_id 컬럼에 이미 들어있는 상태)
  const { data: goals, error: gErr } = await supabase
    .from('match_goals')
    .select('quarter, minute, scorer_id, assist_id')
    .eq('match_id', id)
    .order('quarter', { ascending: true })
    .order('minute', { ascending: true })

  if (gErr) {
    return NextResponse.json({ error: gErr.message }, { status: 500 })
  }

  // quarters + goals 합치기 (상세 화면에서 쓰기 쉬운 형태)
  const byQuarter = new Map<number, { goals: string[]; assists: string[] }>()
  for (const g of goals ?? []) {
    const slot = byQuarter.get(g.quarter) ?? { goals: [], assists: [] }
    if (g.scorer_id) slot.goals.push(g.scorer_id)
    if (g.assist_id) slot.assists.push(g.assist_id)
    byQuarter.set(g.quarter, slot)
  }

  const resultQuarters = (quarters ?? []).map((q) => {
    const e = byQuarter.get(q.quarter) ?? { goals: [], assists: [] }
    return {
      label: `${q.quarter} 쿼터`,
      goals: e.goals,
      assists: e.assists,
      conceded: q.conceded,
      scoreAfter: q.score_after,
    }
  })

  // 최종 응답
  return NextResponse.json({
    matchId: match.id,
    date: match.date,
    opponent: match.opponent,
    finalScore: match.score,
    quarters: resultQuarters,
    place: match.place,
  })
}
