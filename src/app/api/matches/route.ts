import { NextResponse, type NextRequest } from 'next/server'
import { createServerClientForRoute } from '@/libs/supabase/server-route'
import type { CreateMatchPayload, MatchCreatedResponse, MatchListItem } from '@/types/match'

/** GET /api/matches */
export async function GET(
  request: NextRequest
): Promise<NextResponse<MatchListItem[] | { error: string }>> {
  try {
    // 쿠키 포워딩 헤더 복사 같은 거 안 함 (원인 1차 제거)
    const supabase = createServerClientForRoute(request, NextResponse.next())

    // 환경변수 빠졌으면 바로 알려주기 (원인 2차 제거)
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      return NextResponse.json(
        { error: 'Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY' },
        { status: 500 }
      )
    }

    const { data, error } = await supabase
      .from('matches')
      .select('id, date, opponent, place, score')
      .order('date', { ascending: false })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json((data ?? []) as MatchListItem[], { status: 200 })
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e)
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}

/** POST /api/matches */
export async function POST(
  request: NextRequest
): Promise<NextResponse<MatchCreatedResponse | { error: string }>> {
  try {
    const supabase = createServerClientForRoute(request, NextResponse.next())

    let body: CreateMatchPayload
    try {
      body = (await request.json()) as CreateMatchPayload
    } catch {
      return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
    }

    const { data, error } = await supabase.rpc('create_match_full', { payload: body })
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json(data as MatchCreatedResponse, { status: 201 })
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e)
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
