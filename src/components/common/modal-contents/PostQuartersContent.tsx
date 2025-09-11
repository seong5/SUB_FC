'use client'

import { useState } from 'react'
import Button from '@/components/common/Button'
import Input from '@/components/common/Input'
import type { PostQuartersContentProps } from '@/constants/modal'
import { QuarterData } from '@/types/match'

export default function PostQuartersContent({
  onBack,
  onClose,
  onSubmit,
  initial,
}: PostQuartersContentProps) {
  const [quarters, setQuarters] = useState<QuarterData[]>(
    initial ?? [
      { quarter: 1, goals: [], conceded: 0, scoreAfter: '' },
      { quarter: 2, goals: [], conceded: 0, scoreAfter: '' },
      { quarter: 3, goals: [], conceded: 0, scoreAfter: '' },
      { quarter: 4, goals: [], conceded: 0, scoreAfter: '' },
    ]
  )

  const update = (qi: number, patch: Partial<QuarterData>) => {
    setQuarters((prev) => prev.map((q, i) => (i === qi ? { ...q, ...patch } : q)))
  }
  const isValid = quarters.every((q) => q.scoreAfter.trim() && q.conceded >= 0)

  return (
    <div className="px-15 py-10 w-350 md:w-400">
      <h2 className="text-lg font-bold mb-4 text-center">쿼터별 스코어 & 실점</h2>
      {quarters.map((q, qi) => (
        <div key={qi} className="h-130 border border-gray-100 rounded-[16px] p-6 my-6">
          <div className="font-semibold mb-4 text-center">{qi + 1} 쿼터</div>
          <div className="flex flex-row justify-center gap-20">
            <Input
              id={`scoreAfter-${qi}`}
              label="쿼터 스코어"
              variant="input"
              placeholder="예: 2-1"
              value={q.scoreAfter}
              onChange={(e) => update(qi, { scoreAfter: e.target.value })}
              className="w-150 h-30"
            />
            <Input
              id={`conceded-${qi}`}
              label="실점"
              type="number"
              variant="input"
              value={q.conceded}
              onChange={(e) => update(qi, { conceded: Math.max(0, Number(e.target.value)) })}
              className="w-150 h-30"
            />
          </div>
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
          disabled={!isValid}
          onClick={() => onSubmit(quarters)}
        >
          다음
        </Button>
      </div>
    </div>
  )
}
