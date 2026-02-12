import { Skeleton } from '@/shared'
import CalendarHeader from './CalenderHeader'
import { getMonthName, formatDateKorean } from '@/shared/utils/calenderUtils'

type CalendarSkeletonProps = {
  viewDate: Date
  onPrev: () => void
  onNext: () => void
}

export default function CalendarSkeleton({ viewDate, onPrev, onNext }: CalendarSkeletonProps) {
  const weekdays = ['일', '월', '화', '수', '목', '금', '토']

  return (
    <section
      className="relative overflow-hidden rounded-[40px] border border-white/5 bg-slate-900/40 p-10 shadow-2xl backdrop-blur-3xl md:p-12 lg:p-16"
      aria-label="달력"
    >
      {/* Calendar.tsx와 동일한 배경 글로우 */}
      <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-blue-600/10 blur-[100px]" />

      <div className="relative z-10 w-full min-w-0">
        <CalendarHeader
          title={getMonthName(viewDate)}
          subtitle={formatDateKorean(viewDate)}
          onPrev={onPrev}
          onNext={onNext}
        />

        {/* 요일 헤더 (CalenderGrid와 동일 스타일) */}
        <div className="grid grid-cols-7 py-4 text-center text-sm text-slate-400 md:py-5 md:text-base">
          {weekdays.map((w, i) => (
            <div
              key={w}
              className={`py-1 ${i === 0 ? 'text-red-500' : i === 6 ? 'text-blue-500' : ''}`}
            >
              {w}
            </div>
          ))}
        </div>

        {/* 달력 그리드: 4주(4x7)만 보여주는 스켈레톤 */}
        <div
          className="grid w-full min-w-0 gap-2 md:gap-3"
          style={{ gridTemplateColumns: 'repeat(7, minmax(0, 1fr))' }}
        >
          {Array.from({ length: 28 }).map((_, idx) => (
            <div
              key={idx}
              className="flex min-h-[110px] min-w-0 flex-col items-stretch justify-start overflow-hidden rounded-xl border border-white/5 bg-slate-900/60 px-2 py-2.5 md:min-h-[140px] md:px-2.5 md:py-3"
            >
              {/* 날짜 숫자 자리 */}
              <Skeleton className="h-20 w-20 rounded-full mx-auto bg-slate-700/60" variant="bar" />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
