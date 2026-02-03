import Skeleton from '@/components/common/skeleton/Skeleton'

export default function FirstPrizeSkeleton() {
  return (
    <section className="bg-[#020617] py-20 px-6 relative overflow-hidden font-sans">
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <Skeleton className="h-8 w-48 mx-auto mb-6 rounded-full bg-white/5" />
          <Skeleton className="h-14 md:h-20 w-64 md:w-80 mx-auto mb-2" />
          <Skeleton className="h-8 w-56 mx-auto mb-6" />
          <Skeleton className="h-4 w-48 mx-auto" />
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="relative bg-slate-900/40 backdrop-blur-2xl border border-white/5 p-10 rounded-[32px] h-full flex flex-col justify-between"
            >
              <div className="flex justify-between items-start mb-8">
                <Skeleton className="h-12 w-12 rounded-2xl bg-white/10" />
                <Skeleton className="h-3 w-20 bg-white/10" />
              </div>
              <Skeleton className="h-3 w-12 mb-4 bg-white/10" />
              <Skeleton className="h-9 w-24 mb-1 bg-white/10" />
              <Skeleton className="h-9 w-32 mb-1 bg-white/10" />
              <div className="mt-10 pt-6 border-t border-white/5 flex items-baseline gap-1.5">
                <Skeleton className="h-10 w-16 bg-white/10" />
                <Skeleton className="h-3 w-12 bg-white/10" />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-20 flex flex-col md:flex-row items-center justify-between gap-8 px-8 opacity-40">
          <div className="flex items-center gap-6">
            <Skeleton className="h-8 w-32 bg-white/5" />
            <div className="h-8 w-px bg-slate-800 hidden md:block" />
            <Skeleton className="h-8 w-28 bg-white/5" />
          </div>
          <Skeleton className="h-3 w-48 bg-white/5" />
        </div>
      </div>
    </section>
  )
}
