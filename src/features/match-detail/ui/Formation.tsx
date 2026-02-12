'use client'

import { useState } from 'react'
import { playersRoster } from '@/mocks/playersRoster'
import QuarterFilter from './QuarterFilter'
import QuarterFilterSkeleton from './QuarterFilterSkeleton'
import ScoreAndAssist, { normalizeSummary } from './ScoreAndAssist'
import ScoreAndAssistSkeleton from './ScoreAndAssistSkeleton'
import { QuarterLabel } from '@/mocks/QuarterScores'
import { useParams } from 'next/navigation'
import { getMatchDetailFull } from '@/entities/match'
import { useQuery } from '@tanstack/react-query'
import type { PlayerLite } from '@/entities/match'

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
    data: detailFull,
    isPending,
    refetch,
  } = useQuery({
    queryKey: ['match', matchId],
    queryFn: () => getMatchDetailFull(matchId),
    staleTime: 0,
    refetchOnMount: true,
  })

  if (isPending || !detailFull) {
    return (
      <main className="md:px-30 md:py-20 max-w-[400px] mx-auto">
        <QuarterFilterSkeleton />
        <ScoreAndAssistSkeleton />
      </main>
    )
  }

  const dateForInput = (detailFull.date ?? '').slice(0, 10)
  const matchSummary = normalizeSummary(detailFull)

  return (
    <main className="md:px-30 md:py-20 max-w-[400px] mx-auto">
      <QuarterFilter
        selectedType={selectedQuarterLabel}
        onChange={setSelectedQuarterLabel}
        matchId={matchId}
        initialMatch={{
          date: dateForInput,
          place: detailFull.place,
          score: detailFull.finalScore,
          opponent: detailFull.opponent,
        }}
        players={eligiblePlayers}
        onRefetch={() => refetch()}
      />
      <ScoreAndAssist data={matchSummary} selectedLabel={selectedQuarterLabel} />
    </main>
  )
}
