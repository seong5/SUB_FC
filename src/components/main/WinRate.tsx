'use client'

import { useTeamStatsQuery } from '@/hooks/useTeams'
import WinRateSkeleton from './WinRateSkeleton'

export default function WinRate() {
  const { data: statsData, isPending, error } = useTeamStatsQuery()

  if (isPending) {
    return <WinRateSkeleton />
  }

  if (error) {
    return (
      <section className="relative overflow-hidden bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-6 md:p-10 mb-16 min-h-[260px] md:min-h-[280px]">
        <p className="text-center text-red-400 text-sm">
          데이터를 불러오는 중 오류가 발생했습니다.
        </p>
      </section>
    )
  }

  const stats = {
    totalMatches: statsData?.totalMatches ?? 0,
    wins: statsData?.wins ?? 0,
    draws: statsData?.draws ?? 0,
    losses: statsData?.losses ?? 0,
    winRate: statsData?.winRate ?? 0,
  }

  // 0~100 사이로 보정된 승률 (프로그레스 링에서 사용)
  const clampedWinRate = Math.max(0, Math.min(100, stats.winRate))

  return (
    <section className="relative overflow-hidden bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-6 md:p-10 mb-16 min-h-[260px] md:min-h-[280px]">
      <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-14 relative z-10">
        <div className="flex-shrink-0">
          <div className="relative w-200 h-200 md:w-200 md:h-200">
            <svg className="absolute inset-0 w-full h-full -rotate-90 drop-shadow-[0_0_12px_rgba(59,130,246,0.4)]">
              <circle
                cx="50%"
                cy="50%"
                r="45%"
                fill="none"
                stroke="rgba(148,163,184,0.25)"
                strokeWidth="10"
                pathLength={100}
                strokeDasharray="100"
              />
              <circle
                cx="50%"
                cy="50%"
                r="45%"
                fill="none"
                stroke="url(#winRateGradient)"
                strokeWidth="10"
                pathLength={100}
                strokeDasharray="100"
                strokeDashoffset={100 - clampedWinRate}
                strokeLinecap="round"
                className="transition-all duration-700 ease-out"
              />
              <defs>
                <linearGradient id="winRateGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#3b82f6" />
                  <stop offset="100%" stopColor="#10b981" />
                </linearGradient>
              </defs>
            </svg>

            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <p className="text-sm md:text-xs font-bold text-white uppercase tracking-widest mb-0.5">
                  Win Rate
                </p>
                <p className="text-3xl md:text-4xl font-black text-white tracking-tight leading-none">
                  {clampedWinRate}
                  <span className="text-lg md:text-xl font-bold text-slate-400 ml-0.5">%</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid Section */}
        <div className="flex-1 w-full space-y-8">
          <div className="flex flex-col justify-center items-center md:flex-row gap-6">
            <div>
              <div className="flex items-center justify-center gap-3 mb-3">
                <div className="h-px w-8 bg-blue-500/50" />
                <span className="text-[12px] font-black text-blue-400 uppercase tracking-[0.3em]">
                  시즌 성적
                </span>
              </div>
              <h2 className="text-3xl md:text-5xl font-black text-white tracking-tighter uppercase leading-none">
                Season{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400 font-black">
                  2026
                </span>{' '}
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 md:gap-6">
            <div className="relative bg-white/5 border border-white/10 rounded-[32px] p-6 flex flex-col items-center text-center">
              <p className="text-[10px] font-black text-white uppercase tracking-widest mb-4">
                전체 경기 수
              </p>
              <div className="flex items-baseline justify-center gap-2">
                <span className="text-4xl font-black text-white">{stats.totalMatches}</span>
                <span className="text-[10px] font-bold text-white uppercase">경기</span>
              </div>
            </div>

            <div className="relative bg-blue-600/5 border border-blue-600/10 rounded-[32px] p-6 flex flex-col items-center text-center border-b-blue-500/50">
              <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-4">
                승리
              </p>
              <div className="flex items-baseline justify-center gap-2">
                <span className="text-4xl font-black text-blue-400">{stats.wins}</span>
                <span className="text-xs font-bold text-blue-400 uppercase">승</span>
              </div>
            </div>

            <div className="relative bg-emerald-600/5 border border-emerald-600/10 rounded-[32px] p-6 flex flex-col items-center text-center border-b-emerald-500/50">
              <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-4">
                무승부
              </p>
              <div className="flex items-baseline justify-center gap-2">
                <span className="text-4xl font-black text-emerald-400">{stats.draws}</span>
                <span className="text-xs font-bold text-emerald-400 uppercase">무</span>
              </div>
            </div>

            <div className="relative bg-red-600/5 border border-red-600/10 rounded-[32px] p-6 flex flex-col items-center text-center border-b-red-500/50">
              {' '}
              <p className="text-[10px] font-black text-red-400 uppercase tracking-widest mb-4">
                패배
              </p>
              <div className="flex items-baseline justify-center gap-2">
                <span className="text-4xl font-black text-red-400">{stats.losses}</span>
                <span className="text-xs font-bold text-red-400 uppercase">패</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
