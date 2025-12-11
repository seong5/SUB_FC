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

  // MOM 데이터 처리 (RPC 함수에서 처리하지 않은 경우를 대비)
  if (body.mom_player_ids && body.mom_player_ids.length > 0 && data) {
    const match = data as MatchCreatedResponse
    const momRows = body.mom_player_ids.map((playerId) => ({
      match_id: match.id,
      player_id: Number(playerId),
    }))

    const { error: momError } = await supabase.from('match_moms').insert(momRows)
    if (momError) {
      // MOM 저장 실패해도 경기 등록은 성공으로 처리 (로깅만)
      console.error('MOM 저장 실패:', momError.message)
    }
  }

  // 등록 성공 후 Broadcast 알림 전송
  if (data) {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (user) {
        const match = data as MatchCreatedResponse
        const channel = supabase.channel('notifications')
        await channel.send({
          type: 'broadcast',
          event: 'match_created',
          payload: {
            message: `새로운 경기 결과가 등록되었습니다: ${match.opponent} vs SUB FC`,
            createdBy: user.id,
            matchId: match.id,
          },
        })
        // 채널 정리
        await supabase.removeChannel(channel)
      }
    } catch (broadcastError) {
      // Broadcast 실패해도 API 응답은 성공 (알림은 선택사항)
      console.error('Broadcast 전송 실패:', broadcastError)
    }
  }

  const json = NextResponse.json(data as MatchCreatedResponse, { status: 201 })
  cookieResponse.headers.forEach((v, k) => json.headers.set(k, v))
  return json
}
