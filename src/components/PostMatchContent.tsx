'use client'

import { useMemo, useState, ChangeEvent } from 'react'
import type { PostMatchProps } from '@/constants/modal'
import Button from '@/components/Button'
import Input from '@/components/Input'

export function PostMatchContent({ onClose, onSubmit }: PostMatchProps) {
  const [date, setDate] = useState('') // YYYY-MM-DD
  const [place, setPlace] = useState('')
  const [score, setScore] = useState('')
  const [opponent, setOpponent] = useState('')

  const errors = useMemo(() => {
    const es: Record<string, string | undefined> = {}
    if (!date) es.date = '날짜를 선택해 주세요.'
    if (!place.trim()) es.place = '장소를 입력해 주세요.'
    if (!score.trim()) es.score = '스코어를 입력해 주세요. (예: 2-1)'
    if (!opponent.trim()) es.opponent = '상대팀을 입력해 주세요.'
    return es
  }, [date, place, score, opponent])

  const isValid = useMemo(() => Object.values(errors).every((v) => !v), [errors])

  // date-custom의 onChange는 두 경로(텍스트/숨겨진 date) 모두 들어오므로 ISO로 통일
  const handleDateChange = (e: ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value
    const iso = v.includes('-') ? v : ('20' + v).replaceAll('/', '-')
    setDate(iso)
  }

  const submit = () => {
    if (!isValid) return
    onSubmit({ date, opponent, place, score })
    onClose()
  }

  return (
    <div className="p-6 w-320 md:w-400">
      <h2 className="text-lg font-bold mb-4 text-center">경기 등록</h2>
      <div className="flex flex-col gap-3">
        <Input
          id="match-date"
          label="날짜"
          variant="date-custom"
          onChange={handleDateChange}
          errorMessage={errors.date}
        />
        <Input
          id="match-place"
          label="장소"
          variant="input"
          type="text"
          value={place}
          onChange={(e) => setPlace(e.target.value)}
          placeholder="예시: 다락원"
          errorMessage={errors.place}
        />
        <Input
          id="match-score"
          label="스코어"
          variant="input"
          type="text"
          value={score}
          onChange={(e) => setScore(e.target.value)}
          placeholder="예시: 5:3"
          errorMessage={errors.score}
        />
        <Input
          id="match-opponent"
          label="상대팀"
          variant="input"
          type="text"
          value={opponent}
          onChange={(e) => setOpponent(e.target.value)}
          placeholder="예시: SUBFC"
          errorMessage={errors.opponent}
        />
      </div>

      <div className="mt-6 flex gap-3">
        <Button className="flex-1 py-2" variant="secondary" onClick={onClose}>
          취소
        </Button>
        <Button
          className="flex-1 text-white py-2"
          variant="primary"
          disabled={!isValid}
          onClick={submit}
        >
          등록
        </Button>
      </div>
    </div>
  )
}
