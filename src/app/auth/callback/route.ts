import { NextRequest, NextResponse } from 'next/server'
import { createServerClientForRoute } from '@/libs/supabase/server-route'

export async function GET(request: NextRequest) {
  const url = new URL(request.url)
  const code = url.searchParams.get('code')
  let next = url.searchParams.get('next') ?? '/'
  if (!next.startsWith('/')) next = '/'

  const proto = request.headers.get('x-forwarded-proto') ?? url.protocol.replace(':', '')
  const host = request.headers.get('x-forwarded-host') ?? request.headers.get('host')!
  const origin = `${proto}://${host}`

  // 리다이렉트 응답을 먼저 만들고 쿠키를 여기에 심음
  const response = NextResponse.redirect(new URL(next, origin))

  if (!code) return NextResponse.redirect(`${origin}/auth/auth-code-error`)

  const supabase = createServerClientForRoute(request, response)
  const { error } = await supabase.auth.exchangeCodeForSession(code)
  if (error) return NextResponse.redirect(`${origin}/auth/auth-code-error`)

  return response
}
