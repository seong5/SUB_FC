'use client'

import Image from 'next/image'
import { useQuery } from '@tanstack/react-query'
import { getPlayers, type Player } from '@/libs/playersApi'

const EXCLUDED_PLAYERS = ['제갈진석', '차우현']

function getTopPlayers(
  players: Player[],
  field: keyof Player,
  excludePlayers: boolean = false
): Player[] {
  if (!players.length) return []

  const filteredPlayers = excludePlayers
    ? players.filter((p) => !EXCLUDED_PLAYERS.includes(p.name))
    : players

  if (!filteredPlayers.length) return []

  const maxValue = Math.max(...filteredPlayers.map((p) => Number(p[field])))
  return filteredPlayers.filter((p) => Number(p[field]) === maxValue)
}

function TopPlayersNames({ players }: { players: Player[] }) {
  if (players.length === 0) return <span>-</span>
  if (players.length === 1) return <span>{players[0].name}</span>

  return (
    <div className="flex flex-col gap-2">
      {players.map((p) => (
        <span key={p.id}>{p.name}</span>
      ))}
    </div>
  )
}

export default function FirstPrize() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['players'],
    queryFn: getPlayers,
    refetchOnMount: true,
    staleTime: 0,
  })

  if (isLoading) return <p className="text-center py-20">불러오는 중…</p>
  if (isError || !data)
    return <p className="text-center py-20 text-red-500">데이터를 불러오지 못했습니다.</p>

  // 득점과 도움은 특정 선수 제외하고 계산
  const topGoalPlayers = getTopPlayers(data, 'goals', true)
  const topAssistPlayers = getTopPlayers(data, 'assists', true)
  const topAttendancePlayers = getTopPlayers(data, 'attendance_percent', false)

  const topGoal = topGoalPlayers[0]
  const topAssist = topAssistPlayers[0]
  const topAttendance = topAttendancePlayers[0]

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
          <h1 className="txt-20_B md:txt-32_B text-primary-500 mt-10">
            <TopPlayersNames players={topGoalPlayers} />
          </h1>
          <p className="txt-14_M md:txt-18_M text-gray-600">{topGoal?.goals ?? 0} 골</p>
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
          <h1 className="txt-20_B md:txt-32_B text-green-500 mt-10">
            <TopPlayersNames players={topAssistPlayers} />
          </h1>
          <p className="txt-14_M md:txt-18_M text-gray-600">{topAssist?.assists ?? 0} 도움</p>
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
          <h1 className="txt-20_B md:txt-32_B text-yellow-500 mt-10">
            <TopPlayersNames players={topAttendancePlayers} />
          </h1>
          <p className="txt-14_M md:txt-18_M text-gray-600">
            {topAttendance?.attendance_percent ?? 0}%
          </p>
        </div>
      </section>
    </>
  )
}
