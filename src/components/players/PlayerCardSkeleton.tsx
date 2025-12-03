import Skeleton from '@/components/common/skeleton/Skeleton'

export default function PlayerCardSkeleton() {
  return (
    <section className="aspect-square w-full card-shadow">
      <Skeleton className="h-110 md:h-160 rounded-t-[24px]" />
      <div className="-mt-30 p-10 md:p-15 h-110 md:h-160 rounded-[24px] bg-white shadow-md">
        <Skeleton className="h-[14px] md:h-[22px] w-[60px] md:w-[80px] mx-auto mb-4" />
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between px-2">
            <Skeleton className="h-[12px] md:h-[16px] w-[32px] md:w-[40px]" />
            <Skeleton className="h-[12px] md:h-[16px] w-[16px] md:w-[24px]" />
          </div>
          <div className="flex items-center justify-between px-2">
            <Skeleton className="h-[12px] md:h-[16px] w-[32px] md:w-[40px]" />
            <Skeleton className="h-[12px] md:h-[16px] w-[16px] md:w-[24px]" />
          </div>
          <div className="flex items-center justify-between px-2">
            <Skeleton className="h-[12px] md:h-[16px] w-[40px] md:w-[48px]" />
            <Skeleton className="h-[12px] md:h-[16px] w-[24px] md:w-[32px]" />
          </div>
        </div>
      </div>
    </section>
  )
}
