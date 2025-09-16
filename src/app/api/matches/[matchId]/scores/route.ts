import { NextRequest, NextResponse } from 'next/server'
import { createServerClientForRoute } from '@/libs/supabase/server-route'
import type { QuarterData } from '@/types/match'

export async function PATCH(req: NextRequest, ctx: { params: Promise<{ matchId: string }> }) {
  const { matchId } = await ctx.params
  const quarters: QuarterData[] = await req.json()
  const { supabase } = createServerClientForRoute(req)

  await supabase.from('match_goals').delete().eq('match_id', Number(matchId))
  const rows = quarters.flatMap((q) =>
    q.goals.map((g) => ({
      match_id: Number(matchId),
      quarter: q.quarter,
      minute: g.minute ?? null,
      scorer_id: g.scorerId,
      assist_id: g.assistId ?? null,
    }))
  )
  if (rows.length) {
    const { error } = await supabase.from('match_goals').insert(rows)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  }
  return NextResponse.json({ ok: true })
}
