import Skeleton from '@/components/common/skeleton/Skeleton'

export default function WinRateSkeleton() {
  return (
    <section className="relative overflow-hidden bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-6 md:p-10 mb-16 min-h-[260px] md:min-h-[280px]">
      <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-14 relative z-10">
        <div className="flex-shrink-0">
          <div className="relative w-200 h-200 md:w-200 md:h-200 flex items-center justify-center">
            <Skeleton className="w-[180px] h-[180px] rounded-full" />
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-6 w-20" />
            </div>
          </div>
        </div>

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

          {/* 네 개의 통계 카드 그리드 */}
          <div className="grid grid-cols-2 gap-4 md:gap-6">
            {/* 전체 경기 수 카드 */}
            <div className="relative rounded-[32px] p-6 bg-white/5 border border-white/10 flex flex-col items-center text-center gap-4">
              <Skeleton className="h-[15px] w-[55.52px] rounded-md" />
              <Skeleton className="h-[40px] w-[57.9px] rounded-md" />
            </div>

            {/* 승리 카드 */}
            <div className="relative rounded-[32px] p-6 bg-blue-600/5 border border-blue-600/10 flex flex-col items-center text-center gap-4">
              <Skeleton className="h-[15px] w-[55.52px] rounded-md" />
              <Skeleton className="h-[40px] w-[57.9px] rounded-md" />
            </div>

            {/* 무승부 카드 */}
            <div className="relative rounded-[32px] p-6 bg-emerald-600/5 border border-emerald-600/10 flex flex-col items-center text-center gap-4">
              <Skeleton className="h-[15px] w-[55.52px] rounded-md" />
              <Skeleton className="h-[40px] w-[57.9px] rounded-md" />
            </div>

            {/* 패배 카드 */}
            <div className="relative rounded-[32px] p-6 bg-red-600/5 border border-red-600/10 flex flex-col items-center text-center gap-4">
              <Skeleton className="h-[15px] w-[55.52px] rounded-md" />
              <Skeleton className="h-[40px] w-[57.9px] rounded-md" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
