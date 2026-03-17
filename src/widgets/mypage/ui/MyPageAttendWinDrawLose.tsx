import { BarChart3 } from 'lucide-react'
import type { MatchForAttendWdl } from '@/entities/match'
import { calcAttendWdlForPlayer } from '@/entities/match'

type MyPageAttendWinDrawLoseProps = {
  myPlayerId: string
  matches: MatchForAttendWdl[]
}

export function MyPageAttendWinDrawLose({ myPlayerId, matches }: MyPageAttendWinDrawLoseProps) {
  const summary = calcAttendWdlForPlayer(myPlayerId, matches)

  return (
    <div className="lg:col-span-5 group">
      <div className="h-full bg-slate-900/40 backdrop-blur-2xl border border-white/5 rounded-[2.5rem] p-8 relative overflow-hidden transition-all duration-300 hover:border-white/10">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xl font-bold flex items-center gap-3">
            <div className="p-2 bg-cyan-500/10 rounded-xl">
              <BarChart3 size={20} className="text-cyan-500" />
            </div>
            참석 시 전적 리포트
          </h2>
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">
            Total {summary.attended} Games
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <StatBox label="Total" value={summary.attended} percent={100} color="slate" />
          <StatBox label="Win" value={summary.win} percent={summary.winRate} color="emerald" />
          <StatBox label="Draw" value={summary.draw} percent={summary.drawRate} color="amber" />
          <StatBox label="Lose" value={summary.lose} percent={summary.loseRate} color="rose" />
        </div>
      </div>
    </div>
  )
}

type StatBoxProps = {
  label: string
  value: number
  percent: number
  color: 'emerald' | 'amber' | 'rose' | 'slate'
}

function StatBox({ label, value, percent, color }: StatBoxProps) {
  const colorMap: Record<StatBoxProps['color'], string> = {
    emerald: 'text-emerald-300 bg-emerald-500/10 border-emerald-500/30',
    amber: 'text-amber-300 bg-amber-500/10 border-amber-500/30',
    rose: 'text-rose-300 bg-rose-500/10 border-rose-500/30',
    slate: 'text-slate-200 bg-slate-800/40 border-white/10',
  }

  return (
    <div
      className={`flex flex-col items-center justify-center px-6 py-4 rounded-3xl border text-center ${colorMap[color]}`}
    >
      <div className="space-y-1">
        <span className="text-[10px] font-bold uppercase tracking-widest opacity-80 block">
          {label}
        </span>
        <div className="flex items-baseline justify-center gap-1">
          <span className="text-2xl font-black">{value}</span>
          <span className="text-[11px] font-semibold text-slate-300">({percent}%)</span>
        </div>
      </div>
    </div>
  )
}
