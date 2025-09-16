'use client'

import { useState } from 'react'
import Button from '@/components/common/Button'
import type { PostScoresContentProps } from '@/constants/modal'
import { QuarterData, QuarterGoal } from '@/types/match'

export default function PostScoresContent({
  onBack,
  onClose,
  onSubmit,
  initial = [],
  mode = 'create',
  eligiblePlayers,
}: PostScoresContentProps & { mode?: 'create' | 'edit' }) {
  const [quarters, setQuarters] = useState<QuarterData[]>(initial)

  const addGoal = (qi: number) => {
    const goals = [...quarters[qi].goals, { scorerId: '', assistId: null }]
    update(qi, { goals })
  }

  const updateGoal = (qi: number, gi: number, patch: Partial<QuarterGoal>) => {
    const goals = quarters[qi].goals.map((g, i) => (i === gi ? { ...g, ...patch } : g))
    update(qi, { goals })
  }

  const removeGoal = (qi: number, gi: number) => {
    const goals = quarters[qi].goals.filter((_, i) => i !== gi)
    update(qi, { goals })
  }

  const update = (qi: number, patch: Partial<QuarterData>) => {
    setQuarters((prev) => prev.map((q, i) => (i === qi ? { ...q, ...patch } : q)))
  }

  return (
    <div className="px-15 py-10 w-350 md:w-400">
      <h2 className="text-lg font-bold mb-4 text-center">득점 / 도움자 등록</h2>
      {quarters.map((q, qi) => (
        <div key={qi} className="border border-gray-100 rounded-[16px] p-8 my-6">
          <div className="flex items-center py-5 justify-between">
            <div className="font-semibold">
              {qi + 1} 쿼터 (스코어 {q.scoreAfter})
            </div>
            <Button size="sm" variant="primary" onClick={() => addGoal(qi)}>
              추가
            </Button>
          </div>

          {q.goals.map((g, gi) => (
            <div key={gi} className="flex flex-row gap-20 justify-center items-center mb-2">
              <select
                className="border border-gray-100 w-100 rounded-[12px] p-2"
                value={g.scorerId}
                onChange={(e) => updateGoal(qi, gi, { scorerId: e.target.value })}
              >
                <option value="">득점</option>
                {eligiblePlayers.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
              <select
                className="border border-gray-100 w-100 rounded-[12px] p-2"
                value={g.assistId ?? ''}
                onChange={(e) => updateGoal(qi, gi, { assistId: e.target.value || null })}
              >
                <option value="">도움</option>
                {eligiblePlayers.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
              <div className="w-80 py-2">
                <Button size="xs" variant="secondary" onClick={() => removeGoal(qi, gi)}>
                  삭제
                </Button>
              </div>
            </div>
          ))}
        </div>
      ))}

      <div className="mt-10 flex gap-5 justify-evenly">
        <Button className="flex-1" size="lg" variant="secondary" onClick={onBack}>
          이전
        </Button>
        <Button className="flex-1" size="lg" variant="secondary" onClick={onClose}>
          취소
        </Button>
        <Button
          className="flex-1 text-white"
          size="lg"
          variant="primary"
          onClick={() => onSubmit(quarters)}
        >
          {mode === 'edit' ? '저장' : '완료'}
        </Button>
      </div>
    </div>
  )
}
