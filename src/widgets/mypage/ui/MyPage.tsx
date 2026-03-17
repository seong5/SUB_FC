'use client'

import type { UserData } from './types'
import { MyPageHeader } from './MyPageHeader'
import { MyPageMostAssists } from './MyPageMostAssists'
import { MyPageMostGoalsFromMyAssist } from './MyPageMostGoalsFromMyAssist'
import { MyPageAttendWinDrawLose } from './MyPageAttendWinDrawLose'
import { MyPageGoalsAssists } from './MyPageGoalsAssists'
import { useAttendMatchesForPlayer } from '@/entities/match'
import { usePlayersQuery, usePlayersByYearQuery } from '@/entities/player'
import { useAuthUser } from '@/shared/lib/store'

const MYPAGE_YEAR = 2026

export function MyPage() {
  const authUser = useAuthUser()
  const { data: players } = usePlayersQuery()
  const { data: players2026 } = usePlayersByYearQuery(MYPAGE_YEAR)

  const fullName = (authUser?.user_metadata?.full_name as string | undefined) ?? undefined
  const displayName = fullName ?? authUser?.email ?? '게스트'

  const me =
    players?.find((p) => p.name === displayName) ??
    (players?.length === 1 ? players[0] : undefined)

  const me2026 =
    players2026?.find((p) => p.name === displayName) ??
    (players2026?.length === 1 ? players2026[0] : undefined)

  const myPlayerId = me ? String(me.id) : 'UNKNOWN'

  const userData: UserData = {
    name: me?.name ?? displayName,
    id: me?.back_number != null ? String(me.back_number) : 'UNKNOWN',
    rank: 'ELITE',
    position: me?.position ?? 'UNKNOWN',
  }

  const { data: matchesForAttendWdl = [] } = useAttendMatchesForPlayer({
    year: MYPAGE_YEAR,
    playerId: myPlayerId,
  })

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 selection:bg-cyan-500/30 overflow-x-hidden relative">
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_70%,transparent_100%)] opacity-20" />
        <div className="absolute top-[20%] left-[10%] w-[30%] h-[30%] bg-blue-600/10 blur-[100px] rounded-full" />
        <div className="absolute bottom-[20%] right-[10%] w-[30%] h-[30%] bg-cyan-500/10 blur-[100px] rounded-full" />
      </div>

      <main className="relative z-10 w-full max-w-5xl mx-auto p-20">
        <MyPageHeader user={userData} />
        <section className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
          <MyPageAttendWinDrawLose
            myPlayerId={myPlayerId}
            matches={matchesForAttendWdl}
          />
          <MyPageGoalsAssists
            goals={me2026?.goals ?? 0}
            assists={me2026?.assists ?? 0}
          />
          <MyPageMostAssists user={userData} />
          <MyPageMostGoalsFromMyAssist user={userData} />
        </section>
      </main>
    </div>
  )
}
