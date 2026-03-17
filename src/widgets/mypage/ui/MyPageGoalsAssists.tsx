import { Target } from 'lucide-react'

type MyPageGoalsAssistsProps = {
  goals?: number
  assists?: number
}

export function MyPageGoalsAssists({ goals = 0, assists = 0 }: MyPageGoalsAssistsProps) {
  return (
    <div className="lg:col-span-5 group">
      <div className="h-full bg-slate-900/40 backdrop-blur-2xl border border-white/5 rounded-[2.5rem] p-8 relative overflow-hidden transition-all duration-300 hover:border-white/10">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xl font-bold flex items-center gap-3">
            <div className="p-2 bg-cyan-500/10 rounded-xl">
              <Target size={20} className="text-cyan-500" />
            </div>
            득점 / 도움 현황
          </h2>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <StatBox label="득점" value={goals} color="cyan" />
          <StatBox label="도움" value={assists} color="violet" />
        </div>
      </div>
    </div>
  )
}

type StatBoxProps = {
  label: string
  value: number
  color: 'cyan' | 'violet'
}

function StatBox({ label, value, color }: StatBoxProps) {
  const colorMap: Record<StatBoxProps['color'], string> = {
    cyan: 'text-cyan-300 bg-cyan-500/10 border-cyan-500/30',
    violet: 'text-violet-300 bg-violet-500/10 border-violet-500/30',
  }

  return (
    <div
      className={`flex flex-col items-center justify-center px-6 py-4 rounded-3xl border text-center ${colorMap[color]}`}
    >
      <div className="space-y-1">
        <span className="text-[10px] font-bold uppercase tracking-widest opacity-80 block">
          {label}
        </span>
        <span className="text-2xl font-black">{value}</span>
      </div>
    </div>
  )
}
