'use client'

import { useEffect, useState } from 'react'
import { ChevronRight, ChevronLeft, X, Target, ShieldAlert, Activity, Layers } from 'lucide-react'
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
    <div
      className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-slate-950/70 backdrop-blur-md p-0 md:p-6"
      onClick={onClose}
    >
      <div
        className="relative w-full md:max-w-[560px] max-h-[90dvh] md:max-h-[94vh] bg-[#0f172a] rounded-t-[2.5rem] md:rounded-[2.5rem] shadow-2xl border-t md:border border-white/10 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Pitch Grid Overlay */}
        <div className="absolute inset-0 opacity-10 pointer-events-none bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:32px_32px]" />

        {/* Header */}
        <div className="relative z-10 px-8 pt-8 pb-4 flex justify-between items-center">
          <button
            type="button"
            onClick={onBack}
            className="p-2 hover:bg-white/5 rounded-full text-slate-400 transition-colors"
            aria-label="이전"
          >
            <ChevronLeft size={24} />
          </button>
          <div className="text-center">
            <p className="text-emerald-500 text-[10px] font-black uppercase tracking-[0.3em] mb-1">
              Step 02
            </p>
            <h2 className="text-xl font-black text-white italic tracking-tight">
              QUARTER ANALYTICS
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 hover:bg-white/5 rounded-full text-slate-400 transition-colors"
            aria-label="닫기"
          >
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Content Area */}
        <div className="relative z-10 flex-1 overflow-y-auto px-6 py-4 space-y-6 custom-scrollbar">
          {quarters.map((q, qi) => (
            <div
              key={q.quarter}
              className="group relative bg-gradient-to-br from-white/[0.03] to-transparent rounded-[2rem] border border-white/5 p-6 hover:border-emerald-500/30 transition-all duration-300"
            >
              {/* Quarter Badge */}
              <div className="absolute -top-3 left-6 px-4 py-1 bg-slate-800 border border-white/10 rounded-full shadow-xl">
                <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">
                  {q.quarter} QUARTER
                </span>
              </div>

              <div className="mt-2 grid grid-cols-2 gap-6">
                {/* 쿼터 스코어 */}
                <div className="space-y-3">
                  <label className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider ml-1">
                    <Target size={12} className="text-emerald-500" /> Quarter Score
                  </label>
                  <div className="relative">
                    <input
                      placeholder="예: 2-1"
                      value={q.scoreAfter}
                      onChange={(e) => update(qi, { scoreAfter: e.target.value })}
                      className="w-full bg-slate-900/50 border border-white/5 rounded-2xl px-4 py-4 text-sm font-bold text-white focus:border-emerald-500/50 focus:ring-4 focus:ring-emerald-500/5 outline-none transition-all placeholder:text-slate-700"
                    />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 w-1 h-4 bg-emerald-500/20 rounded-full group-hover:bg-emerald-500 transition-colors" />
                  </div>
                </div>

                {/* 실점 기록 */}
                <div className="space-y-3">
                  <label className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider ml-1">
                    <ShieldAlert size={12} className="text-rose-500" /> Conceded
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
                      className="w-full bg-slate-900/50 border border-white/5 rounded-2xl px-4 py-4 text-sm font-bold text-rose-400 focus:border-rose-500/50 focus:ring-4 focus:ring-rose-500/5 outline-none transition-all placeholder:text-slate-700"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-rose-400/80 uppercase">
                      Goals
                    </span>
                  </div>
                </div>
              </div>

              {/* 하단 데코레이션 */}
              <div className="mt-5 flex items-center gap-2 opacity-20">
                <Activity size={12} className="text-emerald-500" />
                <div className="flex-1 h-[1px] bg-gradient-to-r from-emerald-500 via-white/20 to-transparent" />
              </div>
            </div>
          ))}

          {/* 시스템 가이드 */}
          <div className="flex items-start gap-3 p-5 bg-emerald-500/5 rounded-[2rem] border border-emerald-500/10">
            <Layers size={18} className="text-emerald-500 shrink-0" />
            <p className="text-[11px] text-slate-400 leading-relaxed uppercase font-medium">
              입력된 쿼터별 데이터는 팀의{' '}
              <span className="text-emerald-400 font-bold">공수 밸런스 분석 리포트</span> 생성에
              활용됩니다. 정확한 실점 상황을 입력해 주세요.
            </p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="relative z-20 p-6 md:p-10 bg-[#0f172a] border-t border-white/5 shadow-[0_-20px_50px_rgba(0,0,0,0.6)]">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex flex-1 gap-3">
              <button
                type="button"
                onClick={onBack}
                className="flex-1 h-14 bg-white/5 hover:bg-white/10 text-slate-400 font-bold rounded-2xl border border-white/5 transition-all text-xs tracking-widest uppercase active:scale-95"
              >
                이전
              </button>
              <button
                type="button"
                onClick={onClose}
                className="flex-1 h-14 bg-white/5 hover:bg-white/10 text-slate-400 font-bold rounded-2xl border border-white/5 transition-all text-xs tracking-widest uppercase active:scale-95"
              >
                취소
              </button>
            </div>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!isValid}
              className="flex-[1.5] h-14 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed text-slate-950 font-black rounded-2xl shadow-[0_10px_30px_rgba(16,185,129,0.3)] transition-all active:scale-95 flex items-center justify-center gap-2 tracking-[0.1em] text-sm"
            >
              {mode === 'edit' ? '다음 단계' : '경기 기록 완료'}
              <ChevronRight size={18} />
            </button>
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
