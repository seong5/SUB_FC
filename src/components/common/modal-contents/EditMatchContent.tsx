'use client'

import { useState, ChangeEvent } from 'react'
import Button from '@/components/common/Button'

type Props = {
  initial: {
    date: string
    place: string
    score: string
    opponent: string
  }
  onClose: () => void
  onSubmit: (payload: { date: string; place: string; score: string; opponent: string }) => void
}

type Touched = {
  date: boolean
  place: boolean
  score: boolean
  opponent: boolean
}

export default function EditMatchContent({ initial, onClose, onSubmit }: Props) {
  // 초기 데이터
  const [date, setDate] = useState(initial.date ?? '')
  const [place, setPlace] = useState(initial.place ?? '')
  const [score, setScore] = useState(initial.score ?? '')
  const [opponent, setOpponent] = useState(initial.opponent ?? '')

  const [touched, setTouched] = useState<Touched>({
    date: false,
    place: false,
    score: false,
    opponent: false,
  })

  const handleDateChange = (e: ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value
    const iso = v.includes('-') ? v : ('20' + v).replaceAll('/', '-')
    setDate(iso)
  }

  const isValid =
    Boolean(date && place.trim() && score.trim() && opponent.trim()) &&
    /^\d+\s*:\s*\d+$/.test(score) // 예: "2:1" 형식 체크

  const handleSubmit = () => {
    if (!isValid) return
    onSubmit({ date, place, score, opponent })
  }

  return (
    <div className="p-6 w-320 md:w-400">
      <h2 className="text-lg font-bold mb-4 text-center">매치 정보 수정</h2>

      <div className="flex flex-col gap-3">
        <input
          type="date"
          value={date}
          onChange={handleDateChange}
          onBlur={() => setTouched((t) => ({ ...t, date: true }))}
          className="border rounded p-2"
          placeholder="날짜"
        />
        {touched.date && !date && <p className="text-red-500 text-sm">날짜를 입력하세요.</p>}

        <input
          type="text"
          value={place}
          onChange={(e) => setPlace(e.target.value)}
          onBlur={() => setTouched((t) => ({ ...t, place: true }))}
          className="border rounded p-2"
          placeholder="장소"
        />
        {touched.place && !place.trim() && (
          <p className="text-red-500 text-sm">장소를 입력하세요.</p>
        )}

        <input
          type="text"
          value={score}
          onChange={(e) => setScore(e.target.value)}
          onBlur={() => setTouched((t) => ({ ...t, score: true }))}
          className="border rounded p-2"
          placeholder="스코어 (예: 2:1)"
        />
        {touched.score && !/^\d+\s*:\s*\d+$/.test(score) && (
          <p className="text-red-500 text-sm">스코어 형식이 올바르지 않습니다. 예) 2:1</p>
        )}

        <input
          type="text"
          value={opponent}
          onChange={(e) => setOpponent(e.target.value)}
          onBlur={() => setTouched((t) => ({ ...t, opponent: true }))}
          className="border rounded p-2"
          placeholder="상대팀"
        />
        {touched.opponent && !opponent.trim() && (
          <p className="text-red-500 text-sm">상대팀을 입력하세요.</p>
        )}
      </div>

      <div className="flex justify-end gap-2 mt-5">
        <Button variant="secondary" onClick={onClose}>
          취소
        </Button>
        <Button variant="primary" onClick={handleSubmit} disabled={!isValid}>
          저장
        </Button>
      </div>
    </div>
  )
}
