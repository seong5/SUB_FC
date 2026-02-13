'use client'

import { LayoutGrid } from 'lucide-react'
import { usePlayersQuery, type Player } from '@/entities/player'
import { PlayerCard, PlayerCardSkeleton } from '@/entities/player'
import { Position, POSITION_BORDER } from '@/shared/config/positionColor'

const POSITION_LABEL: Record<Position, string> = {
  GK: 'GOALKEEPER',
  DF: 'DEFENDER',
  MF: 'MIDFIELDER',
  FW: 'FORWARD',
}

const positions: Position[] = ['FW', 'MF', 'DF', 'GK']

type PlayerRosterProps = {
  /** 서버에서 미리 가져온 선수 목록 (서버 컴포넌트에서 전달 시 LCP 개선) */
  initialPlayers?: Player[] | null
}

export default function PlayerRoster({ initialPlayers }: PlayerRosterProps) {
  const { data, isLoading, isError } = usePlayersQuery()

  const players = initialPlayers ?? data

  if (players == null && isLoading) {
    return (
      <main className="rounded-b-[16px] space-y-12 py-10 px-20 md:px-40">
        <div className="flex items-center gap-10 px-10 py-10 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-md">
          <LayoutGrid size={22} className="text-blue-500" aria-hidden />
          <h2 className="text-sm md:text-base font-black uppercase tracking-[0.4em] text-white">
            SUB-FC ROSTER
          </h2>
        </div>
        {positions.map((pos) => (
          <section key={pos}>
            <h3
              className={`mb-4 pl-10 border-l-4 ${POSITION_BORDER[pos]} text-[30px] md:text-[60px] font-bold leading-none text-white`}
            >
              {POSITION_LABEL[pos]}
            </h3>
            <div className="grid grid-cols-3 md:grid-cols-5 gap-10 md:gap-20">
              {Array.from({ length: 5 }).map((_, i) => (
                <PlayerCardSkeleton key={i} />
              ))}
            </div>
          </section>
        ))}
      </main>
    )
  }

  if (players == null && isError) {
    return <main className="p-20 text-red-400">데이터 불러오기 실패</main>
  }

  const list = players ?? []

  return (
    <main className="rounded-b-[16px] space-y-12 py-10 px-20 md:px-40">
      <div className="flex items-center gap-10 px-10 py-10 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-md">
        <LayoutGrid size={22} className="text-blue-500" aria-hidden />
        <h2 className="text-sm md:text-base font-black uppercase tracking-[0.4em] text-white">
          SUB-FC ROSTER
        </h2>
      </div>
      {positions.map((pos) => {
        const byPosition = list.filter((p: Player) => p.position === pos)
        if (byPosition.length === 0) return null

        return (
          <section key={pos}>
            <h3
              className={`mb-8 pl-12 border-l-4 ${POSITION_BORDER[pos]} text-[30px] md:text-[60px] font-bold leading-none text-white`}
            >
              {POSITION_LABEL[pos]}
            </h3>

            <div className="grid grid-cols-3 md:grid-cols-5 gap-10 md:gap-20">
              {byPosition.map((p) => (
                <PlayerCard
                  key={p.id}
                  name={p.name}
                  number={p.back_number}
                  goals={p.goals}
                  assists={p.assists}
                  mom={p.mom}
                  attendancePercent={p.attendance_percent}
                  position={p.position}
                />
              ))}
            </div>
          </section>
        )
      })}
    </main>
  )
}
