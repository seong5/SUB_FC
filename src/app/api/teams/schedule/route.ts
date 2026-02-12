import { NextResponse, type NextRequest } from 'next/server'
import { createServerClientForRoute } from '@/shared/api/supabase'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export type ScheduleEvent = {
  id: string
  date: string
  type: '매치' | '회식' | '기타'
  title?: string
  place?: string
  created_at?: string
}

export type CreateScheduleEventDto = {
  date: string
  type: '매치' | '회식' | '기타'
  title?: string
  place?: string
}

export async function GET(request: NextRequest) {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return NextResponse.json(
      { error: 'Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY' },
      { status: 500 }
    )
  }

  const { supabase, cookieResponse } = createServerClientForRoute(request)

  // schedule_events 테이블에서 일정 조회
  // 만약 테이블이 없다면 matches 테이블을 활용할 수도 있습니다
  const { data, error } = await supabase
    .from('schedule_events')
    .select('id, date, type, title, place, created_at')
    .order('date', { ascending: true })

  if (error) {
    // 테이블이 없을 경우 빈 배열 반환 (나중에 테이블 생성 후 사용)
    if (error.code === 'PGRST116' || error.message.includes('does not exist')) {
      const json = NextResponse.json([] as ScheduleEvent[], { status: 200 })
      cookieResponse.headers.forEach((v, k) => json.headers.set(k, v))
      return json
    }
    const json = NextResponse.json({ error: error.message }, { status: 500 })
    cookieResponse.headers.forEach((v, k) => json.headers.set(k, v))
    return json
  }

  const json = NextResponse.json((data ?? []) as ScheduleEvent[], { status: 200 })
  cookieResponse.headers.forEach((v, k) => json.headers.set(k, v))
  return json
}

export async function POST(request: NextRequest) {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return NextResponse.json(
      { error: 'Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY' },
      { status: 500 }
    )
  }

  const { supabase, cookieResponse } = createServerClientForRoute(request)

  let body: CreateScheduleEventDto
  try {
    body = (await request.json()) as CreateScheduleEventDto
  } catch {
    const json = NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
    cookieResponse.headers.forEach((v, k) => json.headers.set(k, v))
    return json
  }

  // 필수 필드 검증
  if (!body.date || !body.type) {
    const json = NextResponse.json({ error: 'date and type are required' }, { status: 400 })
    cookieResponse.headers.forEach((v, k) => json.headers.set(k, v))
    return json
  }

  const { data, error } = await supabase
    .from('schedule_events')
    .insert({
      date: body.date,
      type: body.type,
      title: body.title ?? null,
      place: body.place ?? null,
    })
    .select()
    .single()

  if (error) {
    const json = NextResponse.json({ error: error.message }, { status: 500 })
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
        const schedule = data as ScheduleEvent
        const channel = supabase.channel('notifications')
        const scheduleTitle = schedule.title || schedule.type
        const formatDateForNotification = (dateString: string): string => {
          const date = new Date(dateString)
          const year = date.getFullYear()
          const month = date.getMonth() + 1
          const day = date.getDate()
          return `${year}년 ${month}월 ${day}일`
        }

        const formattedDate = formatDateForNotification(schedule.date)

        await channel.send({
          type: 'broadcast',
          event: 'schedule_created',
          payload: {
            message: `새로운 일정이 등록되었습니다: ${scheduleTitle}`,
            date: formattedDate,
            createdBy: user.id,
            scheduleId: schedule.id,
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

  const json = NextResponse.json(data as ScheduleEvent, { status: 201 })
  cookieResponse.headers.forEach((v, k) => json.headers.set(k, v))
  return json
}
