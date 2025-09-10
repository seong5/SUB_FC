import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// GET /api/matches → 경기 목록 조회
export async function GET() {
  const { data, error } = await supabase
    .from('matches')
    .select('id, date, opponent, place, score')
    .order('date', { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data ?? [])
}

// POST /api/matches → 경기 등록
export async function POST(req: Request) {
  const payload = await req.json() // { match, roster, quarters }
  const { data: created, error } = await supabase.rpc('create_match_full', { payload })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(created, { status: 201 })
}
