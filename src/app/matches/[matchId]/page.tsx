import { notFound } from 'next/navigation'
import { headers } from 'next/headers'
import { MapPin } from 'lucide-react'
import Formation from '@/components/matches/Formation'
import LoadKakaoMap from '@/components/matches/LoadKakaoMap'

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
    <div className="min-h-screen bg-[#020617]">
      <main className="rounded-b-[16px] px-20 py-10 space-y-6 md:px-40">
        <Formation />
        <div className="my-5 flex items-center gap-3 text-[16px] font-bold text-white">
          <div className="flex items-center justify-center w-30 h-30 text-emerald-400">
            <MapPin size={22} />
          </div>
          <span className="text-white truncate">{match.place_address ?? match.place}</span>
        </div>
        <LoadKakaoMap
          address={match.place_address ?? match.place}
          lat={match.place_lat ?? undefined}
          lng={match.place_lng ?? undefined}
        />
      </main>
    </div>
  )
}
