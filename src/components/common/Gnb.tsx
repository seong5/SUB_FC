'use client'

import Link from 'next/link'
import subfc from '../../../public/subfc.png'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { createClient } from '@/libs/supabase/client'
import type { User } from '@supabase/supabase-js'

export default function Gnb() {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const supabase = createClient()

    supabase.auth.getUser().then(({ data }) => setUser(data.user))

    const { data: subscription } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => {
      subscription.subscription.unsubscribe()
    }
  }, [])

  // Supabase 대시보드의 Display Name (full_name 우선, 없으면 email fallback)
  const displayName =
    (user?.user_metadata?.full_name as string | undefined) ?? user?.email ?? '게스트'

  const avatar = user?.user_metadata?.profile_image as string | undefined

  return (
    <div className="flex flex-row justify-between sticky top-0 z-50 gap-20 bg-white/60 backdrop-blur-md txt-black h-80 px-20 md:px-30">
      <div className="flex gap-15 md:gap-25 items-center txt-12_M md:txt-14_M ">
        <Link href="/" className="md:mr-10">
          <Image
            src={subfc}
            alt="subfc-logo"
            width={70}
            height={50}
            className="rounded-full w-50 h-50 md:w-70 md:h-70"
          />
        </Link>
        <Link href="/teams">팀관리</Link>
        <Link href="/players">선수관리</Link>
      </div>

      <div className="flex gap-15 md:gap-25 items-center txt-12_M md:txt-14_M">
        {user ? (
          <div className="flex items-center gap-10">
            {avatar && (
              <Image
                src={avatar}
                alt="프로필"
                width={32}
                height={32}
                className="rounded-full w-32 h-32"
              />
            )}
            <span>{displayName}</span>
            <button
              onClick={async () => {
                const supabase = createClient()
                await supabase.auth.signOut()
              }}
              className="text-red-500"
            >
              로그아웃
            </button>
          </div>
        ) : (
          <>
            <Link href="/login">로그인</Link>
            <Link href="/signup">회원가입</Link>
          </>
        )}
      </div>
    </div>
  )
}
