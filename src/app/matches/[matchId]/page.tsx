import { notFound } from 'next/navigation'
import { headers } from 'next/headers'
import Formation from '@/components/Formation'
import LoadKakaoMap from '@/components/LoadKakaoMap'

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

  const res = await fetch(`${origin}/api/matches/${id}`, { cache: 'no-store' })
  if (res.status === 404) return notFound()
  if (!res.ok) throw new Error('Failed to load match')
  const match = (await res.json()) as {
    place: string
    place_address: string | null
    place_lat: number | null
    place_lng: number | null
  }

  return (
    <div className="p-6 space-y-6">
      <Formation />
      <p className="my-5 text-[16px] font-bold text-gray-800">
        구장 주소 : <span>{match.place_address ?? match.place}</span>
      </p>
      <LoadKakaoMap
        address={match.place_address ?? match.place}
        lat={match.place_lat ?? undefined}
        lng={match.place_lng ?? undefined}
      />
    </div>
  )
}
