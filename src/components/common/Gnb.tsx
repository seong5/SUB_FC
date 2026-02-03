'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { Calendar, Users } from 'lucide-react'
import { createClient } from '@/libs/supabase/client'
import type { User } from '@supabase/supabase-js'
import Icon from './Icon'
import Button from './Button'
import { useNotifications } from '@/store/useNotificationStore'
import Notification from './Notification'
import { useClickOutside } from '@/hooks/useClickOutside'

export default function Gnb() {
  const [user, setUser] = useState<User | null>(null)
  const [isNotificationOpen, setIsNotificationOpen] = useState(false)
  const notifications = useNotifications()
  const hasNotifications = notifications.length > 0
  const notificationRef = useRef<HTMLDivElement>(null)

  // 알림이 열려있을 때 외부 클릭 시 닫기
  useClickOutside(notificationRef, () => {
    if (isNotificationOpen) {
      setIsNotificationOpen(false)
    }
  })

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
  const pathname = usePathname()
  const router = useRouter()
  const isTeamsActive = pathname === '/teams' || pathname.startsWith('/teams/')
  const isPlayersActive = pathname === '/players' || pathname.startsWith('/players/')

  return (
    <nav className="flex flex-row justify-between sticky top-0 z-50 gap-20 h-80 px-20 md:px-30 bg-slate-950/60 backdrop-blur-xl border-b border-white/5">
      <div className="flex gap-15 md:gap-25 items-center">
        <Link href="/" className="md:mr-10 relative w-[50px] h-[50px] group">
          <div className="absolute -inset-2 bg-blue-600/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition duration-500" />
          <Image
            src="/subfc.png"
            alt="subfc-logo"
            width={50}
            height={50}
            className="rounded-full object-contain relative z-10"
            priority
          />
        </Link>
        <Link href="/teams" aria-label="팀관리" className="flex flex-col items-center gap-1 group">
          <div
            className={`p-2 rounded-lg transition-colors ${isTeamsActive ? 'bg-blue-500/10' : 'bg-white/10'}`}
          >
            <Calendar
              size={28}
              className={`w-28 h-28 mt-5 transition-colors ${isTeamsActive ? 'text-blue-400' : 'text-white'}`}
            />
          </div>
          <span
            className={`text-[8px] md:txt-14_M transition-colors ${isTeamsActive ? 'text-blue-400' : 'text-white'}`}
          >
            팀 정보
          </span>
        </Link>
        <Link
          href="/players"
          aria-label="선수관리"
          className="flex flex-col items-center gap-1 group"
        >
          <div
            className={`p-2 rounded-lg transition-colors ${isPlayersActive ? 'bg-blue-500/10' : 'bg-white/10'}`}
          >
            <Users
              size={28}
              className={`w-28 h-28 mt-5 transition-colors ${isPlayersActive ? 'text-blue-400' : 'text-white'}`}
            />
          </div>
          <span
            className={`text-[8px] md:txt-14_M transition-colors ${isPlayersActive ? 'text-blue-400' : 'text-white'}`}
          >
            선수 정보
          </span>
        </Link>
      </div>

      <div className="flex gap-15 md:gap-25 items-center">
        {user ? (
          <div className="flex items-center gap-10 pl-4 border-l border-white/10">
            <div ref={notificationRef} className="relative">
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  if (hasNotifications) {
                    setIsNotificationOpen((prev) => !prev)
                  }
                }}
                className="flex items-center justify-center w-20 h-20 md:w-28 md:h-28"
                aria-label={hasNotifications ? '알림 있음' : '알림 없음'}
                disabled={!hasNotifications}
              >
                <Icon
                  icon={hasNotifications ? 'Notification' : 'NotificationNone'}
                  className={`w-18 h-18 ${hasNotifications ? 'text-blue-400' : 'text-slate-500'}`}
                />
              </button>
              {isNotificationOpen && <Notification />}
            </div>
            <div className="flex items-center gap-3 bg-white/5 px-3 py-1.5 rounded-full border border-white/10">
              {avatar ? (
                <Image
                  src={avatar}
                  alt=""
                  width={32}
                  height={32}
                  className="rounded-full w-32 h-32 object-cover border border-white/20"
                />
              ) : (
                <div className="w-32 h-32 rounded-full bg-gradient-to-tr from-slate-700 to-slate-500 border border-white/20 flex items-center justify-center">
                  <span className="text-slate-400 text-xs">?</span>
                </div>
              )}
              <span className="text-[11px] font-bold text-slate-300 hidden md:block uppercase tracking-tight truncate max-w-[100px]">
                {displayName}
              </span>
            </div>
            <button
              onClick={async () => {
                const supabase = createClient()
                await supabase.auth.signOut()
              }}
              className="text-slate-500 hover:text-red-400 transition-colors text-sm"
            >
              로그아웃
            </button>
          </div>
        ) : (
          <>
            <Button
              variant="ghost"
              size="sm"
              rounded="12"
              type="button"
              onClick={() => router.push('/login')}
              className="inline-flex items-center justify-center text-sm font-black uppercase tracking-widest text-slate-400 hover:text-white transition-colors py-2 px-4 whitespace-nowrap"
            >
              로그인
            </Button>
            <Button
              size="xs"
              variant="primary"
              rounded="12"
              type="button"
              onClick={() => router.push('/signup')}
              className="px-6 py-3 rounded-full bg-blue-600 text-sm font-black uppercase tracking-widest text-white shadow-lg shadow-blue-600/20 hover:bg-blue-500"
            >
              회원가입
            </Button>
          </>
        )}
      </div>
    </nav>
  )
}
