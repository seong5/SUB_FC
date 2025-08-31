import Formation from '@/components/Formation'
import KakaoMap from '@/components/KakaoMap'
import { matchLocations } from '@/mocks/matchLocation'

export default async function MatchesPage({ params }: { params: Promise<{ matchId: string }> }) {
  const { matchId } = await params
  const match = matchLocations.find((m) => m.id === Number(matchId))

  if (!match) {
    return <main className="p-6">경기 정보를 찾을 수 없습니다.</main>
  }

  return (
    <div className="p-6 space-y-6">
      <Formation />
      <KakaoMap address={match.address} className="w-full h-[320px] rounded-xl" disableDrag />
    </div>
  )
}
