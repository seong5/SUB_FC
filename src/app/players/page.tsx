'use client'

import { useQuery } from '@tanstack/react-query'
import { getPlayers } from '@/libs/playersApi'
import type { Player } from '@/libs/playersApi'
import PlayerCard from '@/components/PlayerCard'
import { Position } from '@/constants/positionColor'
import FirstPrize from '@/components/FirstPrize'

const POSITION_LABEL: Record<Position, string> = {
  GK: 'GK',
  DF: 'DF',
  MF: 'MF',
  FW: 'FW',
}

export default function PlayersPage() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['players'],
    queryFn: getPlayers,
  })

  const positions: Position[] = ['FW', 'MF', 'DF', 'GK'] // 보여줄 순서 지정

  if (isLoading) return <main className="p-20">불러오는 중…</main>
  if (isError) return <main className="p-20 text-red-500">데이터 불러오기 실패</main>

  return (
    <>
      <FirstPrize />
      <main className="bg-sub-gray rounded-[16px] space-y-12 my-40 py-10 px-20 md:px-40">
        {positions.map((pos) => {
          const players = (data ?? []).filter((p: Player) => p.position === pos)
          if (players.length === 0) return null

          return (
            <section key={pos}>
              <h2 className="mb-4 text-[30px] md:text-[60px] font-bold text-gray-800">
                {POSITION_LABEL[pos]}
              </h2>

              <div className="grid grid-cols-3 md:grid-cols-5 gap-10 md:gap-20">
                {players.map((p) => (
                  <PlayerCard
                    key={p.id}
                    name={p.name}
                    number={p.back_number} // ← DB 컬럼명 매핑
                    goals={p.goals}
                    assists={p.assists}
                    attendancePercent={p.attendance_percent} // ← DB 컬럼명 매핑
                    position={p.position}
                  />
                ))}
              </div>
            </section>
          )
        })}
      </main>
    </>
  )
}
