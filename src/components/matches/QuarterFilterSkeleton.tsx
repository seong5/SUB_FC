'use client'

import { EllipsisVertical, LayoutGrid } from 'lucide-react'
import Skeleton from '@/components/common/skeleton/Skeleton'

const TYPES = ['1 쿼터', '2 쿼터', '3 쿼터', '4 쿼터'] as const

export default function QuarterFilterSkeleton() {
  return (
    <section className="space-y-8">
      {/* 상단: 헤더 및 관리자 액션 (레이아웃 고정) */}
      <div className="flex justify-between items-end mb-10 px-2 mb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2" />
          <h2 className="text-2xl md:text-4xl font-black text-white italic tracking-tighter uppercase">
            Quarters
          </h2>
        </div>

        {/* 관리자 액션 영역 스켈레톤 */}
        <div className="relative">
          <button
            type="button"
            className="p-3.5 rounded-2xl border bg-white/5 border-white/10 text-slate-600 cursor-default"
            aria-hidden
          >
            <EllipsisVertical size={20} />
          </button>
        </div>
      </div>

      {/* 쿼터 선택 버튼 그리드 스켈레톤 (동일 레이아웃) */}
      <div className="grid grid-cols-2 md:grid-cols-4 mb-15 gap-4">
        {TYPES.map((type) => (
          <div
            key={type}
            className="group relative overflow-hidden rounded-[2.5rem] p-6 border-2 bg-white/[0.03] border-white/5"
          >
            {/* 배경 숫자 장식 자리 */}
            <span className="absolute -right-2 -bottom-4 text-7xl font-black italic opacity-[0.03] pointer-events-none">
              {type.charAt(0)}
            </span>

            <div className="relative z-10 flex flex-row items-center gap-10">
              <div className="p-3 rounded-2xl bg-white/5 text-slate-500">
                <LayoutGrid size={20} />
              </div>
              <div className="space-y-1 text-left">
                <Skeleton className="h-[17.5px] w-[47.48px] bg-slate-700/60" variant="bar" />
                <Skeleton className="h-[20.5px] w-[32.61px] bg-slate-700/60" variant="bar" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
