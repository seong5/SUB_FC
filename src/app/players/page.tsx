'use client'

import { PlayerRoster } from '@/widgets/player-roster'
import { FirstPrize } from '@/features/player-stats'

export default function PlayersPage() {
  return (
    <div className="min-h-screen bg-[#020617]">
      <FirstPrize />
      <PlayerRoster />
    </div>
  )
}
