'use client'

import { useEffect, useMemo, useState } from 'react'
import { Users, ChevronRight, ChevronLeft, X, LayoutGrid, Shield, UserCheck } from 'lucide-react'
import Button from '@/components/common/Button'
import type { PostRosterContentProps } from '@/constants/modal'
import type { Position } from '@/constants/modal'
import type { Formation } from '@/constants/modal'

const POSITIONS: Position[] = ['GK', 'DF', 'MF', 'FW']
const FORMATIONS: Formation[] = ['4-4-2', '4-2-3-1']

export default function PostRosterContent({
  onBack,
  onClose,
  onSubmit,
  players,
  initial,
  mode = 'create', // 나중에 edit/create 분기 등에 사용 예정
}: PostRosterContentProps) {
  const [formation, setFormation] = useState<Formation>(initial?.formation ?? '4-2-3-1')
  const [roster, setRoster] = useState<Record<Position, string[]>>({
    GK: initial?.GK ?? [],
    DF: initial?.DF ?? [],
    MF: initial?.MF ?? [],
    FW: initial?.FW ?? [],
  })

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [])

  const grouped = useMemo(
    () => ({
      GK: players.filter((p) => p.position === 'GK'),
      DF: players.filter((p) => p.position === 'DF'),
      MF: players.filter((p) => p.position === 'MF'),
      FW: players.filter((p) => p.position === 'FW'),
    }),
    [players]
  )

  const setPos = (pos: Position, ids: string[]) => setRoster((prev) => ({ ...prev, [pos]: ids }))

  const isValid = roster.GK.length >= 1

  const handleNext = () => {
    if (!isValid) return
    onSubmit({
      formation,
      GK: roster.GK,
      DF: roster.DF,
      MF: roster.MF,
      FW: roster.FW,
    })
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
          <div className="px-0 sm:pr-14 flex justify-between items-center mb-6 md:mb-8">
            <Button
              type="button"
              variant="ghost"
              onClick={onBack}
              className="p-2 hover:bg-white/5 rounded-full text-slate-400 transition-colors min-w-0"
              aria-label="이전"
            >
              <ChevronLeft size={24} />
            </Button>
            <div className="text-center">
              <p className="text-emerald-500 text-[13px] font-black uppercase tracking-[0.3em] mb-1">
                Step 02
              </p>
              <h2 className="text-xl font-black text-white italic tracking-tight">
                {mode === 'edit' ? '포메이션 & 참가 선수 수정' : '포메이션 & 참가 선수 등록'}
              </h2>
            </div>
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
              className="p-2 hover:bg-white/5 rounded-full text-slate-400 transition-colors min-w-0"
              aria-label="닫기"
            >
              <X size={20} />
            </Button>
          </div>

          {/* Content */}
          <div className="flex-1 space-y-8 custom-scrollbar">
            {/* 포메이션 선택 섹션 */}
            <div className="space-y-4 mb-15">
              <label className="flex items-center gap-5 text-[12px] mb-10 font-bold text-slate-500 uppercase tracking-widest ml-2">
                <LayoutGrid size={12} className="text-emerald-500" /> Tactical Formation
              </label>
              <div className="grid grid-cols-2 mb-15 gap-3 p-1.5 bg-white/5 rounded-[1.5rem] border border-white/5">
                {FORMATIONS.map((f) => (
                  <Button
                    key={f}
                    type="button"
                    size="sm"
                    variant="ghost"
                    onClick={() => setFormation(f)}
                    className={`py-3 rounded-xl text-xs font-black transition-all ${
                      formation === f
                        ? 'bg-emerald-500 text-slate-950 shadow-[0_0_15px_rgba(16,185,129,0.4)]'
                        : 'bg-transparent text-slate-500 hover:text-white'
                    }`}
                  >
                    {f}
                  </Button>
                ))}
              </div>
            </div>

            {/* 포지션별 선수 선택 섹션 */}
            <div className="space-y-5 mb-15">
              <label className="flex items-center gap-5 mb-10 text-[12px] font-bold text-slate-500 uppercase tracking-widest px-2">
                <Users size={12} className="text-emerald-500" /> Unit Deployment
              </label>

              <div className="grid grid-cols-2 gap-10 mb-15">
                {POSITIONS.map((pos) => (
                  <div
                    key={pos}
                    className="group relative bg-white/[0.03] border border-white/5 rounded-3xl p-5 hover:bg-white/[0.05] transition-all"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-10 h-10 rounded-xl flex items-center justify-center border ${
                            pos === 'GK'
                              ? 'border-amber-500/30 bg-amber-500/10 text-amber-500'
                              : 'border-emerald-500/30 bg-emerald-500/10 text-emerald-500'
                          }`}
                        >
                          {pos === 'GK' ? <Shield size={18} /> : <UserCheck size={18} />}
                        </div>
                        <div>
                          <h4 className="text-[13px] font-black text-white">{pos}</h4>
                        </div>
                      </div>
                    </div>

                    <div className="relative">
                      <select
                        multiple
                        className="w-full bg-slate-900/50 border border-white/5 rounded-2xl p-4 text-sm font-bold text-white focus:border-emerald-500/50 outline-none transition-all min-h-[80px] custom-scrollbar appearance-none"
                        value={roster[pos]}
                        onChange={(e) => {
                          const ids = Array.from(e.target.selectedOptions).map((o) => o.value)
                          setPos(pos, ids)
                        }}
                      >
                        {grouped[pos].map((p) => (
                          <option
                            key={p.id}
                            value={p.id}
                            className="py-2 px-1 text-slate-400 checked:text-emerald-400 checked:bg-emerald-500/10 rounded-lg mb-1"
                          >
                            {p.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="relative z-20 p-6 mb-15 bg-[#0f172a] border-t border-white/5 shadow-[0_-20px_50px_rgba(0,0,0,0.6)]">
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
              onClick={handleNext}
              disabled={!isValid}
              className="flex-[1.5] !bg-emerald-500 hover:!bg-emerald-400 disabled:!opacity-50 !text-slate-950 font-black rounded-2xl shadow-[0_10px_30px_rgba(16,185,129,0.3)] active:scale-95 flex items-center justify-center gap-2 tracking-[0.1em] text-sm"
            >
              {mode === 'edit' ? '저장 후 다음' : '다음'}
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
