import { NextRequest, NextResponse } from 'next/server'
import { createServerClientForRoute } from '@/shared/api/supabase'
import type { PostMatchData, RosterData, QuarterData, PlayerLite } from '@/entities/match'

type MatchRow = { date: string; opponent: string; place: string; score: string }
type RosterRow = { formation: string; gk: string[] | null; df: string[] | null; mf: string[] | null; fw: string[] | null }
type QuarterRow = { quarter: 1 | 2 | 3 | 4; conceded: number; score_after: string }
type GoalRow = {
  quarter: 1 | 2 | 3 | 4
  minute: number | null
  scorer_id: string
  assist_id: string | null
}
type PlayerRow = { id: string; name: string; position: 'GK' | 'DF' | 'MF' | 'FW' }

export async function GET(req: NextRequest, ctx: { params: Promise<{ matchId: string }> }) {
  const { matchId } = await ctx.params
  const id = Number(matchId)
  const { supabase } = createServerClientForRoute(req)

  // 1) match
  const { data: m, error: mErr } = await supabase
    .from('matches')
    .select('date, opponent, place, score')
    .eq('id', id)
    .single<MatchRow>()
  if (mErr || !m) return NextResponse.json({ error: mErr?.message ?? 'not found' }, { status: 404 })
  const match: PostMatchData = {
    date: m.date,
    opponent: m.opponent,
    place: m.place,
    score: m.score,
  }

  // 2) roster (없을 수도 있으니 500 대신 빈 값으로 처리)
  const { data: r } = await supabase
    .from('match_roster')
    .select('formation, gk, df, mf, fw')
    .eq('match_id', id)
    .single<RosterRow>()
  const roster: RosterData = r
    ? {
        formation: r.formation as RosterData['formation'],
        GK: r.gk ?? [],
        DF: r.df ?? [],
        MF: r.mf ?? [],
        FW: r.fw ?? [],
      }
    : {
        formation: '4-2-3-1',
        GK: [],
        DF: [],
        MF: [],
        FW: [],
      }

  // 3) quarters (없으면 빈 배열)
  const { data: qs, error: qErr } = await supabase
    .from('match_quarters')
    .select('quarter, conceded, score_after')
    .eq('match_id', id)
    .order('quarter', { ascending: true })
    .returns<QuarterRow[]>()
  const quarterRows: QuarterRow[] = !qErr && qs ? qs : []

  // 4) goals (없으면 빈 배열)
  const { data: gs, error: gErr } = await supabase
    .from('match_goals')
    .select('quarter, minute, scorer_id, assist_id')
    .eq('match_id', id)
    .order('quarter', { ascending: true })
    .order('minute', { ascending: true, nullsFirst: true })
    .returns<GoalRow[]>()
  const goalRows: GoalRow[] = !gErr && gs ? gs : []

  const quarters: QuarterData[] = quarterRows.map((q) => ({
    quarter: q.quarter,
    goals: [],
    conceded: q.conceded,
    scoreAfter: q.score_after,
  }))
  for (const g of goalRows) {
    const slot = quarters.find((q) => q.quarter === g.quarter)
    if (!slot) continue
    slot.goals.push({
      minute: g.minute ?? undefined,
      scorerId: g.scorer_id,
      assistId: g.assist_id,
    })
  }

  // 5) players (예: players 테이블이 있다고 가정)
  const { data: ps, error: pErr } = await supabase
    .from('players')
    .select('id, name, position')
    .returns<PlayerRow[]>()
  if (pErr) return NextResponse.json({ error: pErr.message }, { status: 500 })
  const players: PlayerLite[] = ps.map((p) => ({
    id: String(p.id),
    name: p.name,
    position: p.position,
  }))

  return NextResponse.json({ match, roster, quarters, scores: quarters, players }, { status: 200 })
}
