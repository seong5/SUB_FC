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
    <div className="lg:col-span-5 space-y-6">
      <div className="bg-slate-900/50 backdrop-blur-xl border border-white/5 rounded-3xl p-6 sm:p-8 h-full">
        <h2 className="text-lg sm:text-xl font-black tracking-tight flex items-center gap-3 mb-6">
          <BarChart3 className="text-cyan-500" /> 내가 참여한 경기의 승/무/패
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Stat label="참석" value={summary.attended} tone="neutral" />
          <Stat
            label="승"
            value={summary.win}
            percent={summary.winRate}
            tone="win"
          />
          <Stat
            label="무"
            value={summary.draw}
            percent={summary.drawRate}
            tone="draw"
          />
          <Stat
            label="패"
            value={summary.lose}
            percent={summary.loseRate}
            tone="lose"
          />
        </div>

        {summary.unknown > 0 && (
          <p className="mt-4 text-[11px] text-slate-500">
            스코어 형식이 불명확한 경기 {summary.unknown}건은 승/무/패 집계에서 제외됐어요.
          </p>
        )}
      </div>
    </div>
  )
}

type StatProps = {
  label: string
  value: number
  percent?: number
  tone: 'neutral' | 'win' | 'draw' | 'lose'
}

function Stat({ label, value, tone, percent }: StatProps) {
  const toneClass =
    tone === 'win'
      ? 'text-emerald-300 border-emerald-500/20 bg-emerald-500/5'
      : tone === 'draw'
        ? 'text-amber-300 border-amber-500/20 bg-amber-500/5'
        : tone === 'lose'
          ? 'text-rose-300 border-rose-500/20 bg-rose-500/5'
          : 'text-slate-200 border-white/10 bg-slate-950/30'

  return (
    <div className={`rounded-2xl border p-4 ${toneClass}`}>
      <div className="text-[10px] font-bold uppercase tracking-widest opacity-80">{label}</div>
      <div className="mt-1 text-2xl font-black tracking-tight">{value}</div>
      {tone !== 'neutral' && (
        <div className="mt-0.5 text-[11px] text-slate-300">
          {(percent ?? 0).toString()}%
        </div>
      )}
    </div>
  )
}
