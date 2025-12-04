'use client'

import { useEffect } from 'react'
import { createClient } from '@/libs/supabase/client'
import { useAuthUser } from '@/store/useAuthStore'
import { useAddNotification } from '@/store/useNotificationStore'

export default function NotificationProvider({ children }: { children: React.ReactNode }) {
  const supabase = createClient()
  const user = useAuthUser()
  const addNotification = useAddNotification()

  useEffect(() => {
    // 로그인하지 않은 사용자는 구독하지 않음
    if (!user) return

    // Broadcast 채널 구독
    const channel = supabase.channel('notifications', {
      config: {
        broadcast: {
          self: true, // 자신이 보낸 메시지도 받음
        },
      },
    })

    // Broadcast 메시지 수신
    channel
      .on('broadcast', { event: 'match_created' }, (payload) => {
        const { message, createdBy, matchId } = payload.payload as {
          message: string
          createdBy?: string
          matchId?: number
        }

        addNotification({
          type: 'match',
          message: message || '새로운 경기 정보가 등록되었습니다.',
          createdBy,
          matchId,
        })
      })
      .on('broadcast', { event: 'schedule_created' }, (payload) => {
        const { message, date, createdBy, scheduleId } = payload.payload as {
          message: string
          date?: string
          createdBy?: string
          scheduleId?: string
        }

        addNotification({
          type: 'schedule',
          message: message || '새로운 일정이 등록되었습니다.',
          date,
          createdBy,
          scheduleId,
        })
      })
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.log('알림 채널 구독 완료')
        }
      })

    // 로그아웃 시 채널 구독 해제
    return () => {
      supabase.removeChannel(channel)
    }
  }, [supabase, user, addNotification])

  return <>{children}</>
}
