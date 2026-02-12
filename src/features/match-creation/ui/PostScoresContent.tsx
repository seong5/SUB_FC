'use client'

import { useEffect, useState } from 'react'
import {
  ChevronRight,
  ChevronLeft,
  Trophy,
  Plus,
  Trash2,
  Zap,
  Star,
  UserCheck,
} from 'lucide-react'
import { Button } from '@/shared'
import type { PostScoresContentProps } from '@/shared/config/modal'
import type { QuarterData, QuarterGoal } from '@/entities/match'

export default function PostScoresContent({
  onBack,
  onClose,
  onSubmit,
  initial = [],
  mode = 'create',
  eligiblePlayers,
}: PostScoresContentProps & { mode?: 'create' | 'edit' }) {
  const [quarters, setQuarters] = useState<QuarterData[]>(initial)

  // 모달 오픈 시 본문 스크롤 방지
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [])

  const update = (qi: number, patch: Partial<QuarterData>) => {
    setQuarters((prev) => prev.map((q, i) => (i === qi ? { ...q, ...patch } : q)))
  }

  const addGoal = (qi: number) => {
    const goals: QuarterGoal[] = [...quarters[qi].goals, { scorerId: '', assistId: null }]
    update(qi, { goals })
  }

  const updateGoal = (qi: number, gi: number, patch: Partial<QuarterGoal>) => {
    const goals = quarters[qi].goals.map((g, i) => (i === gi ? { ...g, ...patch } : g))
    update(qi, { goals })
  }

  const removeGoal = (qi: number, gi: number) => {
    const goals = quarters[qi].goals.filter((_, i) => i !== gi)
    update(qi, { goals })
  }

  const handleSubmit = () => {
    onSubmit(quarters)
  }

  return (
    <div className="flex items-center justify-center w-full max-w-[560px] mx-auto bg-black/20 rounded-[2.5rem]">
      <div className="relative w-full h-auto min-h-0 md:min-h-[85vh] bg-[#0f172a] rounded-[2.5rem] shadow-[0_-20px_50px_rgba(0,0,0,0.5)] md:shadow-[0_30px_60px_-12px_rgba(0,0,0,0.5)] border-t md:border border-white/10 overflow-hidden flex flex-col">
        {/* 모바일 상단 핸들 */}
        <div className="flex pt-3 sm:pt-4 md:hidden shrink-0">
          <div className="w-12 h-1 bg-white/20 rounded-full" />
        </div>

        {/* Pitch Pattern Background Overlay */}
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[200%] h-[400px] border border-white/20 rounded-[100%] scale-110" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1px] h-full bg-white/20" />
        </div>

        <div className="relative z-10 flex flex-col flex-1 min-h-0 overflow-y-auto overflow-x-hidden p-10">
          {/* Header */}
          <div className="px-0 sm:pr-14 flex items-center justify-between mb-6 md:mb-8">
            <Button
              type="button"
              variant="ghost"
              onClick={onBack}
              className="p-2 hover:bg-white/5 rounded-full text-slate-400 transition-colors min-w-0"
            >
              <ChevronLeft size={24} />
            </Button>
            <div className="flex-1 text-center">
              <p className="text-amber-500 text-[12px] font-black uppercase tracking-[0.3em] mb-1">
                Match Analytics
              </p>
              <h2 className="text-xl font-black text-white italic tracking-tight uppercase">
                Goal & Assist
              </h2>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8 custom-scrollbar">
            {quarters.map((q, qi) => (
              <div
                key={q.quarter}
                className="group bg-white/[0.03] border border-white/5 rounded-[2.5rem] p-7 md:p-8 space-y-5 transition-all hover:bg-white/[0.04]"
              >
                {/* Quarter Context Header */}
                <div className="flex items-center justify-between px-15">
                  <div className="flex items-center gap-10">
                    <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-500/20 to-transparent border border-amber-500/20 flex items-center justify-center text-amber-500 shadow-inner">
                      <Trophy size={20} className="animate-pulse" />
                    </div>
                    <h4 className="text-sm font-black text-white italic">{qi + 1} QUARTER</h4>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-bold text-slate-500 uppercase">
                        Score After: {q.scoreAfter}
                      </span>
                    </div>
                  </div>

                  {/* Add Goal Button */}
                  <Button
                    type="button"
                    variant="primary"
                    onClick={() => addGoal(qi)}
                    className="flex items-center gap-2 px-4 py-2.5 !bg-emerald-500 hover:!bg-emerald-400 text-slate-950 rounded-full text-[11px] font-black transition-all active:scale-95 shadow-lg shadow-emerald-500/20"
                  >
                    <Plus size={14} strokeWidth={3} />
                    추가
                  </Button>
                </div>

                <div className="grid grid-cols-2 gap-3 md:gap-4">
                  {q.goals.length === 0 ? (
                    <div className="py-10 text-center border-2 border-dashed border-white/5 rounded-[2rem] bg-black/10">
                      <UserCheck size={24} className="mx-auto text-slate-700 mb-2 opacity-50" />
                      <p className="text-[11px] font-bold text-slate-600 uppercase tracking-widest leading-relaxed">
                        득점 기록이 없습니다.
                        <br />
                        추가 버튼을 클릭하세요.
                      </p>
                    </div>
                  ) : (
                    q.goals.map((g, gi) => (
                      <div
                        key={gi}
                        className="flex flex-col md:flex-row gap-4 md:gap-7 items-center bg-slate-900/60 border border-white/5 p-4 rounded-3xl hover:border-emerald-500/20 transition-all"
                      >
                        <div className="w-full flex-1 relative">
                          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-amber-500">
                            <Star
                              size={14}
                              fill="currentColor"
                              className="drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]"
                            />
                          </div>
                          <select
                            className="w-full bg-white/5 border border-white/5 rounded-2xl py-3.5 pl-16 pr-4 text-xs font-bold text-white focus:border-amber-500/40 focus:ring-4 focus:ring-amber-500/5 outline-none appearance-none cursor-pointer transition-all"
                            value={g.scorerId}
                            onChange={(e) => updateGoal(qi, gi, { scorerId: e.target.value })}
                          >
                            <option value="">득점자 선택</option>
                            {eligiblePlayers.map((p) => (
                              <option key={p.id} value={p.id}>
                                {p.name}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Assistant Field */}
                        <div className="w-full flex-1 relative">
                          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-500">
                            <Zap
                              size={14}
                              fill="currentColor"
                              className="drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]"
                            />
                          </div>
                          <select
                            className="w-full bg-white/5 border border-white/5 rounded-2xl py-3.5 pl-16 pr-4 text-xs font-bold text-white focus:border-emerald-500/40 focus:ring-4 focus:ring-emerald-500/5 outline-none appearance-none cursor-pointer transition-all"
                            value={g.assistId ?? ''}
                            onChange={(e) =>
                              updateGoal(qi, gi, { assistId: e.target.value || null })
                            }
                          >
                            <option value="">도움 선택 (없음)</option>
                            {eligiblePlayers.map((p) => (
                              <option key={p.id} value={p.id}>
                                {p.name}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Remove Button */}
                        <Button
                          type="button"
                          variant="ghost"
                          onClick={() => removeGoal(qi, gi)}
                          className="p-3 text-slate-600 hover:text-rose-500 hover:bg-rose-500/10 rounded-2xl transition-all active:scale-90 min-w-0"
                        >
                          <Trash2 size={20} />
                        </Button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="relative z-20 p-8 mb-15 bg-[#0f172a] border-t border-white/5 shadow-[0_-20px_50px_rgba(0,0,0,0.6)]">
          <div className="flex flex-row justify-between gap-3">
            <Button
              type="button"
              size="sm"
              variant="secondary"
              onClick={onBack}
              className="flex-1 !bg-white/5 hover:!bg-white/10 !text-slate-400 !border-white/5 rounded-2xl text-xs tracking-widest uppercase active:scale-95"
            >
              이전
            </Button>
            <Button
              type="button"
              size="sm"
              variant="secondary"
              onClick={onClose}
              className="flex-1 !bg-white/5 hover:!bg-white/10 !text-slate-400 !border-white/5 rounded-2xl text-xs tracking-widest uppercase active:scale-95"
            >
              취소
            </Button>
            <Button
              type="button"
              size="sm"
              variant="primary"
              onClick={handleSubmit}
              className="flex-[1.8] !bg-emerald-500 hover:!bg-emerald-400 !text-slate-950 font-black rounded-2xl shadow-[0_15px_35px_rgba(16,185,129,0.3)] active:scale-95 flex items-center justify-center gap-3 tracking-[0.1em] text-sm"
            >
              {mode === 'edit' ? '데이터 수정 완료' : '다음'}
              <ChevronRight size={20} strokeWidth={3} />
            </Button>
          </div>
        </div>

        {/* Bottom Status Bar */}
        <div className="h-2.5 w-full flex">
          <div className="h-full flex-1 bg-amber-500/20" />
          <div className="h-full flex-[4] bg-emerald-500 shadow-[0_-5px_25px_rgba(16,185,129,0.6)]" />
          <div className="h-full flex-1 bg-amber-500/20" />
        </div>
      </div>
    </div>
  )
}
