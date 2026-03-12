'use client'

import type { UserData } from './types'
import { MyPageHeader } from './MyPageHeader'
import { MyPageMostAssists } from './MyPageMostAssists'
import { MyPageAttendWinDrawLose } from './MyPageAttendWinDrawLose'
import { useAttendMatchesForPlayer } from '@/entities/match'
import { usePlayersQuery } from '@/entities/player'
import { useAuthUser } from '@/shared/lib/store'

export function MyPage() {
  const authUser = useAuthUser()
  const { data: players } = usePlayersQuery()

  const fullName = (authUser?.user_metadata?.full_name as string | undefined) ?? undefined
  const displayName = fullName ?? authUser?.email ?? '게스트'

  const me =
    players?.find((p) => p.name === displayName) ??
    (players?.length === 1 ? players[0] : undefined)

  const myPlayerId = me ? String(me.id) : 'UNKNOWN'

  const userData: UserData = {
    name: me?.name ?? displayName,
    id: me?.back_number != null ? String(me.back_number) : 'UNKNOWN',
    rank: 'ELITE',
    position: me?.position ?? 'UNKNOWN',
    stats: {
      pace: 92,
      shooting: 88,
      passing: 75,
      defense: 42,
      physical: 80,
    },
  }

  const { data: matchesForAttendWdl = [] } = useAttendMatchesForPlayer({
    year: 2026,
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
          <MyPageAttendWinDrawLose myPlayerId={myPlayerId} matches={matchesForAttendWdl} />
          <MyPageMostAssists user={userData} />
        </section>
      </main>
    </div>
  )
}
