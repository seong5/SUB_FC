'use client'

import { useMemo, useState, ChangeEvent } from 'react'
import type { PostMatchProps } from '@/constants/modal'
import Button from './Button'
import Input from '@/components/Input' // 경로는 프로젝트에 맞게 조정

export function PostMatchContent({ onClose, onSubmit }: PostMatchProps) {
  const [date, setDate] = useState('') // YYYY-MM-DD로 저장
  const [place, setPlace] = useState('')
  const [score, setScore] = useState('') // 예: "2-1"
  const [opponent, setOpponent] = useState('')

  // 간단 유효성
  const errors = useMemo(() => {
    const es: Record<string, string | undefined> = {}
    if (!date) es.date = '날짜를 선택해 주세요.'
    if (!place.trim()) es.place = '장소를 입력해 주세요.'
    if (!score.trim()) es.score = '스코어를 입력해 주세요. (예: 2-1)'
    if (!opponent.trim()) es.opponent = '상대팀을 입력해 주세요.'
    return es
  }, [date, place, score, opponent])

  const isValid = useMemo(() => Object.values(errors).every((v) => !v), [errors])

  // date-custom은 두 가지 onChange 경로(텍스트/숨겨진 date)를 모두 보내므로 형식을 통일
  const handleDateChange = (e: ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value
    // 숨겨진 <input type="date"> 이벤트면 YYYY-MM-DD 형태로 옴
    // 텍스트 입력(yy/mm/dd)이면 '20' 접두 + '/'→'-' 치환
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
        {/* 날짜: 커스텀 날짜 인풋 */}
        <Input
          id="match-date"
          label="날짜"
          variant="date-custom"
          onChange={handleDateChange}
          errorMessage={errors.date}
        />
        {/* 장소 */}
        <Input
          id="match-place"
          label="장소"
          variant="input"
          type="text"
          value={place}
          onChange={(e) => setPlace(e.target.value)}
          placeholder="예: 목동운동장 보조구장"
          errorMessage={errors.place}
        />
        {/* 스코어 */}
        <Input
          id="match-score"
          label="스코어"
          variant="input"
          type="text"
          value={score}
          onChange={(e) => setScore(e.target.value)}
          placeholder="예: 2-1"
          errorMessage={errors.score}
        />
        {/* 상대팀 */}
        <Input
          id="match-opponent"
          label="상대팀"
          variant="input"
          type="text"
          value={opponent}
          onChange={(e) => setOpponent(e.target.value)}
          placeholder="예: FC 스타즈"
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
