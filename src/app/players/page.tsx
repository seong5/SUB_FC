import { headers } from 'next/headers'
import { FirstPrize } from '@/features/player-stats'
import { PlayerRoster } from '@/widgets/player-roster'
import type { Player } from '@/entities/player'

export const dynamic = 'force-dynamic'
export const revalidate = 0

async function fetchPlayers(origin: string, cookie: string): Promise<Player[] | null> {
  try {
    const res = await fetch(`${origin}/api/players`, {
      cache: 'no-store',
      headers: { cookie },
    })
    if (!res.ok) return null
    return res.json()
  } catch {
    return null
  }
}

export default async function PlayersPage() {
  const h = await headers()
  const host = h.get('x-forwarded-host') ?? h.get('host') ?? 'localhost:3000'
  const proto = h.get('x-forwarded-proto') ?? 'http'
  const origin = `${proto}://${host}`
  const cookie = h.get('cookie') ?? ''

  const players = await fetchPlayers(origin, cookie)

  return (
    <div className="min-h-screen bg-[#020617]">
      <FirstPrize initialPlayers={players} />
      <PlayerRoster initialPlayers={players} />
    </div>
  )
}
