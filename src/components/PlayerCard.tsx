'use client'

type PlayerCardProps = {
  name: string
  number: number
  goals: number
  assists: number
  attendancePercent: number
}

export default function PlayerCard({
  name,
  number,
  goals,
  assists,
  attendancePercent,
}: PlayerCardProps) {
  return (
    <section className="w-160 md:w-250 my-10">
      <div className="flex h-110 md:h-160 items-center justify-center bg-red-100 rounded-t-[24px]">
        <span
          className="text-[60px] md:text-[100px] font-extrabold text-gray-800 leading-none tracking-tight"
          aria-label={`등번호 ${number}`}
        >
          {number}
        </span>
      </div>
      <div className="-mt-30 p-10 md:p-15 h-110 md:h-160 rounded-[24px] bg-white shadow-md">
        <h3 className="text-[14px] md:text-[22px] text-center font-semibold text-gray-900 truncate">
          {name}
        </h3>
        <div className="mt-3 flex flex-col gap-2 text-[14px] md:text-[18px] text-gray-700">
          <div className="flex items-center justify-evenly">
            <span className="text-gray-500">득 점</span>
            <span className="font-semibold">{goals}</span>
          </div>
          <div className="flex items-center justify-evenly">
            <span className="text-gray-500">도 움</span>
            <span className="font-semibold">{assists}</span>
          </div>
          <div className="flex items-center justify-evenly">
            <span className="text-gray-500">참석률</span>
            <span className="font-semibold">{attendancePercent}%</span>
          </div>
        </div>
      </div>
    </section>
  )
}
