import { Handshake } from 'lucide-react'
import type { UserData } from './types'
import { usePlayersQuery, useTopAssistToMeQuery } from '@/entities/player'
import { useAuthUser } from '@/shared/lib/store'

export function MyPageMostAssists({}: { user: UserData }) {
  const authUser = useAuthUser()
  const { data: players } = usePlayersQuery()

  const fullName = (authUser?.user_metadata?.full_name as string | undefined) ?? undefined
  const displayName = fullName ?? authUser?.email ?? undefined

  const me =
    players?.find((p) => p.name === displayName) ??
    (players && players.length === 1 ? players[0] : undefined)

  const myPlayerId = me?.id ?? -1

  const { data: assistants, isLoading, isError } = useTopAssistToMeQuery(myPlayerId, 2026)

  return (
    <div className="lg:col-span-7">
      <div className="h-full bg-slate-900/40 backdrop-blur-2xl border border-white/5 rounded-[2.5rem] p-8 relative overflow-hidden transition-all duration-300 hover:border-white/10">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xl font-bold flex items-center gap-3">
            <div className="p-2 bg-cyan-500/10 rounded-xl">
              <Handshake size={20} className="text-cyan-500" />
            </div>
            나에게 가장 많이 도움 준 선수
          </h2>
        </div>

        {isLoading && <p className="text-sm text-slate-400">도움 랭킹 불러오는 중...</p>}
        {isError && !isLoading && (
          <p className="text-sm text-rose-400">도움 랭킹 데이터를 불러오지 못했습니다.</p>
        )}

        {!isLoading && !isError && assistants && <AssistList assistants={assistants} />}
      </div>
    </div>
  )
}

type AssistToMe = {
  id: number
  name: string
  back_number: number
  position: 'GK' | 'DF' | 'MF' | 'FW'
  assists_to_me: number
  assists_to_me_percent: number
}

function AssistList({ assistants }: { assistants: AssistToMe[] }) {
  if (assistants.length === 0) {
    return <p className="text-sm text-slate-400">아직 도움 기록이 없습니다.</p>
  }

  return (
    <div className="space-y-4 relative z-10">
      {assistants.map((player) => (
        <div
          key={player.id}
          className="group/item relative flex items-center justify-between p-4 bg-slate-950/20 hover:bg-slate-950/60 border border-white/5 rounded-2xl transition-all duration-300 cursor-default"
        >
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-40 h-40 rounded-xl bg-slate-800 flex items-center justify-center font-black text-slate-400 group-hover/item:text-cyan-400 transition-colors">
                {player.back_number}
              </div>
            </div>
            <div>
              <h3 className="font-bold text-white group-hover/item:translate-x-1 transition-transform">
                {player.name}
              </h3>
              <p className="text-[11px] text-slate-500 font-medium">
                {player.position} · 나에게 준 도움 {player.assists_to_me}개
              </p>
            </div>
          </div>

          <div className="text-right">
            <div className="flex items-baseline justify-end gap-1">
              <span className="text-2xl font-black text-cyan-400">{player.assists_to_me}</span>
              <span className="text-[10px] font-bold text-slate-500 uppercase">Assists</span>
            </div>
            <div className="w-24 h-1 bg-slate-800 rounded-full mt-2 overflow-hidden">
              <div
                className="h-full bg-cyan-500 transition-all duration-700"
                style={{ width: `${player.assists_to_me_percent}%` }}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
