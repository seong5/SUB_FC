import Skeleton from '@/components/common/skeleton/Skeleton'

export default function MatchInfoCardSkeleton() {
  return (
    <section className="flex flex-row gap-10 items-center md:gap-100 w-full card-shadow bg-white rounded-[16px] px-15 md:px-20 py-15 md:py-20 my-20">
      {/* 이미지 영역 */}
      <Skeleton className="w-100 md:w-200 h-100 md:h-200 rounded-[20px]" />
      
      {/* 텍스트 영역 */}
      <div className="flex flex-col gap-8 md:gap-12">
        {/* 날짜 */}
        <Skeleton className="h-16 md:h-24 w-150 md:w-200" />
        {/* 상대팀 */}
        <Skeleton className="h-16 md:h-24 w-120 md:w-180" />
        {/* 점수 */}
        <Skeleton className="h-16 md:h-24 w-100 md:w-150" />
        {/* 장소 */}
        <Skeleton className="h-16 md:h-24 w-140 md:w-200" />
        {/* 결과 */}
        <Skeleton className="h-16 md:h-24 w-80 md:w-120" />
      </div>
    </section>
  )
}

