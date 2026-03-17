import { Award, HandHelping } from 'lucide-react'
import type { UserData } from './types'
import { usePlayersQuery, useTopAssistedByMeQuery } from '@/entities/player'
import { useAuthUser } from '@/shared/lib/store'

export function MyPageMostGoalsFromMyAssist({}: { user: UserData }) {
  const authUser = useAuthUser()
  const { data: players } = usePlayersQuery()

  const fullName = (authUser?.user_metadata?.full_name as string | undefined) ?? undefined
  const displayName = fullName ?? authUser?.email ?? undefined

  const me =
    players?.find((p) => p.name === displayName) ??
    (players && players.length === 1 ? players[0] : undefined)

  const myPlayerId = me?.id ?? -1

  const { data: scorers, isLoading, isError } = useTopAssistedByMeQuery(myPlayerId, 2026)

  return (
    <div className="lg:col-span-7">
      <div className="h-full bg-slate-900/40 backdrop-blur-2xl border border-white/5 rounded-[2.5rem] p-8 relative overflow-hidden transition-all duration-300 hover:border-white/10">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xl font-bold flex items-center gap-3">
            <div className="p-2 bg-emerald-500/10 rounded-xl">
              <HandHelping size={20} className="text-emerald-400" />
            </div>
            내가 가장 많이 도와준 선수
          </h2>
        </div>

        {isLoading && <p className="text-sm text-slate-400">데이터 불러오는 중...</p>}
        {isError && !isLoading && (
          <p className="text-sm text-rose-400">데이터를 불러오지 못했습니다.</p>
        )}

        {!isLoading && !isError && scorers && <GoalsFromMyAssistList scorers={scorers} />}
      </div>
    </div>
  )
}

type GoalsFromMyAssist = {
  id: number
  name: string
  back_number: number
  position: 'GK' | 'DF' | 'MF' | 'FW'
  goals_from_my_assist: number
  goals_from_my_assist_percent: number
}

function GoalsFromMyAssistList({ scorers }: { scorers: GoalsFromMyAssist[] }) {
  if (scorers.length === 0) {
    return <p className="text-sm text-slate-400">아직 내가 만든 골 기록이 없습니다.</p>
  }

  return (
    <div className="space-y-4 relative z-10">
      {scorers.map((player, idx) => (
        <div
          key={player.id}
          className="group/item relative flex items-center justify-between p-4 bg-slate-950/20 hover:bg-slate-950/60 border border-white/5 rounded-2xl transition-all duration-300 cursor-default"
        >
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center font-black text-slate-400 group-hover/item:text-emerald-400 transition-colors">
                {player.back_number}
              </div>
              {idx === 0 && (
                <div className="absolute -top-2 -right-2 w-5 h-5 bg-amber-500 rounded-full flex items-center justify-center border-2 border-[#020617]">
                  <Award size={10} className="text-white" />
                </div>
              )}
            </div>
            <div>
              <h3 className="font-bold text-white group-hover/item:translate-x-1 transition-transform">
                {player.name}
              </h3>
              <p className="text-[11px] text-slate-500 font-medium">
                {player.position} · 내 도움으로 넣은 골 {player.goals_from_my_assist}개
              </p>
            </div>
          </div>

          <div className="text-right">
            <div className="flex items-baseline justify-end gap-1">
              <span className="text-2xl font-black text-emerald-400">
                {player.goals_from_my_assist}
              </span>
              <span className="text-[10px] font-bold text-slate-500 uppercase">Goals</span>
            </div>
            <div className="w-24 h-1 bg-slate-800 rounded-full mt-2 overflow-hidden">
              <div
                className="h-full bg-emerald-500 transition-all duration-700"
                style={{ width: `${player.goals_from_my_assist_percent}%` }}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
