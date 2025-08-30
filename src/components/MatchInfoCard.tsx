import { matchLocations } from '@/mocks/matchLocation'
import { formatKoreanDate } from '@/utils/dateUtils'
import { sampleMatch } from '@/mocks/QuarterScores'
import { getResultFromFinalScore } from '@/utils/scoreCalculator'

type MatchInfoCardProps = {
  matchId: number
}

export default function MatchInfoCard({ matchId }: MatchInfoCardProps) {
  const match = matchLocations.find((m) => m.id === matchId)
  if (!match) return <div className="text-gray-300">경기 정보를 찾을 수 없습니다.</div>
  const result = getResultFromFinalScore(sampleMatch.finalScore)

  return (
    <section className="flex flex-row gap-20 max-w-1000 card-shadow bg-white rounded-[16px] px-20 py-20 m-20">
      <div className="bg-primary-100 w-100 md:w-200 rounded-[20px]">
        <div>이미지</div>
      </div>
      <div className="txt-14_B md:txt-24_B text-gray-950">
        <h1>{formatKoreanDate(match.date)}</h1>
        <h1>{match.name} </h1>
        <h1>{sampleMatch.finalScore}</h1>
        <h1>{sampleMatch.opponent}</h1>
        <h1>{result}</h1>
      </div>
    </section>
  )
}
