import { Settings, User } from 'lucide-react'
import type { UserData } from './types'

type HeaderProps = {
  user: UserData
}

export function MyPageHeader({ user }: HeaderProps) {
  return (
    <section className="flex flex-col md:flex-row gap-8 items-center justify-between border-b border-white/10 pb-10">
      <div className="flex gap-6 items-center">
        <div className="relative">
          <div className="w-100 h-100 rounded-3xl bg-slate-900 border-2 border-slate-800 flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/20 to-transparent" />
            <User className="w-50 h-50 text-cyan-400" />
            <div className="absolute inset-0 border-[3px] border-cyan-500/20 border-t-cyan-500 rounded-3xl" />
          </div>
        </div>

        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black tracking-tighter text-white">
              {user.name}
            </h1>
          </div>
          <p className="text-slate-500 font-mono text-xs sm:text-sm tracking-widest uppercase">
            Back Number:{user.id}
          </p>
          <p className="text-slate-500 font-mono text-xs sm:text-sm tracking-widest uppercase">
            Position:{user.position}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-6">
        <button className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-[11px] sm:text-xs font-bold flex items-center gap-2">
          <Settings className="w-10 h-10" /> 내 정보 수정
        </button>
      </div>
    </section>
  )
}
