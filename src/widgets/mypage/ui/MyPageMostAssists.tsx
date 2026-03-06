import { BarChart3 } from 'lucide-react'
import type { UserData } from './types'

type StatsSectionProps = {
  user: UserData
}

export function MyPageMostAssists({ user }: StatsSectionProps) {
  const { stats } = user

  return (
    <div className="lg:col-span-7 space-y-6">
      <div className="bg-slate-900/50 backdrop-blur-xl border border-white/5 rounded-3xl p-6 sm:p-8 relative overflow-hidden">
        <div className="flex justify-between items-center mb-6 sm:mb-8 relative z-10">
          <h2 className="text-lg sm:text-xl font-black tracking-tight flex items-center gap-3">
            <BarChart3 className="text-cyan-500" /> 가장많은 도움
          </h2>
        </div>

        <div className="space-y-4 sm:space-y-6 relative z-10">
          {Object.entries(stats).map(([key, value]) => (
            <div key={key} className="space-y-2">
              <div className="flex justify-between text-[10px] font-bold uppercase tracking-[0.2em]">
                <span className="text-slate-400">{key}</span>
                <span className="text-cyan-400">{value}%</span>
              </div>
              <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden flex">
                <div
                  className="h-full bg-gradient-to-r from-blue-600 to-cyan-400 rounded-full"
                  style={{ width: `${value}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
