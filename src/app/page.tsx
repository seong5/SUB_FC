import { headers } from 'next/headers'
import { WinRate } from '@/features/team-stats'
import { HomeClient } from '@/widgets/home'
import { mapToUIMatchSummary } from '@/entities/match'
import type { TeamStats } from '@/entities/team'
import type { MatchListItem, UIMatchSummary } from '@/entities/match'

export const dynamic = 'force-dynamic'
export const revalidate = 0

async function fetchTeamStatsByYear(
  origin: string,
  cookie: string,
  year: number
): Promise<TeamStats | null> {
  try {
    const res = await fetch(`${origin}/api/teams/stats?year=${year}`, {
      cache: 'no-store',
      headers: { cookie },
    })
    if (!res.ok) return null
    return res.json()
  } catch {
    return null
  }
}

async function fetchMatches(origin: string, cookie: string): Promise<UIMatchSummary[]> {
  try {
    const res = await fetch(`${origin}/api/matches`, {
      cache: 'no-store',
      headers: { cookie },
    })
    if (!res.ok) return []
    const data = (await res.json()) as MatchListItem[]
    return (data ?? []).map(mapToUIMatchSummary)
  } catch {
    return []
  }
}

export default async function HomePage() {
  const h = await headers()
  const host = h.get('x-forwarded-host') ?? h.get('host') ?? 'localhost:3000'
  const proto = h.get('x-forwarded-proto') ?? 'http'
  const origin = `${proto}://${host}`
  const cookie = h.get('cookie') ?? ''

  const [teamStats, matches] = await Promise.all([
    fetchTeamStatsByYear(origin, cookie, 2026),
    fetchMatches(origin, cookie),
  ])

  return (
    <div className="min-h-screen bg-[#020617]">
      <main className="rounded-b-[16px] p-20 space-y-16 md:px-40">
        <HomeClient initialMatches={matches}>
          <WinRate initialStats={teamStats} />
        </HomeClient>
      </main>
    </div>
  )
}
