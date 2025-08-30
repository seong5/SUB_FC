import { matchLocations } from '@/mocks/matchLocation'
import { formatKoreanDate } from '@/utils/dateUtils'
import { sampleMatch } from '@/mocks/QuarterScores'
import { getResultFromFinalScore } from '@/utils/scoreCalculator'
import Image from 'next/image'

type MatchInfoCardProps = {
  matchId: number
}

export default function MatchInfoCard({ matchId }: MatchInfoCardProps) {
  const match = matchLocations.find((m) => m.id === matchId)
  if (!match) return <div className="text-gray-300">경기 정보를 찾을 수 없습니다.</div>
  const result = getResultFromFinalScore(sampleMatch.finalScore)

  return (
    <section className="flex flex-row gap-30 md:gap-100 max-w-1000 card-shadow bg-white rounded-[16px] px-15 md:px-20 py-15 md:py-20 m-20">
      <div className="bg-white w-100 md:w-200 h-100 md:h-200 rounded-[20px]">
        <Image src={'/subfc.png'} alt="SUBFC" width={200} height={100} />
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
