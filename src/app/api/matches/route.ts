import { NextResponse, type NextRequest } from 'next/server'
import { createServerClientForRoute } from '@/libs/supabase/server-route'
import type { CreateMatchPayload, MatchCreatedResponse, MatchListItem } from '@/types/match'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET(request: NextRequest) {
  const { supabase, cookieResponse } = createServerClientForRoute(request)

  const { data, error } = await supabase
    .from('matches')
    .select('id, date, opponent, place, score')
    .order('date', { ascending: false })

  if (error) {
    const json = NextResponse.json({ error: error.message }, { status: 400 })
    cookieResponse.headers.forEach((v, k) => json.headers.set(k, v))
    return json
  }

  const json = NextResponse.json((data ?? []) as MatchListItem[], { status: 200 })
  cookieResponse.headers.forEach((v, k) => json.headers.set(k, v))
  return json
}

export async function POST(request: NextRequest) {
  const { supabase, cookieResponse } = createServerClientForRoute(request)

  let body: CreateMatchPayload
  try {
    body = (await request.json()) as CreateMatchPayload
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const { data, error } = await supabase.rpc('create_match_full', { payload: body })
  if (error) {
    const json = NextResponse.json({ error: error.message }, { status: 400 })
    cookieResponse.headers.forEach((v, k) => json.headers.set(k, v))
    return json
  }

  const json = NextResponse.json(data as MatchCreatedResponse, { status: 201 })
  cookieResponse.headers.forEach((v, k) => json.headers.set(k, v))
  return json
}
