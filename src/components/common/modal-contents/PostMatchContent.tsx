'use client'

import { useEffect, useMemo, useState, ChangeEvent } from 'react'
import type { PostMatchProps } from '@/constants/modal'
import Button from '@/components/common/Button'
import Input from '@/components/common/Input'

type Touched = {
  date: boolean
  place: boolean
  score: boolean
  opponent: boolean
}

export function PostMatchContent({ mode = 'create', initial, onClose, onSubmit }: PostMatchProps) {
  const safe = useMemo(
    () => ({
      date: initial?.date ?? '',
      place: initial?.place ?? '',
      score: initial?.score ?? '',
      opponent: initial?.opponent ?? '',
    }),
    [initial]
  )

  const [date, setDate] = useState(safe.date)
  const [place, setPlace] = useState(safe.place)
  const [score, setScore] = useState(safe.score)
  const [opponent, setOpponent] = useState(safe.opponent)

  useEffect(() => {
    setDate(safe.date)
    setPlace(safe.place)
    setScore(safe.score)
    setOpponent(safe.opponent)
  }, [safe])

  const [touched, setTouched] = useState<Touched>({
    date: false,
    place: false,
    score: false,
    opponent: false,
  })

  // 날짜 인풋 (date-custom 대응)
  const handleDateChange = (e: ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value
    const iso = v.includes('-') ? v : ('20' + v).replaceAll('/', '-')
    setDate(iso)
  }

  // 스코어 형식: 2-1 또는 2:1 허용
  const SCORE_RE = /^\d+\s*[:\-]\s*\d+$/

  const isValid =
    Boolean(date && place.trim() && score.trim() && opponent.trim()) && SCORE_RE.test(score)

  const submit = () => {
    // 터치 플래그 모두 true → 에러 메시지 노출
    setTouched({ date: true, place: true, score: true, opponent: true })
    if (!isValid) return
    const normalizedScore = score.replace(/\s+/g, '')
    onSubmit({ date, opponent, place, score: normalizedScore })
  }

  return (
    <div className="px-15 py-10 w-350 md:w-400">
      <h2 className="text-lg font-bold mb-4 text-center">
        {mode === 'edit' ? '경기 수정' : '경기 등록'}
      </h2>

      <div className="flex flex-col gap-20">
        <Input
          id="match-date"
          label="날짜"
          variant="date-custom"
          value={date}
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
          placeholder="예시: 2-1 또는 2:1"
          errorMessage={
            touched.score && !SCORE_RE.test(score || '')
              ? '스코어 형식이 올바르지 않습니다. 예: 2-1 또는 2:1'
              : undefined
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
          {mode === 'edit' ? '저장' : '다음'}
        </Button>
      </div>
    </div>
  )
}
