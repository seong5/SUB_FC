'use client'

import Image from 'next/image'
import Uniform from '@/components/Uniform'
import { playersRoster } from '@/mocks/playersRoster'
import { FORMATIONS, FormationKey } from '@/constants/formation'

export default function FormationPage() {
  const currentFormation: FormationKey = '4-3-3'
  const spots = FORMATIONS[currentFormation]
  // roster를 role에 매칭시킬 수 있는 로직
  const players = spots.map((s, idx) => {
    const rosterPlayer = playersRoster[idx]
    return {
      id: idx,
      name: rosterPlayer?.name ?? 'N/A',
      number: rosterPlayer?.backNumber ?? 0,
      x: s.x,
      y: s.y,
    }
  })

  return (
    <main className="flex items-center justify-center py-10">
      <div className="relative aspect-square w-[90vw] max-w-[640px]">
        <Image src="/pitch.svg" alt="pitch" fill className="object-contain rotate-90" priority />
        {players.map((p) => (
          <Uniform key={p.id} number={p.number} name={p.name} x={p.x} y={p.y} size={70} />
        ))}
      </div>
    </main>
  )
}
