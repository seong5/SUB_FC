'use client'

import { Trophy, ShieldAlert, Star, Flame } from 'lucide-react'
import Skeleton from '@/components/common/skeleton/Skeleton'

export default function ScoreAndAssistSkeleton() {
  return (
    <section className="space-y-6">
      {/* 섹션 타이틀 */}
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-3">
          <h3 className="text-2xl font-black italic text-white uppercase tracking-tighter">
            Score & Assist
          </h3>
        </div>
      </div>

      {/* 메인 카드 스켈레톤 */}
      <div className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/20 via-transparent to-indigo-500/20 rounded-[3rem] blur-xl opacity-50" />

        <div className="relative bg-[#020617]/80 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-8 md:p-12 overflow-hidden shadow-2xl space-y-10">
          {/* 상단: 전체 스코어 써머리 스켈레톤 */}
          <div className="flex flex-col items-center justify-center mb-6 relative">
            <div className="absolute top-0 opacity-[0.03] scale-[2] pointer-events-none">
              <Trophy size={180} />
            </div>

            <Skeleton variant="bar" className="h-3 w-40 bg-slate-700/60 mb-4" />

            <div className="flex items-center justify-center gap-6 md:gap-12 w-full">
              <div className="flex-1 text-right">
                <Skeleton variant="bar" className="h-4 w-16 ml-auto bg-slate-700/60" />
              </div>

              <div className="flex items-center gap-4">
                <Skeleton variant="bar" className="h-10 w-8 bg-slate-700/60" />
                <Skeleton variant="bar" className="h-10 w-8 bg-slate-700/60" />
              </div>

              <div className="flex-1 text-left">
                <Skeleton variant="bar" className="h-4 w-16 mr-auto bg-slate-700/60" />
              </div>
            </div>
          </div>

          {/* 중단: 쿼터 선택/스코어 스켈레톤 */}
          <div className="flex flex-col items-center gap-4">
            <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            <div className="flex flex-col items-center gap-3">
              <Skeleton variant="bar" className="h-8 w-40 rounded-full bg-slate-700/80" />
              <Skeleton variant="bar" className="h-10 w-32 bg-slate-700/60" />
            </div>
            <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          </div>

          {/* 하단: 3컬럼 데이터 그리드 스켈레톤 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* 득점 카드 */}
            <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 bg-emerald-500/10 rounded-xl text-emerald-500">
                  <Flame size={18} fill="currentColor" />
                </div>
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                  득점
                </span>
              </div>
              <div className="space-y-2 min-h-[40px]">
                <Skeleton variant="box" className="h-10 w-full rounded-2xl bg-emerald-500/10" />
                <Skeleton variant="box" className="h-10 w-full rounded-2xl bg-emerald-500/10" />
              </div>
            </div>

            {/* 도움 카드 */}
            <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 bg-indigo-500/10 rounded-xl text-indigo-500">
                  <Star size={18} fill="currentColor" />
                </div>
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                  도움
                </span>
              </div>
              <div className="space-y-2 min-h-[40px]">
                <Skeleton variant="box" className="h-10 w-full rounded-2xl bg-indigo-500/10" />
                <Skeleton variant="box" className="h-10 w-full rounded-2xl bg-indigo-500/10" />
              </div>
            </div>

            {/* 실점 카드 */}
            <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 bg-rose-500/10 rounded-xl text-rose-500">
                  <ShieldAlert size={18} fill="currentColor" />
                </div>
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                  실점
                </span>
              </div>
              <div className="space-y-2 min-h-[40px]">
                <Skeleton variant="box" className="h-10 w-full rounded-2xl bg-rose-500/10" />
                <Skeleton variant="box" className="h-10 w-full rounded-2xl bg-rose-500/10" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
