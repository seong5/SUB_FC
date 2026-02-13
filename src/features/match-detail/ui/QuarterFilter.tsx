'use client'

import { useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import type { QuarterLabel } from '@/shared/types'
import { Modal } from '@/shared'
import { patchMatch, patchRoster, patchQuarters, patchScores, useDeleteMatchMutation } from '@/entities/match'
import type { PostMatchData, RosterData, QuarterData } from '@/entities/match'
import { useIsLoggedIn } from '@/shared/lib/store'
import { useClickOutside } from '@/shared/hooks'
import { EllipsisVertical, LayoutGrid, AlertCircle } from 'lucide-react'

interface TypeFilterProps {
  selectedType: QuarterLabel | ''
  onChange: (type: QuarterLabel | '') => void
  matchId: number
  initialMatch: PostMatchData
  initialRoster?: RosterData
  initialQuarters?: QuarterData[]
  initialScores?: QuarterData[]
  players?: { id: string; name: string; position: 'GK' | 'DF' | 'MF' | 'FW' }[]
  onRefetch?: () => void
}

type FlowStep = 'match' | 'roster' | 'quarters' | 'scores'
type FlowState = { mode: 'edit'; step: FlowStep } | null

const TYPES = ['1 쿼터', '2 쿼터', '3 쿼터', '4 쿼터'] as const

export default function QuarterFilter({
  selectedType,
  onChange,
  matchId,
  initialMatch,
  initialRoster,
  initialQuarters,
  initialScores,
  players = [],
  onRefetch,
}: TypeFilterProps) {
  const [openDelete, setOpenDelete] = useState(false)
  const [showMenu, setShowMenu] = useState(false)
  const [flow, setFlow] = useState<FlowState>(null)
  const menuRef = useRef<HTMLDivElement | null>(null)
  const isLoggedIn = useIsLoggedIn()
  const router = useRouter()
  const deleteMatchMutation = useDeleteMatchMutation()

  useClickOutside(menuRef, () => {
    if (showMenu) setShowMenu(false)
  })

  // 삭제
  const handleDelete = async () => {
    try {
      await deleteMatchMutation.mutateAsync(matchId)
      setOpenDelete(false)
      alert('삭제가 완료되었습니다.')
      // 삭제 성공 후 홈으로 이동하고 강제 새로고침
      router.push('/')
      router.refresh() // Next.js 서버 컴포넌트 캐시도 새로고침
    } catch (err) {
      console.error(err)
      alert('삭제에 실패했습니다.')
    }
  }

  // ---- Step1: 경기 기본 정보 ----
  const handleStep1 = async (payload: PostMatchData) => {
    await patchMatch(matchId, payload)
    setFlow({ mode: 'edit', step: 'roster' })
  }

  // ---- Step2: 명단/포메이션 ----
  const handleStep2 = async (payload: RosterData) => {
    await patchRoster(matchId, payload)
    setFlow({ mode: 'edit', step: 'quarters' })
  }

  // ---- Step3: 쿼터별 스코어 ----
  const handleStep3 = async (payload: QuarterData[]) => {
    await patchQuarters(matchId, payload)
    setFlow({ mode: 'edit', step: 'scores' })
  }

  // ---- Step4: 득점/도움 ----
  const handleStep4 = async (payload: QuarterData[]) => {
    await patchScores(matchId, payload)
    setFlow(null)
    onRefetch?.()
    alert('수정이 완료되었습니다.')
  }

  return (
    <section className="space-y-8">
      {/* 상단: 헤더 및 관리자 액션 */}
      <div className="flex justify-between items-end mb-10 px-2 mb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2"></div>
          <h2 className="text-2xl md:text-4xl font-black text-white italic tracking-tighter uppercase">
            Quarters
          </h2>
        </div>

        {isLoggedIn && (
          <div className="relative" ref={menuRef}>
            <button
              type="button"
              onClick={() => setShowMenu((prev) => !prev)}
              className={`p-3.5 rounded-2xl border transition-all duration-300 active:scale-90 ${
                showMenu
                  ? 'bg-emerald-500 border-emerald-400 text-slate-950 shadow-[0_0_20px_rgba(16,185,129,0.4)]'
                  : 'bg-white/5 border-white/10 text-slate-400 hover:text-white hover:bg-white/10'
              }`}
              aria-label="더보기 메뉴"
            >
              <EllipsisVertical size={20} />
            </button>

            {/* 드롭다운 메뉴 (수정/삭제) */}
            {showMenu && (
              <div className="absolute right-0 mt-4 w-80 bg-slate-900/95 backdrop-blur-2xl border border-white/10 rounded-[14px] shadow-[0_20px_50px_rgba(0,0,0,0.6)] overflow-hidden z-[100]">
                <div className="p-2">
                  <button
                    type="button"
                    onClick={() => {
                      setFlow({ mode: 'edit', step: 'match' })
                      setShowMenu(false)
                    }}
                    className="w-full flex items-center justify-center p-6 text-[12px] font-black text-slate-300 hover:bg-emerald-500 hover:text-slate-950 rounded-2xl transition-all"
                  >
                    <span className="uppercase tracking-widest text-left">수정하기</span>
                  </button>
                  <div className="h-px bg-white/5 my-1 mx-2" />
                  <button
                    type="button"
                    onClick={() => {
                      setOpenDelete(true)
                      setShowMenu(false)
                    }}
                    className="w-full flex items-center justify-center p-6 text-[12px] font-black text-rose-500 hover:bg-rose-500 hover:text-white rounded-2xl transition-all"
                  >
                    <span className="uppercase tracking-widest text-left">삭제하기</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 쿼터 선택 인터랙티브 버튼 그리드 */}
      <div className="grid grid-cols-2 md:grid-cols-4 mb-15 gap-4">
        {TYPES.map((type) => {
          const isActive = selectedType === type
          return (
            <button
              key={type}
              type="button"
              onClick={() => onChange(isActive ? '' : type)}
              className={`group relative overflow-hidden rounded-[2.5rem] p-6 border-2 transition-all duration-500 active:scale-95 ${
                isActive
                  ? 'bg-emerald-500 border-emerald-400 shadow-[0_20px_40px_-10px_rgba(16,185,129,0.4)] -translate-y-1'
                  : 'bg-white/[0.03] border-white/5 hover:border-white/20 hover:bg-white/[0.06]'
              }`}
            >
              {/* 배경 숫자 장식 */}
              <span
                className={`absolute -right-2 -bottom-4 text-7xl font-black italic opacity-[0.03] pointer-events-none transition-all duration-500 ${
                  isActive ? 'opacity-[0.1] scale-110' : 'group-hover:opacity-[0.06]'
                }`}
              >
                {type.charAt(0)}
              </span>

              <div className="relative z-10 flex flex-row items-center gap-10">
                <div
                  className={`p-3 rounded-2xl transition-all duration-300 ${
                    isActive
                      ? 'bg-slate-950/20 text-slate-950 scale-110'
                      : 'bg-white/5 text-slate-500 group-hover:text-emerald-500'
                  }`}
                >
                  <LayoutGrid size={20} />
                </div>
                <div className="space-y-1 text-left">
                  <p
                    className={`text-[9px] font-black uppercase tracking-[0.2em] ${
                      isActive ? 'text-slate-950/60' : 'text-slate-600'
                    }`}
                  >
                    Section
                  </p>
                  <span
                    className={`text-sm font-black italic tracking-tighter uppercase whitespace-nowrap ${
                      isActive ? 'text-slate-950' : 'text-slate-400 group-hover:text-white'
                    }`}
                  >
                    {type}
                  </span>
                </div>
              </div>

            </button>
          )
        })}
      </div>

      {/* 삭제 확인 모달 (커스텀 디자인) */}
      {openDelete && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
          <div
            className="absolute inset-0 bg-slate-950/90 backdrop-blur-md"
            onClick={() => setOpenDelete(false)}
          />
          <div className="relative w-full max-w-sm bg-[#020617] border border-white/10 rounded-[3rem] p-10 shadow-[0_40px_100px_rgba(0,0,0,1)]">
            <div className="flex flex-col items-center text-center">
              <div className="w-24 h-24 bg-rose-500/10 rounded-[2.5rem] flex items-center justify-center text-rose-500 mb-8 border border-rose-500/20 shadow-[0_0_30px_rgba(244,63,94,0.1)]">
                <AlertCircle size={48} className="animate-pulse" />
              </div>
              <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter mb-4">
                Dangerous Action
              </h3>
              <p className="text-slate-500 text-xs font-bold leading-relaxed mb-10 uppercase tracking-widest">
                경기 데이터를 영구적으로 <br />
                <span className="text-rose-500 underline underline-offset-4">
                  삭제하시겠습니까?
                </span>
              </p>

              <div className="flex flex-col gap-3 w-full">
                <button
                  type="button"
                  disabled={deleteMatchMutation.isPending}
                  onClick={handleDelete}
                  className="w-full py-5 rounded-2xl bg-rose-500 hover:bg-rose-400 text-white font-black text-[11px] uppercase tracking-[0.2em] shadow-xl shadow-rose-500/20 transition-all active:scale-95 disabled:opacity-50"
                >
                  {deleteMatchMutation.isPending ? 'Processing...' : 'Confirm Destruction'}
                </button>
                <button
                  type="button"
                  onClick={() => setOpenDelete(false)}
                  className="w-full py-5 rounded-2xl bg-white/5 hover:bg-white/10 text-slate-500 font-black text-[11px] uppercase tracking-[0.2em] border border-white/5 transition-all"
                >
                  Aborted
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 수정 플로우 모달들 */}
      {flow?.step === 'match' && (
        <Modal
          variant="postMatch"
          mode="edit"
          initial={initialMatch}
          onClose={() => setFlow(null)}
          onSubmit={handleStep1}
        />
      )}

      {flow?.step === 'roster' && (
        <Modal
          variant="postRoster"
          mode="edit"
          initial={initialRoster}
          players={players}
          onBack={() => setFlow({ mode: 'edit', step: 'match' })}
          onClose={() => setFlow(null)}
          onSubmit={handleStep2}
        />
      )}

      {flow?.step === 'quarters' && (
        <Modal
          variant="postQuarters"
          mode="edit"
          initial={initialQuarters}
          onBack={() => setFlow({ mode: 'edit', step: 'roster' })}
          onClose={() => setFlow(null)}
          onSubmit={handleStep3}
          eligiblePlayers={players}
        />
      )}

      {flow?.step === 'scores' && (
        <Modal
          variant="postScores"
          mode="edit"
          initial={initialScores}
          onBack={() => setFlow({ mode: 'edit', step: 'quarters' })}
          onClose={() => setFlow(null)}
          onSubmit={handleStep4}
          eligiblePlayers={players}
        />
      )}
    </section>
  )
}
