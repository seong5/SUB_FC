'use client'

import Image from 'next/image'
import { useQuery } from '@tanstack/react-query'
import { getPlayers, type Player } from '@/libs/playersApi'
import FirstPrizeSkeleton from './FirstPrizeSkeleton'

const EXCLUDED_PLAYERS = ['제갈진석', '차우현']

function getTopPlayers(
  players: Player[],
  field: keyof Player,
  excludePlayers: boolean = false,
  minValue: number = 0
): Player[] {
  if (!players.length) return []

  const filteredPlayers = excludePlayers
    ? players.filter((p) => !EXCLUDED_PLAYERS.includes(p.name))
    : players

  if (!filteredPlayers.length) return []

  const maxValue = Math.max(...filteredPlayers.map((p) => Number(p[field])))

  // 최대값이 최소값보다 작거나 같으면 빈 배열 반환 (1위 없음)
  if (maxValue <= minValue) return []

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

  if (isLoading) return <FirstPrizeSkeleton />
  if (isError || !data)
    return <p className="text-center py-20 text-red-500">데이터를 불러오지 못했습니다.</p>

  // 득점과 도움은 특정 선수 제외하고 계산
  const topGoalPlayers = getTopPlayers(data, 'goals', true)
  const topAssistPlayers = getTopPlayers(data, 'assists', true)
  const topAttendancePlayers = getTopPlayers(data, 'attendance_percent', false)
  // MOM은 0보다 큰 경우만 1위 표시 (모두 0이면 표시 안 함)
  const topMomPlayers = getTopPlayers(data, 'mom', false, 0)

  const topGoal = topGoalPlayers[0]
  const topAssist = topAssistPlayers[0]
  const topAttendance = topAttendancePlayers[0]
  const topMom = topMomPlayers[0]

  return (
    <section className="bg-sub-gray rounded-t-[16px] py-10">
      <div className="bg-white m-20 rounded-[16px]">
        <h1 className="text-center text-[30px] md:text-[60px] pt-10 font-bold">
          SUB FC <br />
          부문별 1위
        </h1>
        <article className="text-center flex flex-row p-15 justify-center items-center gap-30">
          <div className="flex flex-col gap-5">
            <Image
              src="/score-icon.png"
              alt="득점"
              width={80}
              height={80}
              className="w-50 h-50 md:w-80 md:h-80"
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
              width={80}
              height={80}
              className="w-50 h-50 md:w-80 md:h-80"
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
              width={80}
              height={80}
              className="w-50 h-50 md:w-80 md:h-80"
            />
            <h3 className="txt-16_B md:txt-24_B">참석률</h3>
            <h1 className="txt-20_B md:txt-32_B text-yellow-500 mt-10">
              <TopPlayersNames players={topAttendancePlayers} />
            </h1>
            <p className="txt-14_M md:txt-18_M text-gray-600">
              {topAttendance?.attendance_percent ?? 0}%
            </p>
          </div>
          <div className="flex flex-col gap-5">
            <Image
              src="/motm-icon.png"
              alt="MOM"
              width={80}
              height={80}
              className="w-50 h-50 md:w-80 md:h-80"
            />
            <h3 className="txt-16_B md:txt-24_B">MOM</h3>
            <h1 className="txt-20_B md:txt-32_B text-orange mt-10">
              <TopPlayersNames players={topMomPlayers} />
            </h1>
            <p className="txt-14_M md:txt-18_M text-gray-600">{topMom?.mom ?? 0} 회</p>
          </div>
        </article>
      </div>
    </section>
  )
}
