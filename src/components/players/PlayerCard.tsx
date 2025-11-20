'use client'

import { Position, POSITION_COLORS } from '@/constants/positionColor'

type PlayerCardProps = {
  name: string
  number: number
  goals: number
  assists: number
  attendancePercent: number
  position: Position
}

export default function PlayerCard({
  name,
  number,
  goals,
  assists,
  attendancePercent,
  position,
}: PlayerCardProps) {
  return (
    <section className="aspect-square w-full card-shadow">
      <div
        className={`flex h-110 md:h-160 items-center justify-center rounded-t-[24px] ${POSITION_COLORS[position]}`}
      >
        <span
          className="text-[60px] md:text-[100px] font-extrabold text-gray-800 leading-none tracking-tight"
          aria-label={`등번호 ${number}`}
        >
          {number}
        </span>
      </div>
      <div className="-mt-30 p-10 md:p-15 h-110 md:h-160 rounded-[24px] bg-white shadow-md">
        <h3 className="text-[14px] md:text-[22px] text-center font-semibold text-gray-900 truncate mb-4">
          {name}
        </h3>
        <div className="flex flex-col gap-3 text-[12px] md:text-[16px]">
          <div className="flex items-center justify-between px-2">
            <span className="text-gray-600 font-medium">득점</span>
            <span className="font-bold text-gray-900">{goals}</span>
          </div>
          <div className="flex items-center justify-between px-2">
            <span className="text-gray-600 font-medium">도움</span>
            <span className="font-bold text-gray-900">{assists}</span>
          </div>
          <div className="flex items-center justify-between px-2">
            <span className="text-gray-600 font-medium">참석률</span>
            <span className="font-bold text-gray-900">{attendancePercent}%</span>
          </div>
        </div>
      </div>
    </section>
  )
}
