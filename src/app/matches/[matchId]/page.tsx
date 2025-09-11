import { notFound } from 'next/navigation'
import Formation from '@/components/Formation'
import LoadKakaoMap from '@/components/LoadKakaoMap'
import api from '@/libs/axios'
import axios from 'axios'

export const dynamic = 'force-dynamic'
export const revalidate = 0

type PageProps = { params: Promise<{ matchId: string }> }

export default async function MatchesPage({ params }: PageProps) {
  const { matchId } = await params
  const id = Number(matchId)
  if (!Number.isFinite(id)) notFound()

  try {
    const { data: match } = await api.get<{
      matchId: number
      date: string
      opponent: string
      place: string
      finalScore: string
    }>(`/matches/${id}`)

    return (
      <div className="p-6 space-y-6">
        <Formation />
        <LoadKakaoMap address={match.place} />
      </div>
    )
  } catch (err) {
    if (axios.isAxiosError(err) && err.response?.status === 404) {
      return notFound()
    }
    throw err
  }
}
