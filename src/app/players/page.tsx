import PlayerCard from '@/components/PlayerCard'

export default function PlayersPage() {
  return (
    <main className="flex justify-center">
      <PlayerCard name="신성오" number={9} goals={10} assists={3} attendancePercent={50} />
    </main>
  )
}
