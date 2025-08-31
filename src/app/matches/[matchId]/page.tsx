import { notFound } from 'next/navigation'
import Formation from '@/components/Formation'
import LoadKakaoMap from '@/components/LoadKakaoMap'
import { matchLocations } from '@/mocks/matchLocation'

type PageProps = { params: Promise<{ matchId: string }> }

export default async function MatchesPage({ params }: PageProps) {
  const { matchId } = await params
  const id = Number(matchId)

  const match = matchLocations.find((m) => m.id === id)
  if (!match) return notFound()

  return (
    <div className="p-6 space-y-6">
      <Formation />
      <LoadKakaoMap address={match.address} />
    </div>
  )
}
