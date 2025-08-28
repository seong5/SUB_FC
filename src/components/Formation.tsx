'use client'

import { useMemo, useState } from 'react'
import Image from 'next/image'
import Uniform from '@/components/Uniform'
import { playersRoster } from '@/mocks/playersRoster'
import { FORMATIONS, FormationKey } from '@/constants/formation'
import QuarterFilter from './QuarterFilter'

export default function FormationPage() {
  const [selectedQuarterLabel, setSelectedQuarterLabel] = useState<string>('1 쿼터')
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

  return (
    <main className="grid grid-cols-[400px_640px] px-30 py-20">
      <aside className="px-20">
        <QuarterFilter selectedType={selectedQuarterLabel} onChange={setSelectedQuarterLabel} />
      </aside>
      <div className="relative aspect-square w-[90vw] max-w-[640px]">
        <Image src="/pitch.svg" alt="pitch" fill className="object-contain rotate-90" priority />
        {players.map((p) => (
          <Uniform key={p.id} number={p.number} name={p.name} x={p.x} y={p.y} />
        ))}
      </div>
    </main>
  )
}
