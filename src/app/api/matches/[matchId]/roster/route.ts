import { NextRequest, NextResponse } from 'next/server'
import { createServerClientForRoute } from '@/libs/supabase/server-route'
import type { RosterData } from '@/types/match'

export async function PATCH(req: NextRequest, ctx: { params: Promise<{ matchId: string }> }) {
  const { matchId } = await ctx.params
  const body: RosterData = await req.json()
  const { supabase } = createServerClientForRoute(req)

  const { error } = await supabase.from('match_roster').update(body).eq('match_id', Number(matchId))

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
