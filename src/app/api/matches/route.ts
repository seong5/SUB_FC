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

  // mom_player_ids를 숫자 배열로 변환 (RPC 함수에서 bigint로 변환하기 쉽도록)
  const payloadForRpc = {
    ...body,
    mom_player_ids: body.mom_player_ids?.map((id) => Number(id)) || undefined,
  }

  const { data, error } = await supabase.rpc('create_match_full', { payload: payloadForRpc })
  if (error) {
    // 더 자세한 에러 정보 로깅
    console.error('RPC 함수 에러:', error)
    console.error('Payload:', JSON.stringify(body, null, 2))
    const json = NextResponse.json(
      { error: error.message, details: error.details || error.hint || 'Unknown error' },
      { status: 400 }
    )
    cookieResponse.headers.forEach((v, k) => json.headers.set(k, v))
    return json
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
