export default function WinRateSkeleton() {
  return (
    <section className="relative overflow-hidden bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-6 md:p-10 mb-16 min-h-[260px] md:min-h-[280px]">
      <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-14 relative z-10">
        <div className="flex-shrink-0">
          <div className="relative w-200 h-200 md:w-200 md:h-200">
            <div className="absolute inset-0 rounded-full bg-slate-800/50 animate-pulse" />
          </div>
        </div>

        <div className="flex-1 w-full space-y-8">
          <div className="flex flex-col justify-center items-center md:flex-row gap-6">
            <div className="h-16 w-48 bg-slate-800/50 rounded-lg animate-pulse" />
          </div>

          <div className="grid grid-cols-2 gap-4 md:gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="relative bg-white/5 border border-white/10 rounded-[32px] p-6 flex flex-col items-center text-center"
              >
                <div className="h-4 w-24 bg-slate-800/50 rounded mb-4 animate-pulse" />
                <div className="h-10 w-16 bg-slate-800/50 rounded animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
