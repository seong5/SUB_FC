import { createServerClient as createSupabaseServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export function createServerClientForRoute(request: NextRequest) {
  // 미들웨어가 아니라 라우트 핸들러이므로 next() 금지
  const cookieResponse = new NextResponse()

  const supabase = createSupabaseServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          cookieResponse.cookies.set({ name, value, ...options })
        },
        remove(name: string, options: CookieOptions) {
          cookieResponse.cookies.set({ name, value: '', ...options })
        },
      },
    }
  )

  // 쿠키를 담아둔 임시 응답을 함께 반환
  return { supabase, cookieResponse }
}
