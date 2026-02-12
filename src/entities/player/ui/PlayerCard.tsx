'use client'

import React from 'react'
import { type Position, POSITION_GRADIENT, POSITION_BADGE_BG } from '@/shared/config/positionColor'

type PlayerCardProps = {
  name: string
  number: number
  goals: number
  assists: number
  mom: number
  attendancePercent: number
  position: Position
}

export default function PlayerCard({
  name,
  number,
  goals,
  assists,
  mom,
  attendancePercent,
  position,
}: PlayerCardProps) {
  const gradient = POSITION_GRADIENT[position] ?? POSITION_GRADIENT.MF
  const badgeBg = POSITION_BADGE_BG[position] ?? POSITION_BADGE_BG.MF

  return (
    <div className="group relative w-full max-w-[280px] transition-all duration-500 hover:-translate-y-2">
      <div
        className={`absolute -inset-0.5 bg-gradient-to-br ${gradient} rounded-[32px] blur-xl opacity-0 group-hover:opacity-30 transition duration-500`}
      />

      <div className="relative flex flex-col p-6 h-full bg-slate-900 border border-white/5 rounded-[30px] overflow-hidden shadow-2xl">
        <div className="relative min-h-44 flex items-center justify-center py-4">
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/20 via-transparent to-transparent" />

          <div className="relative z-10 flex flex-col items-center">
            <span
              className={`text-6xl md:text-7xl font-black leading-none text-transparent bg-clip-text bg-gradient-to-b ${gradient} select-none`}
            >
              {number}
            </span>
            <div
              className={`mt-2 px-3 py-0.5 rounded-full ${badgeBg} border border-white/10 backdrop-blur-md`}
            >
              <span className="text-[10px] font-black uppercase tracking-widest text-white">
                {position}
              </span>
            </div>
          </div>
        </div>

        <div className="flex-1 bg-slate-950/50 backdrop-blur-xl p-6 flex flex-col">
          <div className="text-center mb-6">
            <h3 className="text-lg font-black text-white uppercase tracking-tight truncate">
              {name}
            </h3>
            <div className={`h-2 w-full mx-auto mt-2 bg-gradient-to-r ${gradient} rounded-full`} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white/5 border border-white/5 rounded-2xl p-3 flex flex-col items-center justify-center gap-0.5 group/stat hover:bg-white/10 transition-colors">
              <span className="text-[9px] font-bold text-slate-500 uppercase tracking-tighter">
                득점
              </span>
              <span className="text-sm font-black text-white">{goals}</span>
            </div>
            <div className="bg-white/5 border border-white/5 rounded-2xl p-3 flex flex-col items-center justify-center gap-0.5 group/stat hover:bg-white/10 transition-colors">
              <span className="text-[9px] font-bold text-slate-500 uppercase tracking-tighter">
                도움
              </span>
              <span className="text-sm font-black text-white">{assists}</span>
            </div>
            <div className="bg-white/5 border border-white/5 rounded-2xl p-3 flex flex-col items-center justify-center gap-0.5 group/stat hover:bg-white/10 transition-colors">
              <span className="text-[9px] font-bold text-slate-500 uppercase tracking-tighter">
                MOTM
              </span>
              <span className="text-sm font-black text-white">{mom}</span>
            </div>
            <div className="bg-white/5 border border-white/5 rounded-2xl p-3 flex flex-col items-center justify-center gap-0.5 group/stat hover:bg-white/10 transition-colors">
              <span className="text-[9px] font-bold text-slate-500 uppercase tracking-tighter">
                참석률
              </span>
              <span className="text-sm font-black text-white">{attendancePercent}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
