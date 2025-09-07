import { cookies } from 'next/headers'
import { createServerClient as createSupabaseServerClient } from '@supabase/ssr'

// RSC에서는 쿠키 쓰기(set/remove)가 없으므로 no-op으로 처리
export async function createServerClientRSC() {
  const cookieStore = await cookies() // Next 15에서 Promise일 수 있음
  return createSupabaseServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set() {
          /* no-op in RSC */
        },
        remove() {
          /* no-op in RSC */
        },
      },
    }
  )
}
