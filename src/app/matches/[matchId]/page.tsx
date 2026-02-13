import { notFound } from 'next/navigation'
import { headers } from 'next/headers'
import { MatchDetailClient } from '@/widgets/match-detail'
import type { MatchDetailFull } from '@/entities/match'

export const dynamic = 'force-dynamic'
export const revalidate = 0

type PageProps = { params: Promise<{ matchId: string }> }

export default async function MatchesPage({ params }: PageProps) {
  const { matchId } = await params
  const id = Number(matchId)
  if (!Number.isFinite(id)) notFound()

  const h = await headers()
  const host = h.get('x-forwarded-host') ?? h.get('host') ?? 'localhost:3000'
  const proto = h.get('x-forwarded-proto') ?? 'http'
  const origin = `${proto}://${host}`

  const res = await fetch(`${origin}/api/matches/${id}`, {
    cache: 'no-store',
    headers: { cookie: h.get('cookie') ?? '' },
  })
  if (res.status === 404) return notFound()
  if (!res.ok) throw new Error('Failed to load match')
  const initialDetail = (await res.json()) as MatchDetailFull

  return <MatchDetailClient initialDetail={initialDetail} />
}
