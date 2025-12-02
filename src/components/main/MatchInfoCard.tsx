import { formatKoreanDate } from '@/utils/dateUtils'
import { getResultFromFinalScore } from '@/utils/scoreCalculator'
import Image from 'next/image'
import Link from 'next/link'

export type MatchCardData = {
  id: number
  date: string
  opponent: string
  place: string
  score: string
}
type MatchInfoCardProps = {
  match: MatchCardData
}

export default function MatchInfoCard({ match }: MatchInfoCardProps) {
  const result = getResultFromFinalScore(match.score)

  // 승/무/패에 따른 색상 클래스
  const resultColorClass =
    result === '승'
      ? 'text-blue-500'
      : result === '무'
        ? 'text-green-500'
        : result === '패'
          ? 'text-red-500'
          : 'text-gray-950'

  return (
    <Link href={`/matches/${match.id}`}>
      <section className="flex flex-row gap-10 items-center md:gap-100 w-full card-shadow bg-white rounded-[16px] px-15 md:px-20 py-15 md:py-20 my-20">
        <div className="bg-white w-100 md:w-200 h-100 md:h-200 rounded-[20px]">
          <Image src="/subfc.png" alt="SUBFC" width={200} height={100} priority />
        </div>
        <div className="txt-16_B md:txt-24_B text-gray-950">
          <h1>{formatKoreanDate(match.date)}</h1>
          <h1>{match.opponent}</h1>
          <h1>{match.score}</h1>
          <h1>{match.place}</h1>
          <h1 className={resultColorClass}>{result || '-'}</h1>
        </div>
      </section>
    </Link>
  )
}
