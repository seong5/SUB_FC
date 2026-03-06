import { Clock } from 'lucide-react'
import type { ActivityLog } from './types'

type ActivitySectionProps = {
  logs: ActivityLog[]
}

export function MyPageAttendWinDrawLose({ logs }: ActivitySectionProps) {
  return (
    <div className="lg:col-span-5 space-y-6">
      <div className="bg-slate-900/50 backdrop-blur-xl border border-white/5 rounded-3xl p-6 sm:p-8 h-full">
        <h2 className="text-lg sm:text-xl font-black tracking-tight flex items-center gap-3 mb-6">
          <Clock className="text-cyan-500" /> 참석했을 경우 승/무/패
        </h2>

        <div className="space-y-4">
          {logs.map((log) => (
            <div key={`${log.date}-${log.desc}`} className="relative pl-6 pb-6 last:pb-0">
              <div className="absolute left-[7px] top-6 bottom-0 w-[1px] bg-slate-800" />
              <div className="absolute left-0 top-1.5 w-[15px] h-[15px] rounded-full bg-slate-950 border-2 border-slate-800 z-10 shadow-[0_0_10px_rgba(0,0,0,1)]" />

              <div className="bg-slate-950/40 border border-slate-800 rounded-2xl p-4">
                <div className="flex justify-between items-start mb-1 gap-3">
                  <span className="text-[10px] font-bold text-slate-600 font-mono tracking-tighter">
                    {log.date}
                  </span>
                  <span className="text-[9px] font-black text-cyan-500 uppercase px-1.5 py-0.5 bg-cyan-500/10 rounded border border-cyan-500/20">
                    {log.status}
                  </span>
                </div>
                <p className="text-xs font-bold text-slate-300">{log.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
