import Link from 'next/link'
import { formatKoreanDate } from '@/utils/dateUtils'
import { getResultFromFinalScore } from '@/utils/scoreCalculator'
import { Calendar, MapPin } from 'lucide-react'

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
  const isWin = result === '승'
  const isLoss = result === '패'

  const themeClass = isWin
    ? 'border-blue-400 bg-blue-400/50 shadow-blue-500/10'
    : isLoss
      ? 'border-red-400 bg-red-900 shadow-red-500/10'
      : 'border-emerald-400 bg-emerald-900 shadow-emerald-500/10'

  return (
    <Link href={`/matches/${match.id}`} className="block group">
      <div
        className={`relative overflow-hidden rounded-[32px] border backdrop-blur-xl transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl cursor-pointer ${themeClass}`}
      >
        <div
          className={`absolute -right-20 -top-20 h-40 w-40 blur-[80px] opacity-20 transition-opacity group-hover:opacity-40 ${isWin ? 'bg-blue-500' : isLoss ? 'bg-red-500' : 'bg-emerald-500'}`}
        />

        <div className="relative z-10 p-6 md:p-8">
          <div className="mb-4 p-10 flex flex-col gap-4 text-white">
            <div className="flex items-center gap-2">
              <Calendar size={14} />
              <span className="text-sm font-bold uppercase tracking-tight">
                {formatKoreanDate(match.date)}
              </span>
            </div>
            <div className="h-1 w-1 rounded-full bg-slate-700" />
            <div className="flex items-center gap-2">
              <MapPin size={14} />
              <span className="text-xs font-bold uppercase tracking-tight">{match.place}</span>
            </div>
          </div>

          <div className="flex flex-col items-center gap-8 md:flex-row">
            {/* Match Details Section */}
            <div className="w-full flex-1 space-y-4 text-center md:text-left">
              <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
                <div className="space-y-1">
                  <h3 className="text-2xl font-black italic uppercase leading-none tracking-tighter text-white md:text-4xl">
                    VS {match.opponent}
                  </h3>
                </div>

                <div className="flex flex-col items-center justify-center md:items-end">
                  <p className="mb-1 text-[10px] font-black uppercase tracking-[0.3em] text-gray-500">
                    최종 스코어
                  </p>
                  <div className="flex items-center gap-3">
                    <span className="text-4xl font-black leading-none tracking-tighter text-white md:text-5xl">
                      {match.score.split(':')[0]}
                    </span>
                    <span className="text-xl font-black text-white">:</span>
                    <span className="text-4xl font-black leading-none tracking-tighter text-white md:text-5xl">
                      {match.score.split(':')[1]}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}
