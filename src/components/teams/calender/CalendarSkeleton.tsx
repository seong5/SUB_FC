import Skeleton from '@/components/common/skeleton/Skeleton'
import CalendarHeader from './CalenderHeader'
import { getMonthName, formatDateKorean } from '@/utils/calenderUtils'

type CalendarSkeletonProps = {
  viewDate: Date
  onPrev: () => void
  onNext: () => void
}

export default function CalendarSkeleton({ viewDate, onPrev, onNext }: CalendarSkeletonProps) {
  const weekdays = ['일', '월', '화', '수', '목', '금', '토']
  
  return (
    <section className="p-20 my-20 w-full border border-gray-100 rounded-[20px] bg-white card-shadow">
      <CalendarHeader
        title={getMonthName(viewDate)}
        subtitle={formatDateKorean(viewDate)}
        onPrev={onPrev}
        onNext={onNext}
      />
      
      {/* 요일 헤더 */}
      <div className="grid grid-cols-7 py-2 text-center text-xs md:text-sm text-gray-500">
        {weekdays.map((w, i) => (
          <div
            key={w}
            className={`py-1 ${i === 0 ? 'text-red-500' : i === 6 ? 'text-blue-600' : ''}`}
          >
            {w}
          </div>
        ))}
      </div>
      
      {/* 달력 그리드 */}
      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: 35 }).map((_, idx) => (
          <Skeleton
            key={idx}
            className="aspect-square rounded-xl"
            variant="rectangular"
          />
        ))}
      </div>
    </section>
  )
}

