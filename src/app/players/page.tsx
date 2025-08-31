'use client'

import { playersWithStats } from '@/mocks/playersRoster'
import PlayerCard from '@/components/PlayerCard'
import { Position } from '@/constants/positionColor'

const POSITION_LABEL: Record<Position, string> = {
  GK: '골키퍼',
  DF: '수비수',
  MF: '미드필더',
  FW: '공격수',
}

export default function PlayersPage() {
  const positions: Position[] = ['FW', 'MF', 'DF', 'GK'] // 보여줄 순서 지정

  return (
    <main className="space-y-12 p-6">
      {positions.map((pos) => {
        const players = playersWithStats.filter((p) => p.position === pos)
        if (players.length === 0) return null

        return (
          <section key={pos}>
            <h2 className="mb-4 text-lg font-bold text-gray-800">{POSITION_LABEL[pos]}</h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
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
  )
}
