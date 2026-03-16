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
    <div className="lg:col-span-7 space-y-6">
      <div className="bg-slate-900/50 backdrop-blur-xl border border-white/5 rounded-3xl p-6 sm:p-8 relative overflow-hidden">
        <div className="flex justify-between items-center mb-6 sm:mb-8 relative z-10">
          <h2 className="text-lg sm:text-xl font-black tracking-tight flex items-center gap-3">
            <Handshake className="text-cyan-500" /> 가장 많은 도움을 준 선수
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
    <div className="space-y-4 sm:space-y-5 relative z-10">
      {assistants.map((p) => (
        <div
          key={p.id}
          className="flex items-center justify-between gap-4 bg-slate-950/40 border border-slate-800 rounded-2xl px-4 py-3"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-cyan-500/10 border border-cyan-500/40 flex items-center justify-center text-[11px] font-black text-cyan-300">
              {p.back_number}
            </div>
            <div>
              <p className="text-sm font-bold text-white">{p.name}</p>
              <p className="text-[11px] text-slate-500 uppercase tracking-widest">
                {p.position} · 나에게 준 도움 {p.assists_to_me}개
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xl font-black text-cyan-400">{p.assists_to_me}</p>
            <p className="text-[11px] text-slate-400">내 골 중 {p.assists_to_me_percent}%</p>
          </div>
        </div>
      ))}
    </div>
  )
}
