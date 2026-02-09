'use client'

import { useEffect, useMemo, useState } from 'react'
import { ChevronRight, ChevronLeft, Crown, CheckCircle2, Users, Star, Zap } from 'lucide-react'
import Button from '@/components/common/Button'

const EXCLUDED_PLAYERS = ['제갈진석', '차우현', '윤동관', '유동엽', '현신우', 'Guest']

export interface PostMomContentProps {
  onBack: () => void
  onClose: () => void
  onSubmit: (momPlayerIds: string[]) => void
  eligiblePlayers: { id: string; name: string }[]
  initial?: string[]
  mode?: 'create' | 'edit'
}

export default function PostMomContent({
  onBack,
  onClose,
  onSubmit,
  eligiblePlayers,
  initial = [],
  mode = 'create',
}: PostMomContentProps) {
  const [selectedMomIds, setSelectedMomIds] = useState<string[]>(initial)

  // 모달 오픈 시 본문 스크롤 방지
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [])

  const filteredPlayers = useMemo(
    () => eligiblePlayers.filter((player) => !EXCLUDED_PLAYERS.includes(player.name)),
    [eligiblePlayers]
  )

  const togglePlayer = (playerId: string) => {
    setSelectedMomIds((prev) => {
      if (prev.includes(playerId)) {
        return prev.filter((id) => id !== playerId)
      }
      if (prev.length >= 2) return prev
      return [...prev, playerId]
    })
  }

  const handleSubmit = () => {
    onSubmit(selectedMomIds)
  }

  return (
    <div className="flex items-center justify-center w-full max-w-[560px] mx-auto bg-black/20 rounded-[2.5rem]">
      <div className="relative w-full h-auto min-h-0 md:min-h-[85vh] bg-[#0f172a] rounded-[2.5rem] shadow-[0_-20px_50px_rgba(0,0,0,0.5)] md:shadow-[0_30px_60px_-12px_rgba(0,0,0,0.5)] border-t md:border border-white/10 overflow-hidden flex flex-col">
        {/* 모바일 상단 핸들 */}
        <div className="flex pt-3 sm:pt-4 md:hidden shrink-0">
          <div className="w-12 h-1 bg-white/20 rounded-full" />
        </div>

        {/* 상단 장식용 골드 글로우 효과 */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-24 bg-amber-500/10 blur-[80px] pointer-events-none" />

        {/* Pitch Pattern Background Overlay (통일감 유지) */}
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[200%] h-[400px] border border-white/20 rounded-[100%] scale-110" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1px] h-full bg-white/20" />
        </div>

        <div className="relative z-10 flex flex-col flex-1 min-h-0 overflow-y-auto overflow-x-hidden p-10">
          {/* Header Section */}
          <div className="px-0 sm:pr-14 flex items-center justify-between mb-6 md:mb-8">
            <Button
              type="button"
              variant="ghost"
              onClick={onBack}
              className="p-2.5 hover:bg-white/5 rounded-full text-slate-400 transition-colors min-w-0"
            >
              <ChevronLeft size={24} />
            </Button>
            <div className="flex-1 text-center">
              <p className="text-amber-500 text-[10px] font-black uppercase tracking-[0.3em] mb-1">
                Honor of the Match
              </p>
              <h2 className="text-xl font-black text-white italic tracking-tight uppercase flex items-center gap-2 justify-center">
                <Crown size={20} className="text-amber-500" />
                MOM Selection
              </h2>
            </div>
          </div>

          {/* Content Area */}
          <div className="flex flex-col flex-1 min-h-0">
            {/* Status Guide */}
            <div className="flex flex-col items-center mb-6 py-4 bg-white/[0.02] border border-white/5 rounded-3xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-amber-500/50 to-transparent" />
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">
                Selected Personnel
              </p>
              <div className="flex items-end gap-1">
                <span
                  className={`text-4xl font-black italic ${
                    selectedMomIds.length > 0 ? 'text-amber-500' : 'text-slate-700'
                  } transition-colors`}
                >
                  0{selectedMomIds.length}
                </span>
                <span className="text-lg font-black text-slate-800 mb-1">/</span>
                <span className="text-lg font-black text-slate-800 mb-1 italic">02</span>
              </div>
              <p className="text-[10px] text-slate-500 mt-2 font-medium">
                오늘 최고의 활약을 펼친 선수 2명을 선택하세요.
              </p>
            </div>

            {/* Player List: Scrollable */}
            <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
              {filteredPlayers.length === 0 ? (
                <div className="py-20 text-center border-2 border-dashed border-white/5 rounded-[2.5rem] bg-black/10">
                  <Users size={32} className="mx-auto text-slate-800 mb-3" />
                  <p className="text-sm font-bold text-slate-600">선택 가능한 선수가 없습니다.</p>
                </div>
              ) : (
                filteredPlayers.map((player) => {
                  const isSelected = selectedMomIds.includes(player.id)
                  return (
                    <button
                      key={player.id}
                      type="button"
                      onClick={() => togglePlayer(player.id)}
                      className={`group relative w-full flex items-center justify-between p-5 rounded-2xl border transition-all duration-300 ${
                        isSelected
                          ? 'bg-amber-500/10 border-amber-500/50 shadow-[0_0_20px_rgba(245,158,11,0.1)]'
                          : 'bg-white/[0.03] border-white/5 hover:border-white/10 hover:bg-white/[0.05]'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={`w-12 h-12 rounded-xl flex items-center justify-center border transition-all ${
                            isSelected
                              ? 'bg-amber-500 border-amber-400 text-slate-950 shadow-[0_0_15px_rgba(245,158,11,0.4)]'
                              : 'bg-slate-800 border-white/5 text-slate-500 group-hover:text-slate-300'
                          }`}
                        >
                          {isSelected ? <Star size={20} fill="currentColor" /> : <Zap size={20} />}
                        </div>
                        <div className="text-left">
                          <span
                            className={`text-sm font-black italic block transition-colors ${
                              isSelected
                                ? 'text-white'
                                : 'text-slate-400 group-hover:text-slate-200'
                            }`}
                          >
                            {player.name}
                          </span>
                          <span className="text-[9px] font-bold text-slate-600 uppercase tracking-tighter">
                            Squad_Member
                          </span>
                        </div>
                      </div>

                      <div
                        className={`transition-all duration-300 ${
                          isSelected ? 'scale-110' : 'scale-90 opacity-0 group-hover:opacity-20'
                        }`}
                      >
                        <CheckCircle2
                          size={24}
                          className={isSelected ? 'text-amber-500' : 'text-slate-500'}
                        />
                      </div>

                      {/* Selection Glow Overlay */}
                      {isSelected && (
                        <div className="absolute inset-0 rounded-2xl border-2 border-amber-500/20 animate-pulse pointer-events-none" />
                      )}
                    </button>
                  )
                })
              )}
            </div>
          </div>
        </div>

        {/* Footer Section */}
        <div className="relative z-20 p-8 mb-15 bg-[#0f172a] border-t border-white/5 shadow-[0_-20px_50px_rgba(0,0,0,0.6)]">
          <div className="flex flex-row gap-3">
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
              disabled={selectedMomIds.length === 0}
              className={`flex-[1.8] font-black rounded-2xl transition-all active:scale-95 flex items-center justify-center gap-3 tracking-[0.1em] text-sm shadow-xl ${
                selectedMomIds.length > 0
                  ? '!bg-amber-500 hover:!bg-amber-400 !text-slate-950 shadow-amber-500/20'
                  : '!bg-slate-800 !text-slate-600 cursor-not-allowed opacity-50'
              }`}
            >
              {mode === 'edit' ? '수정하기' : '등록하기'}
              <ChevronRight size={20} strokeWidth={3} />
            </Button>
          </div>
        </div>

        {/* Bottom Accent: Gold/Amber theme */}
        <div className="h-2.5 w-full flex">
          <div className="h-full flex-1 bg-amber-600/20" />
          <div className="h-full flex-[5] bg-amber-500 shadow-[0_-5px_25px_rgba(245,158,11,0.6)]" />
          <div className="h-full flex-1 bg-amber-600/20" />
        </div>
      </div>
    </div>
  )
}
