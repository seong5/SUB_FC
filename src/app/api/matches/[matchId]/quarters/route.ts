import { NextRequest, NextResponse } from 'next/server'
import { createServerClientForRoute } from '@/libs/supabase/server-route'
import type { QuarterData } from '@/types/match'

export async function PATCH(req: NextRequest, ctx: { params: Promise<{ matchId: string }> }) {
  const { matchId } = await ctx.params
  const quarters: QuarterData[] = await req.json()
  const { supabase } = createServerClientForRoute(req)

  await supabase.from('match_quarters').delete().eq('match_id', Number(matchId))
  const rows = quarters.map((q) => ({
    match_id: Number(matchId),
    quarter: q.quarter,
    conceded: q.conceded,
    score_after: q.scoreAfter,
  }))
  const { error } = await supabase.from('match_quarters').insert(rows)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
