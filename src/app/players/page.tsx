'use client'

import { playersWithStats } from '@/mocks/playersRoster'
import PlayerCard from '@/components/PlayerCard'
import { Position } from '@/constants/positionColor'
import FirstPrize from '@/components/PositionFilter'

const POSITION_LABEL: Record<Position, string> = {
  GK: 'GK',
  DF: 'DF',
  MF: 'MF',
  FW: 'FW',
}

export default function PlayersPage() {
  const positions: Position[] = ['FW', 'MF', 'DF', 'GK'] // 보여줄 순서 지정

  return (
    <>
      <FirstPrize />
      <main className="space-y-12 my-40 px-20 md:px-40">
        {positions.map((pos) => {
          const players = playersWithStats.filter((p) => p.position === pos)
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
                    number={p.backNumber}
                    goals={p.goals}
                    assists={p.assists}
                    attendancePercent={p.attendancePercent}
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
