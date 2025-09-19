import { NextRequest, NextResponse } from 'next/server'
import { createServerClientForRoute } from '@/libs/supabase/server-route'
import type { RosterData } from '@/types/match'

type RosterRow = {
  match_id: number
  formation: string
  gk: string[]
  df: string[]
  mf: string[]
  fw: string[]
}

export async function PATCH(req: NextRequest, ctx: { params: Promise<{ matchId: string }> }) {
  const { matchId } = await ctx.params
  const id = Number(matchId)
  if (!Number.isFinite(id)) return NextResponse.json({ error: 'Invalid id' }, { status: 400 })

  const body: RosterData = await req.json()
  const row: RosterRow = {
    match_id: id,
    formation: body.formation,
    gk: body.GK,
    df: body.DF,
    mf: body.MF,
    fw: body.FW,
  }

  const { supabase } = createServerClientForRoute(req)

  // 행이 없을 수도 있으니 upsert 사용 (match_id 유니크 인덱스 필요)
  const { error } = await supabase.from('match_roster').upsert(row, { onConflict: 'match_id' })

  if (error) {
    // 디버깅 시 에러 메시지 바로 확인
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
