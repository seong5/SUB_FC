import { matchLocations } from '@/mocks/matchLocation'

type MatchInfoCardProps = {
  matchId: number
}

export default function MatchInfoCard({ matchId }: MatchInfoCardProps) {
  const match = matchLocations.find((m) => m.id === matchId)
  if (!match) return <div className="text-gray-300">경기 정보를 찾을 수 없습니다.</div>

  return (
    <section className="max-w-800 card-shadow bg-white rounded-[12px] px-20 py-10 m-20">
      <div>이미지</div>
      <h1>{match.date}</h1>
      <h1>{match.address} </h1>
      <h1>상대팀 FC도전자</h1>
      <h1> 전체스코어 5 : 3</h1>
    </section>
  )
}
