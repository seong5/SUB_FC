'use client'

import React from 'react'
import Skeleton from '@/components/common/skeleton/Skeleton'

export default function PlayerCardSkeleton() {
  return (
    <div className="group relative w-full max-w-[280px] transition-all duration-500">
      <div
        className="absolute -inset-0.5 rounded-[32px] blur-xl bg-white/0 pointer-events-none"
        aria-hidden
      />

      <div className="relative flex flex-col p-6 h-full bg-slate-900 border border-white/5 rounded-[30px] overflow-hidden shadow-2xl">
        {/* 상단: 등번호 & 포지션 영역 (PlayerCard와 동일 min-h-44 py-4) */}
        <div className="relative min-h-44 flex items-center justify-center py-4">
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/20 via-transparent to-transparent" />
          <div className="relative z-10 flex flex-col items-center gap-2">
            <Skeleton variant="box" className="h-16 w-16 md:h-20 md:w-20 rounded-lg bg-white/10" />
            <Skeleton variant="bar" className="h-3 w-12 rounded-full bg-white/10" />
          </div>
        </div>

        {/* 하단: 정보 섹션 (PlayerCard와 동일 p-6, 이름 + 언더라인, 2x2 스탯) */}
        <div className="flex-1 bg-slate-950/50 backdrop-blur-xl p-6 flex flex-col">
          <div className="text-center mb-6">
            <Skeleton variant="bar" className="h-5 w-24 mx-auto bg-white/10" />
            <Skeleton variant="bar" className="h-2 w-full mt-2 rounded-full bg-white/10" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="bg-white/5 border border-white/5 rounded-2xl p-3 flex flex-col items-center justify-center gap-0.5"
              >
                <Skeleton variant="bar" className="h-2.5 w-10 bg-white/10" />
                <Skeleton variant="box" className="h-4 w-6 bg-white/10" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
