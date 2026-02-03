import Skeleton from '@/components/common/skeleton/Skeleton'

export default function WinRateSkeleton() {
  return (
    <section className="bg-white rounded-[16px] p-20 text-[25px] md:text-[50px] font-bold text-center">
      <Skeleton className="h-[30px] md:h-[60px] w-[200px] md:w-[300px] mx-auto mb-20" />
      <Skeleton className="h-[25px] md:h-[50px] w-[120px] md:w-[200px] mx-auto mb-10" />
      <Skeleton className="h-[30px] md:h-[60px] w-[100px] md:w-[150px] mx-auto mb-20" />
      <div className="flex flex-row gap-10 text-[18px] md:text-[25px] font-bold justify-center items-center">
        <div className="flex flex-col items-center gap-5">
          <Skeleton className="h-[20px] md:h-[30px] w-[60px] md:w-[80px]" />
          <Skeleton className="h-[25px] md:h-[35px] w-[40px] md:w-[60px]" />
        </div>
        <div className="flex flex-col items-center gap-5">
          <Skeleton className="h-[20px] md:h-[30px] w-[60px] md:w-[80px]" />
          <Skeleton className="h-[25px] md:h-[35px] w-[40px] md:w-[60px]" />
        </div>
        <div className="flex flex-col items-center gap-5">
          <Skeleton className="h-[20px] md:h-[30px] w-[60px] md:w-[80px]" />
          <Skeleton className="h-[25px] md:h-[35px] w-[40px] md:w-[60px]" />
        </div>
      </div>
      <Skeleton className="h-[30px] md:h-[60px] w-[150px] md:w-[250px] mx-auto mt-20" />
    </section>
  )
}
