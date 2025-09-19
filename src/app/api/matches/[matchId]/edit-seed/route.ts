import { NextRequest, NextResponse } from 'next/server'
import { createServerClientForRoute } from '@/libs/supabase/server-route'
import type { PostMatchData, RosterData, QuarterData, PlayerLite } from '@/types/match'

type MatchRow = { date: string; opponent: string; place: string; score: string }
type RosterRow = { formation: string; GK: string[]; DF: string[]; MF: string[]; FW: string[] }
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

  // 2) roster
  const { data: r, error: rErr } = await supabase
    .from('match_roster')
    .select('formation, GK, DF, MF, FW')
    .eq('match_id', id)
    .single<RosterRow>()
  if (rErr || !r) return NextResponse.json({ error: rErr.message }, { status: 500 })
  const roster: RosterData = {
    formation: r.formation as RosterData['formation'],
    GK: r.GK,
    DF: r.DF,
    MF: r.MF,
    FW: r.FW,
  }

  // 3) quarters
  const { data: qs, error: qErr } = await supabase
    .from('match_quarters')
    .select('quarter, conceded, score_after')
    .eq('match_id', id)
    .order('quarter', { ascending: true })
    .returns<QuarterRow[]>()
  if (qErr || !qs) return NextResponse.json({ error: qErr.message }, { status: 500 })

  // 4) goals
  const { data: gs, error: gErr } = await supabase
    .from('match_goals')
    .select('quarter, minute, scorer_id, assist_id')
    .eq('match_id', id)
    .order('quarter', { ascending: true })
    .order('minute', { ascending: true, nullsFirst: true })
    .returns<GoalRow[]>()
  if (gErr || !gs) return NextResponse.json({ error: gErr.message }, { status: 500 })

  const quarters: QuarterData[] = qs.map((q) => ({
    quarter: q.quarter,
    goals: [],
    conceded: q.conceded,
    scoreAfter: q.score_after,
  }))
  for (const g of gs) {
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
