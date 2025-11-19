'use client'

import { useTeamStatsQuery } from '@/hooks/useTeams'

export default function WinRate() {
  const { data: stats, isLoading, error } = useTeamStatsQuery()

  if (isLoading) {
    return (
      <section className="bg-white rounded-[16px] p-20 text-[25px] md:text-[50px] font-bold text-center">
        <p>로딩 중...</p>
      </section>
    )
  }

  if (error) {
    return (
      <section className="bg-white rounded-[16px] p-20 text-[25px] md:text-[50px] font-bold text-center">
        <p className="text-red-500">데이터를 불러오는 중 오류가 발생했습니다.</p>
      </section>
    )
  }

  const { totalMatches = 0, wins = 0, draws = 0, losses = 0, winRate = 0 } = stats ?? {}

  return (
    <section className="bg-white rounded-[16px] p-20 text-[25px] md:text-[50px] font-bold text-center">
      <h1>2025 SUB FC</h1>
      <h2>전체 경기</h2>
      <h3>{totalMatches} 경기</h3>
      <div className="flex flex-row gap-10 text-[18px] md:text-[25px] font-bold justify-center items-center">
        <div>
          <h2 className="text-blue-500">승리</h2>
          <h2>{wins}</h2>
        </div>
        <div>
          <h2 className="text-green-500">무승부</h2>
          <h2>{draws}</h2>
        </div>
        <div>
          <h2 className="text-red-500">패배</h2>
          <h2>{losses}</h2>
        </div>
      </div>
      <h1>승률 {winRate} %</h1>
    </section>
  )
}
