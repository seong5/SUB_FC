'use client'

import { useState } from 'react'
import Button from '@/components/common/Button'
import Input from '@/components/common/Input'
import type { PostQuartersContentProps } from '@/constants/modal'

type GoalEvent = { scorerId: string; assistId?: string | null }
type Quarter = { goals: GoalEvent[]; conceded: number; scoreAfter: string }

export default function PostQuarterContent({
  onBack,
  onClose,
  onSubmit,
  eligiblePlayers,
  initial,
}: PostQuartersContentProps) {
  // 초기값이 있으면 사용, 없으면 4쿼터 기본값
  const [quarters, setQuarters] = useState<Quarter[]>(
    initial ?? [
      { goals: [], conceded: 0, scoreAfter: '' },
      { goals: [], conceded: 0, scoreAfter: '' },
      { goals: [], conceded: 0, scoreAfter: '' },
      { goals: [], conceded: 0, scoreAfter: '' },
    ]
  )

  const update = (qi: number, patch: Partial<Quarter>) => {
    setQuarters((prev) => prev.map((q, i) => (i === qi ? { ...q, ...patch } : q)))
  }

  const addGoal = (qi: number) => {
    const goals = [...quarters[qi].goals, { scorerId: '', assistId: null }]
    update(qi, { goals })
  }

  const rmGoal = (qi: number, gi: number) => {
    const goals = quarters[qi].goals.filter((_, i) => i !== gi)
    update(qi, { goals })
  }

  // 간단 유효성: scoreAfter 필수, conceded >= 0, 득점자(선택된 경우)는 eligible 안에 있어야 함
  const isValid = quarters.every(
    (q) =>
      q.scoreAfter.trim() &&
      q.conceded >= 0 &&
      q.goals.every((g) => !g.scorerId || eligiblePlayers.some((p) => p.id === g.scorerId))
  )

  const handleSubmit = () => {
    if (!isValid) return
    onSubmit(quarters)
  }

  return (
    <div className="px-15 py-10 w-350 md:w-400">
      <h2 className="text-lg font-bold mb-4 text-center">쿼터별 기록</h2>
      {quarters.map((q, qi) => (
        <div key={qi} className="border border-gray-100 min-h-150 px-8 rounded-[16px] my-10">
          <div className="flex items-center justify-between gap-10 p-8 mb-2">
            <div className="font-semibold">{qi + 1} 쿼터</div>
            <Button size="xs" variant="secondary" onClick={() => addGoal(qi)}>
              득점 도움
            </Button>
          </div>

          {q.goals.map((g, gi) => (
            <div key={gi} className="grid grid-cols-2 gap-2 items-center mb-2">
              <div>
                <label className="text-xs">득점자</label>
                <select
                  className="w-full border rounded p-2"
                  value={g.scorerId}
                  onChange={(e) => {
                    const goals = [...q.goals]
                    goals[gi] = { ...goals[gi], scorerId: e.target.value }
                    update(qi, { goals })
                  }}
                >
                  <option value="">선택</option>
                  {eligiblePlayers.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs">도움자(옵션)</label>
                <select
                  className="w-full border rounded p-2"
                  value={g.assistId ?? ''}
                  onChange={(e) => {
                    const v = e.target.value || null
                    const goals = [...q.goals]
                    goals[gi] = { ...goals[gi], assistId: v }
                    update(qi, { goals })
                  }}
                >
                  <option value="">없음</option>
                  {eligiblePlayers.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-span-2 flex justify-end">
                <Button size="xs" variant="secondary" onClick={() => rmGoal(qi, gi)}>
                  삭제
                </Button>
              </div>
            </div>
          ))}
          <div className="flex flex-row justify-center gap-20 m-10">
            <Input
              id={`scoreAfter-${qi}`}
              label="쿼터 스코어"
              variant="input"
              placeholder="예: 2 - 1"
              value={q.scoreAfter}
              onChange={(e) => update(qi, { scoreAfter: e.target.value })}
              className="w-150 h-40"
            />
            <Input
              id={`conceded-${qi}`}
              label="실점"
              type="number"
              variant="input"
              value={q.conceded}
              onChange={(e) => update(qi, { conceded: Math.max(0, Number(e.target.value)) })}
              className="w-150 h-40"
            />
          </div>
        </div>
      ))}

      <div className="my-10 flex gap-5 justify-evenly">
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
          onClick={handleSubmit}
        >
          등록
        </Button>
      </div>
    </div>
  )
}
