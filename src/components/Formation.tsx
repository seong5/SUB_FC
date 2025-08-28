'use client'

import Image from 'next/image'
import Uniform from '@/components/Uniform'

type Player = { id: number; number: number; name: string; x: number; y: number }

const F4231: Player[] = [
  { id: 1, number: 1, name: '최동민', x: 50, y: 90 },
  { id: 2, number: 2, name: '강하람', x: 25, y: 72 },
  { id: 3, number: 4, name: '주영익', x: 42, y: 76 },
  { id: 4, number: 5, name: '정수양', x: 58, y: 76 },
  { id: 5, number: 3, name: '문현준', x: 75, y: 72 },
  { id: 6, number: 6, name: '민윤기', x: 40, y: 58 },
  { id: 7, number: 8, name: '현신우', x: 60, y: 58 },
  { id: 8, number: 10, name: '유동엽', x: 50, y: 42 },
  { id: 9, number: 11, name: '윤동관', x: 28, y: 36 },
  { id: 10, number: 7, name: '고형우', x: 72, y: 36 },
  { id: 11, number: 9, name: '신성오', x: 50, y: 25 },
]

export default function FormationPage() {
  const players = F4231

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
