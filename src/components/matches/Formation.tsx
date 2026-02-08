'use client'

import { useState } from 'react'
import { playersRoster } from '@/mocks/playersRoster'
import QuarterFilter from './QuarterFilter'
import QuarterFilterSkeleton from './QuarterFilterSkeleton'
import ScoreAndAssist from './ScoreAndAssist'
import { QuarterLabel } from '@/mocks/QuarterScores'
import { useParams } from 'next/navigation'
import { getMatchDetail } from '@/libs/matchesApi'
import { useQuery } from '@tanstack/react-query'
import type { PlayerLite } from '@/types/match'

export default function FormationPage() {
  const params = useParams<{ matchId: string }>()
  const matchId = Number(params.matchId)
  const [selectedQuarterLabel, setSelectedQuarterLabel] = useState<QuarterLabel | ''>('1 쿼터')

  const eligiblePlayers: PlayerLite[] = playersRoster.map((p) => ({
    id: String(p.id),
    name: p.name,
    position: p.position, // 'GK' | 'DF' | 'MF' | 'FW'
  }))

  const {
    data: detail,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['match', matchId],
    queryFn: () => getMatchDetail(matchId),
  })

  if (isLoading || !detail) {
    return (
      <main className="md:px-30 md:py-20 max-w-[400px] mx-auto">
        <QuarterFilterSkeleton />
      </main>
    )
  }

  // input[type="date"]에 맞게 yyyy-MM-dd (ISO면 앞 10자리)
  const dateForInput = (detail.date ?? '').slice(0, 10)

  return (
    <main className="md:px-30 md:py-20 max-w-[400px] mx-auto">
      <QuarterFilter
        selectedType={selectedQuarterLabel}
        onChange={setSelectedQuarterLabel}
        matchId={matchId}
        initialMatch={{
          date: dateForInput,
          place: detail.place,
          score: detail.score,
          opponent: detail.opponent,
        }}
        players={eligiblePlayers}
        onRefetch={() => refetch()}
      />
      <ScoreAndAssist matchId={matchId} selectedLabel={selectedQuarterLabel} />
    </main>
  )
}
