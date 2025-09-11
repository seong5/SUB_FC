import { NextResponse, type NextRequest } from 'next/server'
import { createServerClientForRoute } from '@/libs/supabase/server-route'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET(request: NextRequest) {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return NextResponse.json(
      { error: 'Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY' },
      { status: 500 }
    )
  }

  // 변경된 헬퍼 사용
  const { supabase, cookieResponse } = createServerClientForRoute(request)

  // 일단 전체 컬럼으로 테스트(컬럼 문제 배제)
  const { data, error } = await supabase.from('players').select('*')

  if (error) {
    const json = NextResponse.json({ error: error.message, details: error }, { status: 500 })
    // Supabase가 세팅한 쿠키/헤더 복사
    cookieResponse.headers.forEach((v, k) => json.headers.set(k, v))
    return json
  }

  const json = NextResponse.json(data ?? [], { status: 200 })
  cookieResponse.headers.forEach((v, k) => json.headers.set(k, v))
  return json
}
