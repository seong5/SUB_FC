import Skeleton from '@/components/common/skeleton/Skeleton'

export default function FirstPrizeSkeleton() {
  return (
    <section className="bg-sub-gray rounded-t-[16px] py-10">
      <div className="bg-white m-20 rounded-[16px]">
        <div className="text-center pt-10 mb-15">
          <Skeleton className="h-[30px] md:h-[60px] w-[120px] md:w-[200px] mx-auto mb-2" />
          <Skeleton className="h-[30px] md:h-[60px] w-[100px] md:w-[180px] mx-auto" />
        </div>
        <article className="text-center flex flex-row p-15 justify-center items-center gap-50">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex flex-col gap-5">
              <Skeleton className="h-60 w-60 md:h-80 md:w-80 rounded-full mx-auto" />
              <Skeleton className="h-[16px] md:h-[24px] w-[48px] md:w-[64px] mx-auto" />
              <Skeleton className="h-[20px] md:h-[32px] w-[60px] md:w-[100px] mx-auto mt-10" />
              <Skeleton className="h-[14px] md:h-[18px] w-[40px] md:w-[60px] mx-auto" />
            </div>
          ))}
        </article>
      </div>
    </section>
  )
}
