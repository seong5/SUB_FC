'use client'

import { useEffect, useState } from 'react'
import { ChevronRight, ChevronLeft, X, Target, ShieldAlert, Activity } from 'lucide-react'
import Button from '@/components/common/Button'
import type { PostQuartersContentProps } from '@/constants/modal'
import type { QuarterData } from '@/types/match'

export default function PostQuartersContent({
  onBack,
  onClose,
  onSubmit,
  eligiblePlayers: _eligiblePlayers, // used by parent flow (e.g. next step)
  initial,
  mode = 'create',
}: PostQuartersContentProps) {
  void _eligiblePlayers
  const [quarters, setQuarters] = useState<QuarterData[]>(
    initial ?? [
      { quarter: 1, goals: [], conceded: 0, scoreAfter: '' },
      { quarter: 2, goals: [], conceded: 0, scoreAfter: '' },
      { quarter: 3, goals: [], conceded: 0, scoreAfter: '' },
      { quarter: 4, goals: [], conceded: 0, scoreAfter: '' },
    ]
  )

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [])

  const update = (qi: number, patch: Partial<QuarterData>) => {
    setQuarters((prev) => prev.map((q, i) => (i === qi ? { ...q, ...patch } : q)))
  }

  const isValid = quarters.every((q) => q.scoreAfter.trim() !== '' && q.conceded >= 0)

  const handleSubmit = () => {
    if (!isValid) return
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
          <div className="px-0 sm:pr-14 flex justify-between items-center mb-15">
            <Button
              type="button"
              variant="ghost"
              onClick={onBack}
              className="p-2 hover:bg-white/5 rounded-full text-slate-400 transition-colors min-w-0"
            >
              <ChevronLeft size={24} />
            </Button>
            <div className="text-center">
              <p className="text-emerald-500 text-[13px] font-black uppercase tracking-[0.3em] mb-1">
                Step 03
              </p>
              <h2 className="text-xl font-black text-white italic tracking-tight">
                QUARTER ANALYTICS
              </h2>
            </div>
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
              className="p-2 hover:bg-white/5 rounded-full text-slate-400 transition-colors min-w-0"
            >
              <X size={20} />
            </Button>
          </div>

          {/* Content */}
          <div className="flex-1 space-y-6 custom-scrollbar">
            {quarters.map((q, qi) => (
              <div
                key={q.quarter}
                className="group relative mb-15 bg-gradient-to-br from-white/[0.03] to-transparent rounded-[2rem] border border-white/5 p-7 md:p-8 hover:border-emerald-500/30 transition-all duration-300"
              >
                {/* Quarter Badge */}
                <div className="absolute -top-3 left-6 px-4 py-1 bg-slate-800 border border-white/10 rounded-full shadow-xl">
                  <span className="text-[12px] font-black text-emerald-400 uppercase tracking-widest">
                    {q.quarter} QUARTER
                  </span>
                </div>

                <div className="mt-3 grid grid-cols-2 gap-8">
                  {/* 쿼터 스코어 */}
                  <div className="space-y-3">
                    <label className="flex items-center justify-end gap-2 text-[12px] font-bold text-slate-500 uppercase tracking-wider ml-1">
                      <Target size={12} className="text-emerald-500" />
                      쿼터 스코어
                    </label>
                    <div className="relative">
                      <input
                        placeholder="예: 2-1"
                        value={q.scoreAfter}
                        onChange={(e) => update(qi, { scoreAfter: e.target.value })}
                        className="w-full bg-slate-900/50 border border-white/5 rounded-2xl px-4 py-5 md:py-6 text-sm font-bold text-white focus:border-emerald-500/50 focus:ring-4 focus:ring-emerald-500/5 outline-none transition-all placeholder:text-slate-700"
                      />
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 w-1 h-5 bg-emerald-500/20 rounded-full group-hover:bg-emerald-500 transition-colors" />
                    </div>
                  </div>

                  {/* 실점 기록 */}
                  <div className="space-y-3">
                    <label className="flex items-center justify-end gap-2 text-[12px] font-bold text-slate-500 uppercase tracking-wider ml-1">
                      <ShieldAlert size={12} className="text-rose-500" /> 실점
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        min={0}
                        placeholder="0"
                        value={q.conceded === 0 ? '' : String(q.conceded)}
                        onChange={(e) =>
                          update(qi, { conceded: Math.max(0, Number(e.target.value) || 0) })
                        }
                        className="w-full bg-slate-900/50 border border-white/5 rounded-2xl px-4 py-5 md:py-6 text-sm font-bold text-rose-400 focus:border-rose-500/50 focus:ring-4 focus:ring-rose-500/5 outline-none transition-all placeholder:text-slate-700"
                      />
                    </div>
                  </div>
                </div>

                {/* 하단 데코레이션 */}
                <div className="mt-6 flex items-center gap-2 opacity-20">
                  <Activity size={12} className="text-emerald-500" />
                  <div className="flex-1 h-[1px] bg-gradient-to-r from-emerald-500 via-white/20 to-transparent" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="relative z-20 p-8 mb-15 bg-[#0f172a] border-t border-white/5 shadow-[0_-20px_50px_rgba(0,0,0,0.6)]">
          <div className="flex flex-row justify-between px-10 gap-3">
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
              disabled={!isValid}
              className="flex-[1.5] !bg-emerald-500 hover:!bg-emerald-400 disabled:!opacity-50 !text-slate-950 font-black rounded-2xl shadow-[0_10px_30px_rgba(16,185,129,0.3)] active:scale-95 flex items-center justify-center gap-2 tracking-[0.1em] text-sm"
            >
              {mode === 'edit' ? '다음 단계' : '경기 기록 완료'}
              <ChevronRight size={18} />
            </Button>
          </div>
        </div>

        {/* Bottom Accent Glow */}
        <div className="h-2 w-full flex">
          <div className="h-full flex-1 bg-emerald-600/10" />
          <div className="h-full flex-[5] bg-emerald-500 shadow-[0_-5px_25px_rgba(16,185,129,0.5)]" />
          <div className="h-full flex-1 bg-emerald-600/10" />
        </div>
      </div>
    </div>
  )
}
