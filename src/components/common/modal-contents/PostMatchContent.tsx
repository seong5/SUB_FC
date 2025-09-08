'use client'

import { useState, ChangeEvent } from 'react'
import type { PostMatchProps } from '@/constants/modal'
import Button from '@/components/common/Button'
import Input from '@/components/common/Input'

type Touched = {
  date: boolean
  place: boolean
  score: boolean
  opponent: boolean
}
export function PostMatchContent({ onClose, onSubmit }: PostMatchProps) {
  const [date, setDate] = useState('')
  const [place, setPlace] = useState('')
  const [score, setScore] = useState('')
  const [opponent, setOpponent] = useState('')

  const [touched, setTouched] = useState<Touched>({
    date: false,
    place: false,
    score: false,
    opponent: false,
  })
  // date-custom 인풋
  const handleDateChange = (e: ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value
    const iso = v.includes('-') ? v : ('20' + v).replaceAll('/', '-')
    setDate(iso)
  }
  const isValid = Boolean(date && place.trim() && score.trim() && opponent.trim())
  const submit = () => {
    // 최종 제출 시 빈 값 있으면 에러가 보이도록 touched 전부 true 처리
    setTouched({ date: true, place: true, score: true, opponent: true })
    if (!isValid) return
    onSubmit({ date, opponent, place, score })
  }

  return (
    <div className="px-15 py-10 w-350 md:w-400">
      <h2 className="text-lg font-bold mb-4 text-center">경기 등록</h2>
      <div className="flex flex-col gap-20">
        <Input
          id="match-date"
          label="날짜"
          variant="date-custom"
          onChange={handleDateChange}
          onBlur={() => setTouched((t) => ({ ...t, date: true }))}
          errorMessage={!date && touched.date ? '날짜를 선택해 주세요.' : undefined}
        />
        <Input
          id="match-place"
          label="장소"
          variant="input"
          type="text"
          value={place}
          onChange={(e) => setPlace(e.target.value)}
          onBlur={() => setTouched((t) => ({ ...t, place: true }))}
          placeholder="예시: 다락원"
          errorMessage={!place.trim() && touched.place ? '장소를 입력해 주세요.' : undefined}
        />
        <Input
          id="match-score"
          label="스코어"
          variant="input"
          type="text"
          value={score}
          onChange={(e) => setScore(e.target.value)}
          onBlur={() => setTouched((t) => ({ ...t, score: true }))}
          placeholder="예시: 5:3"
          errorMessage={
            !score.trim() && touched.score ? '스코어를 입력해 주세요. (예: 2-1)' : undefined
          }
        />
        <Input
          id="match-opponent"
          label="상대팀"
          variant="input"
          type="text"
          value={opponent}
          onChange={(e) => setOpponent(e.target.value)}
          onBlur={() => setTouched((t) => ({ ...t, opponent: true }))}
          placeholder="예시: SUBFC"
          errorMessage={
            !opponent.trim() && touched.opponent ? '상대팀을 입력해 주세요.' : undefined
          }
        />
      </div>
      <div className="my-20 flex gap-5 justify-evenly">
        <Button className="flex-1 py-2" size="lg" variant="secondary" onClick={onClose}>
          취소
        </Button>
        <Button
          className="flex-1 text-white py-2"
          size="lg"
          variant="primary"
          disabled={!isValid}
          onClick={submit}
        >
          다음
        </Button>
      </div>
    </div>
  )
}
