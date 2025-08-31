import { playersWithStats } from '@/mocks/playersRoster'
import PlayerCard from '@/components/PlayerCard'

export default function PlayersPage() {
  return (
    <main className="grid grid-cols-2 justify-center items-center md:grid-cols-4 gap-10 p-20">
      {playersWithStats.map((player) => (
        <PlayerCard
          key={player.id}
          name={player.name}
          number={player.backNumber}
          goals={player.goals}
          assists={player.assists}
          attendancePercent={player.attendancePercent}
          position={player.position}
        />
      ))}
    </main>
  )
}
