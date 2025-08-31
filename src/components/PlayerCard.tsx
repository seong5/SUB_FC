'use client'

type PlayerCardProps = {
  name: string
  number: number
  goals: number
  assists: number
  attendancePercent: number // 0~100
}

export default function PlayerCard({
  name,
  number,
  goals,
  assists,
  attendancePercent,
}: PlayerCardProps) {
  return (
    <section className="relative w-full max-w-[300px] rounded-[24px] bg-white shadow-lg ring-1 ring-black/5 overflow-hidden">
      <div className="flex h-[160px] items-center justify-center bg-gray-100">
        <span
          className="
            text-[90px] md:text-[110px] font-extrabold text-gray-800
            leading-none tracking-tight
          "
          aria-label={`등번호 ${number}`}
        >
          {number}
        </span>
      </div>
      <div className="p-4">
        <h3 className="text-[18px] md:text-[20px] text-center font-semibold text-gray-900 truncate">
          {name}
        </h3>

        <div className="mt-2 flex flex-col gap-1 text-[14px] md:text-[15px] text-gray-700">
          <div className="flex items-center justify-evenly">
            <span className="text-gray-500">득점</span>
            <span className="font-semibold">{goals}</span>
          </div>
          <div className="flex items-center justify-evenly">
            <span className="text-gray-500">도움</span>
            <span className="font-semibold">{assists}</span>
          </div>
          <div className="flex items-center justify-evenly">
            <span className="text-gray-500">참석률</span>
            <span className="font-semibold">{attendancePercent} %</span>
          </div>
        </div>
      </div>
    </section>
  )
}
