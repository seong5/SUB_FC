'use client'

import Image from 'next/image'
import Uniform from '@/components/Uniform'
import { playersRoster } from '@/mocks/playersRoster'

type Spot = { id: number; name: string; x: number; y: number }

// 포메이션 좌표 - 이름만 넣어두고 번호는 로스터에서 가져오기
const f4231: Spot[] = [
  { id: 1, name: '최동민', x: 50, y: 90 },
  { id: 2, name: '강하람', x: 25, y: 72 },
  { id: 3, name: '주영익', x: 42, y: 76 },
  { id: 4, name: '정수양', x: 58, y: 76 },
  { id: 5, name: '문현준', x: 75, y: 72 },
  { id: 6, name: '민윤기', x: 40, y: 58 },
  { id: 7, name: '현신우', x: 60, y: 58 },
  { id: 8, name: '제갈진석', x: 50, y: 42 },
  { id: 9, name: '윤동관', x: 28, y: 36 },
  { id: 10, name: '고형우', x: 72, y: 36 },
  { id: 11, name: '신성오', x: 50, y: 25 },
]

export default function FormationPage() {
  const rosterMap = new Map(playersRoster.map((p) => [p.name, p.backNumber]))
  //포메이션이랑 로스터에서 가져오기
  const players = f4231.map((s) => ({
    id: s.id,
    name: s.name,
    number: rosterMap.get(s.name) ?? 0,
    x: s.x,
    y: s.y,
  }))

  return (
    <main className="flex items-center justify-center py-10">
      <div className="relative aspect-square w-[90vw] max-w-640">
        <Image src="/pitch.svg" alt="pitch" fill className="object-contain rotate-90" priority />
        {players.map((p) => (
          <Uniform key={p.id} number={p.number} name={p.name} x={p.x} y={p.y} size={70} />
        ))}
      </div>
    </main>
  )
}
