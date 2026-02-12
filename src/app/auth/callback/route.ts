import { NextRequest, NextResponse } from 'next/server'
import { createServerClientForRoute } from '@/shared/api/supabase'

export async function GET(request: NextRequest) {
  const url = new URL(request.url)
  const code = url.searchParams.get('code')
  const origin = url.origin

  if (!code) {
    return NextResponse.redirect(`${origin}/auth/auth-code-error`)
  }

  // 이제 response는 반환 객체 안에서 받음
  const { supabase, cookieResponse } = createServerClientForRoute(request)

  const { error } = await supabase.auth.exchangeCodeForSession(code)

  if (error) {
    return NextResponse.redirect(`${origin}/auth/auth-code-error`)
  }

  const res = NextResponse.redirect(`${origin}/`)
  cookieResponse.headers.forEach((v, k) => res.headers.set(k, v))
  return res
}
