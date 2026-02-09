'use client'

import { useQuery } from '@tanstack/react-query'
import { LayoutGrid } from 'lucide-react'
import { getPlayers } from '@/libs/playersApi'
import type { Player } from '@/libs/playersApi'
import PlayerCard from '@/components/players/PlayerCard'
import PlayerCardSkeleton from '@/components/players/PlayerCardSkeleton'
import { Position, POSITION_BORDER } from '@/constants/positionColor'
import FirstPrize from '@/components/players/FirstPrize'

const POSITION_LABEL: Record<Position, string> = {
  GK: 'GOALKEEPER',
  DF: 'DEFENDER',
  MF: 'MIDFIELDER',
  FW: 'FORWARD',
}

export default function PlayersPage() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['players'],
    queryFn: getPlayers,
    refetchOnMount: true,
    staleTime: 0,
  })

  const positions: Position[] = ['FW', 'MF', 'DF', 'GK']

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#020617]">
        <FirstPrize />
        <main className="rounded-b-[16px] space-y-12 py-10 px-20 md:px-40">
          <div className="flex items-center gap-10 px-10 py-10 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-md">
            <LayoutGrid size={22} className="text-blue-500" />
            <h1 className="text-sm md:text-base font-black uppercase tracking-[0.4em] text-white">
              SUB-FC ROSTER
            </h1>
          </div>
          {positions.map((pos) => (
            <section key={pos}>
              <h2
                className={`mb-4 pl-10 border-l-4 ${POSITION_BORDER[pos]} text-[30px] md:text-[60px] font-bold leading-none text-white`}
              >
                {POSITION_LABEL[pos]}
              </h2>
              <div className="grid grid-cols-3 md:grid-cols-5 gap-10 md:gap-20">
                {Array.from({ length: 5 }).map((_, i) => (
                  <PlayerCardSkeleton key={i} />
                ))}
              </div>
            </section>
          ))}
        </main>
      </div>
    )
  }

  if (isError)
    return (
      <div className="min-h-screen bg-[#020617]">
        <main className="p-20 text-red-400">데이터 불러오기 실패</main>
      </div>
    )

  return (
    <div className="min-h-screen bg-[#020617]">
      <FirstPrize />
      <main className="rounded-b-[16px] space-y-12 py-10 px-20 md:px-40">
        <div className="flex items-center gap-10 px-10 py-10 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-md">
          <LayoutGrid size={22} className="text-blue-500" />
          <h1 className="text-sm md:text-base font-black uppercase tracking-[0.4em] text-white">
            SUB-FC ROSTER
          </h1>
        </div>
        {positions.map((pos) => {
          const players = (data ?? []).filter((p: Player) => p.position === pos)
          if (players.length === 0) return null

          return (
            <section key={pos}>
              <h2
                className={`mb-8 pl-12 border-l-4 ${POSITION_BORDER[pos]} text-[30px] md:text-[60px] font-bold leading-none text-white`}
              >
                {POSITION_LABEL[pos]}
              </h2>

              <div className="grid grid-cols-3 md:grid-cols-5 gap-10 md:gap-20">
                {players.map((p) => (
                  <PlayerCard
                    key={p.id}
                    name={p.name}
                    number={p.back_number} //  DB 컬럼명 매핑
                    goals={p.goals}
                    assists={p.assists}
                    mom={p.mom}
                    attendancePercent={p.attendance_percent} // DB 컬럼명 매핑
                    position={p.position}
                  />
                ))}
              </div>
            </section>
          )
        })}
      </main>
    </div>
  )
}
