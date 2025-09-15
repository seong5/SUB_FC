'use client'

import { useMemo, useState } from 'react'
import Image from 'next/image'
import Uniform from '@/components/matches/Uniform'
import { playersRoster } from '@/mocks/playersRoster'
import { FORMATIONS, FormationKey } from '@/constants/formation'
import QuarterFilter from './QuarterFilter'
import ScoreAndAssist from './ScoreAndAssist'
import { QuarterLabel } from '@/mocks/QuarterScores'
import { useParams } from 'next/navigation'
import { getMatchDetail } from '@/libs/matchesApi'
import { useQuery } from '@tanstack/react-query'

export default function FormationPage() {
  const params = useParams<{ matchId: string }>()
  const matchId = Number(params.matchId)
  const [selectedQuarterLabel, setSelectedQuarterLabel] = useState<QuarterLabel | ''>('1 쿼터')
  const currentFormation: FormationKey = '4-4-2'
  const spots = FORMATIONS[currentFormation]

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

  const {
    data: detail,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['match', matchId],
    queryFn: () => getMatchDetail(matchId),
  })

  if (isLoading || !detail) return <div className="p-6">로딩 중…</div>

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
          onRefetch={() => refetch()}
        />
        <ScoreAndAssist matchId={Number(params.matchId)} selectedLabel={selectedQuarterLabel} />
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
