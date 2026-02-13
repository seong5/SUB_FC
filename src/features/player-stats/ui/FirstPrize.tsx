'use client'

import React from 'react'
import { Trophy, Target, Star, Award, TrendingUp } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { getPlayers, type Player } from '@/entities/player'
import FirstPrizeSkeleton from './FirstPrizeSkeleton'

const EXCLUDED_PLAYERS = ['제갈진석', '차우현', '윤동관', '유동엽', '현신우']

function getTopPlayers(
  players: Player[],
  field: keyof Player,
  excludePlayers: boolean = false,
  minValue: number = 0,
): Player[] {
  if (!players.length) return []

  const filteredPlayers = excludePlayers
    ? players.filter((p) => !EXCLUDED_PLAYERS.includes(p.name))
    : players

  if (!filteredPlayers.length) return []

  const maxValue = Math.max(...filteredPlayers.map((p) => Number(p[field])))

  if (maxValue <= minValue) return []

  return filteredPlayers.filter((p) => Number(p[field]) === maxValue)
}

const SECTION_CONFIG = [
  {
    id: 'goals',
    title: '득점 부문',
    label: '득점',
    unit: 'GOALS',
    color: 'from-blue-600 to-indigo-600',
    glow: 'shadow-blue-500/20',
    icon: Target,
  },
  {
    id: 'assists',
    title: '도움 부문',
    label: '도움',
    unit: 'ASSISTS',
    color: 'from-emerald-600 to-teal-600',
    glow: 'shadow-emerald-500/20',
    icon: Award,
  },
  {
    id: 'attendance',
    title: '참석률 부문',
    label: '참석률',
    unit: '%',
    color: 'from-amber-500 to-orange-600',
    glow: 'shadow-amber-500/20',
    icon: TrendingUp,
  },
  {
    id: 'mom',
    title: 'MOTM',
    label: '최다 MOM',
    unit: 'TIMES',
    color: 'from-purple-600 to-pink-600',
    glow: 'shadow-purple-500/20',
    icon: Star,
  },
] as const

type FirstPrizeProps = {
  /** 서버에서 미리 가져온 선수 목록 (서버 컴포넌트에서 전달 시 LCP 개선) */
  initialPlayers?: Player[] | null
}

export default function FirstPrize({ initialPlayers }: FirstPrizeProps) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['players'],
    queryFn: getPlayers,
    refetchOnMount: true,
    staleTime: 0,
  })

  const players = initialPlayers ?? data

  if (players == null && isLoading) return <FirstPrizeSkeleton />
  if (players == null && (isError || !data))
    return (
      <p className="text-center py-20 text-red-400 bg-[#020617]">데이터를 불러오지 못했습니다.</p>
    )

  const list = players ?? []
  const topGoalPlayers = getTopPlayers(list, 'goals', true)
  const topAssistPlayers = getTopPlayers(list, 'assists', true)
  const topAttendancePlayers = getTopPlayers(list, 'attendance_percent', false)
  const topMomPlayers = getTopPlayers(list, 'mom', false, 0)

  const topGoal = topGoalPlayers[0]
  const topAssist = topAssistPlayers[0]
  const topAttendance = topAttendancePlayers[0]
  const topMom = topMomPlayers[0]

  const sections = [
    {
      ...SECTION_CONFIG[0],
      players: topGoalPlayers,
      value: String(topGoal?.goals ?? 0),
    },
    {
      ...SECTION_CONFIG[1],
      players: topAssistPlayers,
      value: String(topAssist?.assists ?? 0),
    },
    {
      ...SECTION_CONFIG[2],
      players: topAttendancePlayers,
      value: String(topAttendance?.attendance_percent ?? 0),
    },
    {
      ...SECTION_CONFIG[3],
      players: topMomPlayers,
      value: String(topMom?.mom ?? 0),
    },
  ]

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
          <p className="mt-6 text-slate-400 font-bold text-xs uppercase tracking-[0.5em] opacity-90">
            부문별 최우수 선수 리스트
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {sections.map((section) => {
            const Icon = section.icon
            return (
              <div key={section.id} className="group relative">
                <div
                  className={`absolute -inset-0.5 bg-gradient-to-br ${section.color} rounded-[32px] blur-xl opacity-0 group-hover:opacity-20 transition duration-700`}
                />
                <div className="relative bg-slate-900/40 backdrop-blur-2xl border border-white/5 p-12 rounded-[32px] h-full flex flex-col justify-between overflow-hidden">
                  <div>
                    <div className="flex items-center gap-10 mb-8">
                      <div
                        className={`p-3 rounded-2xl bg-gradient-to-br ${section.color} ${section.glow} shadow-lg`}
                      >
                        <Icon size={24} className="text-white" />
                      </div>
                      <span className="text-[13px] font-bold text-slate-400 uppercase tracking-widest">
                        {section.title}
                      </span>
                    </div>

                    <h2 className="text-slate-300 font-bold text-xs uppercase tracking-widest mb-4">
                      {section.label}
                    </h2>

                    <div className="space-y-1">
                      {section.players.length === 0 ? (
                        <p className="text-3xl font-bold text-white tracking-tight italic uppercase">
                          -
                        </p>
                      ) : (
                        section.players.map((player) => (
                          <h3
                            key={player.id}
                            className="text-3xl font-bold text-white tracking-tight italic uppercase"
                          >
                            {player.name}
                          </h3>
                        ))
                      )}
                    </div>
                  </div>

                  <div className="mt-10 pt-6 border-t border-white/5 flex items-baseline gap-1.5">
                    <span className="text-4xl font-black text-white italic">{section.value}</span>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      {section.unit}
                    </span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
