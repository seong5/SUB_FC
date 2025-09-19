'use client'

import { useMemo, useState } from 'react'
import Button from '@/components/common/Button'
import type { PostRosterContentProps } from '@/constants/modal'

// 포지션/포메이션 유틸
const POSITIONS = ['GK', 'DF', 'MF', 'FW'] as const
type Position = (typeof POSITIONS)[number]
const FORMATIONS = ['4-4-2', '4-2-3-1'] as const
type Formation = (typeof FORMATIONS)[number]

export default function PostRosterContent({
  onBack,
  onClose,
  onSubmit,
  players,
  initial,
  mode = 'create',
}: PostRosterContentProps & { mode?: 'create' | 'edit' }) {
  // 초기값 세팅 (없으면 기본값)
  const [formation, setFormation] = useState<Formation>(initial?.formation ?? '4-2-3-1')
  const [roster, setRoster] = useState<Record<Position, string[]>>({
    GK: initial?.GK ?? [],
    DF: initial?.DF ?? [],
    MF: initial?.MF ?? [],
    FW: initial?.FW ?? [],
  })

  // 포지션별 선수 그룹
  const grouped = useMemo(() => {
    return {
      GK: players.filter((p) => p.position === 'GK'),
      DF: players.filter((p) => p.position === 'DF'),
      MF: players.filter((p) => p.position === 'MF'),
      FW: players.filter((p) => p.position === 'FW'),
    }
  }, [players])

  // 선택 변경
  const setPos = (pos: Position, ids: string[]) => setRoster((prev) => ({ ...prev, [pos]: ids }))

  // 간단 검증: GK 최소 1명 (필요 시 포메이션별 정확 인원 수 검증 로직 추가 가능)
  const isValid = roster.GK.length >= 1

  const handleNext = () => {
    if (!isValid) return
    onSubmit({
      formation,
      GK: roster.GK,
      DF: roster.DF,
      MF: roster.MF,
      FW: roster.FW,
    })
  }

  return (
    <div className="px-15 py-10 w-350 md:w-400">
      <h2 className="text-lg font-bold mb-4 text-center">참석자 / 포메이션</h2>

      <div className="flex flex-col gap-10">
        {/* 포메이션 */}
        <div>
          <label className="block mb-1 text-sm font-medium">포메이션</label>
          <select
            className="w-full card-shadow border border-gray-100 rounded-[16px] p-10"
            value={formation}
            onChange={(e) => setFormation(e.target.value as Formation)}
          >
            {FORMATIONS.map((f) => (
              <option key={f} value={f}>
                {f}
              </option>
            ))}
          </select>
        </div>

        {/* 포지션별 멀티선택 */}
        {POSITIONS.map((pos) => (
          <div key={pos}>
            <label className="block mb-1 text-sm font-medium">{pos}</label>
            <select
              multiple
              className="w-full card-shadow border border-gray-100 rounded-[16px] p-10 min-h-[60px]"
              value={roster[pos]}
              onChange={(e) => {
                const ids = Array.from(e.target.selectedOptions).map((o) => o.value)
                setPos(pos, ids)
              }}
            >
              {grouped[pos].map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>

      <div className="my-20 flex gap-5 justify-evenly">
        <Button className="flex-1 py-2" size="lg" variant="secondary" onClick={onBack}>
          이전
        </Button>
        <Button className="flex-1 py-2" size="lg" variant="secondary" onClick={onClose}>
          취소
        </Button>
        <Button
          className="flex-1 text-white py-2"
          size="lg"
          variant="primary"
          disabled={!isValid}
          onClick={handleNext}
        >
          {mode === 'edit' ? '다음' : '저장'}
        </Button>
      </div>
    </div>
  )
}
