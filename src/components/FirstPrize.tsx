'use client'

import Image from 'next/image'
import { useQuery } from '@tanstack/react-query'
import { getPlayers, type Player } from '@/libs/playersApi'

function getTopPlayer(players: Player[], field: keyof Player) {
  if (!players.length) return null
  const maxValue = Math.max(...players.map((p) => Number(p[field])))
  return players.find((p) => Number(p[field]) === maxValue) || null
}

export default function FirstPrize() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['players'],
    queryFn: getPlayers,
  })

  if (isLoading) return <p className="text-center py-20">불러오는 중…</p>
  if (isError || !data)
    return <p className="text-center py-20 text-red-500">데이터를 불러오지 못했습니다.</p>

  const topGoal = getTopPlayer(data, 'goals')
  const topAssist = getTopPlayer(data, 'assists')
  const topAttendance = getTopPlayer(data, 'attendance_percent')

  return (
    <>
      <h1 className="text-center text-[30px] md:text-[60px] font-bold mb-10">
        SUB FC <br />
        부문별 1위
      </h1>
      <section className="text-center flex flex-row justify-center items-center gap-50">
        <div className="flex flex-col gap-5">
          <Image
            src="/score-icon.png"
            alt="득점"
            width={100}
            height={100}
            className="w-60 h-60 md:w-80 md:h-80"
          />
          <h3 className="txt-16_B md:txt-24_B">득점</h3>
          <h1 className="txt-20_B md:txt-32_B text-primary-500 mt-10">{topGoal?.name}</h1>
          <p className="txt-14_M md:txt-18_M text-gray-600">{topGoal?.goals} 골</p>
        </div>
        <div className="flex flex-col gap-5">
          <Image
            src="/assist-icon.png"
            alt="도움"
            width={100}
            height={100}
            className="w-60 h-60 md:w-80 md:h-80"
          />
          <h3 className="txt-16_B md:txt-24_B">도움</h3>
          <h1 className="txt-20_B md:txt-32_B text-green-500 mt-10">{topAssist?.name}</h1>
          <p className="txt-14_M md:txt-18_M text-gray-600">{topAssist?.assists} 도움</p>
        </div>
        <div className="flex flex-col gap-5">
          <Image
            src="/attendance-icon.png"
            alt="참석"
            width={100}
            height={100}
            className="w-60 h-60 md:w-80 md:h-80"
          />
          <h3 className="txt-16_B md:txt-24_B">참석률</h3>
          <h1 className="txt-20_B md:txt-32_B text-yellow-500 mt-10">{topAttendance?.name}</h1>
          <p className="txt-14_M md:txt-18_M text-gray-600">{topAttendance?.attendance_percent}%</p>
        </div>
      </section>
    </>
  )
}
