import { NextResponse, type NextRequest } from 'next/server'
import { createServerClientForRoute } from '@/shared/api/supabase'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ eventId: string }> }
) {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return NextResponse.json(
      { error: 'Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY' },
      { status: 500 }
    )
  }

  const { eventId } = await context.params
  const { supabase, cookieResponse } = createServerClientForRoute(request)

  const { error } = await supabase.from('schedule_events').delete().eq('id', eventId)

  if (error) {
    const json = NextResponse.json({ error: error.message }, { status: 500 })
    cookieResponse.headers.forEach((v, k) => json.headers.set(k, v))
    return json
  }

  const json = NextResponse.json({ success: true }, { status: 200 })
  cookieResponse.headers.forEach((v, k) => json.headers.set(k, v))
  return json
}

