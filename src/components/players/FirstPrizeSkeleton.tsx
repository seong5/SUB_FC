'use client'

import React from 'react'
import { Trophy } from 'lucide-react'
import Skeleton from '@/components/common/skeleton/Skeleton'

export default function FirstPrizeSkeleton() {
  return (
    <section className="bg-[#020617] py-20 px-20 md:px-40 relative overflow-hidden font-sans">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-blue-600/5 blur-[120px] rounded-full" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter uppercase leading-none">
            <span className="inline-flex items-center justify-center gap-3 md:gap-4">
              <Trophy size={40} className="text-yellow-500 shrink-0 w-30 h-30 md:w-40 md:h-40" />
              SUB FC
            </span>
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-emerald-400">
              명예의 전당
            </span>
          </h1>
          <p className="mt-6 text-slate-500 font-bold text-xs uppercase tracking-[0.5em] opacity-80">
            부문별 최우수 선수 리스트
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="group relative">
              <div
                className="absolute -inset-0.5 rounded-[32px] blur-xl bg-white/0 pointer-events-none"
                aria-hidden
              />
              <div className="relative bg-slate-900/40 backdrop-blur-2xl border border-white/5 p-12 rounded-[32px] h-full flex flex-col justify-between overflow-hidden">
                <div>
                  <div className="flex items-center gap-10 mb-8">
                    <Skeleton variant="circle" className="h-[30px] w-[30px] shrink-0 bg-white/10" />
                    <Skeleton variant="bar" className="h-[19.5px] w-[67.3px] bg-white/10" />
                  </div>

                  <Skeleton variant="bar" className="h-[16px] w-[70px] mb-4 bg-white/10" />

                  <div className="space-y-1">
                    <Skeleton variant="box" className="h-[36px] w-[120px] bg-white/10" />
                  </div>
                </div>

                <div className="mt-10 pt-6 border-t border-white/5 flex items-baseline gap-1.5">
                  <Skeleton variant="box" className="h-[40px] w-[69.5px] bg-white/10" />
                  <Skeleton variant="bar" className="h-[15px] w-[54px] bg-white/10" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
