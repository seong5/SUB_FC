'use client'

import { useMemo, useState } from 'react'
import Image from 'next/image'
import Uniform from '@/components/matches/Uniform'
import { playersRoster } from '@/mocks/playersRoster'
import { FORMATIONS, FormationKey } from '@/constants/formation'
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
  const currentFormation: FormationKey = '4-4-2'
  const spots = FORMATIONS[currentFormation]

  // 화면 배치용 (유니폼 위치)
  const players = useMemo(() => {
    return spots.map((s, idx) => {
      const rp = playersRoster[idx]
      return {
        id: idx,
        name: rp?.name ?? 'N/A',
        number: rp?.backNumber ?? 0,
        x: s.x,
        y: s.y,
      }
    })
  }, [spots])

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
      <main className="grid grid-cols-1 md:grid-cols-[400px_640px] md:px-30 md:py-20">
        <aside>
          <QuarterFilterSkeleton />
        </aside>
        <div className="flex justify-center items-center w-full">
          <div className="relative aspect-square w-[100vw] max-w-[640px]">
            <Image
              src="/pitch.svg"
              alt="pitch"
              fill
              className="object-contain rotate-90 "
              priority
            />
          </div>
        </div>
      </main>
    )
  }

  // input[type="date"]에 맞게 yyyy-MM-dd (ISO면 앞 10자리)
  const dateForInput = (detail.date ?? '').slice(0, 10)

  return (
    <main className="grid grid-cols-1 md:grid-cols-[400px_640px] md:px-30 md:py-20">
      <aside>
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
      </aside>
      <div className="flex justify-center items-center w-full">
        <div className="relative aspect-square w-[100vw] max-w-[640px]">
          <Image src="/pitch.svg" alt="pitch" fill className="object-contain rotate-90 " priority />
          {players.map((p) => (
            <Uniform key={p.id} number={p.number} name={p.name} x={p.x} y={p.y} />
          ))}
        </div>
      </div>
    </main>
  )
}
