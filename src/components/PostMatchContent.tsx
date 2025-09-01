'use client'
import { useState } from 'react'
import type { PostMatchProps } from '@/constants/modal'
import Button from './Button'

export function PostMatchContent({ onClose, onSubmit }: PostMatchProps) {
  const [date, setDate] = useState('')
  const [opponent, setOpponent] = useState('')
  const [place, setPlace] = useState('')
  const [score, setScore] = useState('')

  return (
    <div className="p-6 w-320 md:w-400">
      <h2 className="text-lg font-bold mb-4 text-center">경기 등록</h2>

      <div className="flex flex-col gap-3">
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="border rounded p-2"
          placeholder="날짜"
        />
        <input
          type="text"
          value={place}
          onChange={(e) => setPlace(e.target.value)}
          className="border rounded p-2"
          placeholder="장소"
        />
        <input
          type="text"
          value={score}
          onChange={(e) => setScore(e.target.value)}
          className="border rounded p-2"
          placeholder="스코어"
        />
        <input
          type="text"
          value={opponent}
          onChange={(e) => setOpponent(e.target.value)}
          className="border rounded p-2"
          placeholder="상대팀"
        />
      </div>

      <div className="mt-6 flex gap-3">
        <Button className="flex-1 py-2" variant="secondary" onClick={onClose}>
          취소
        </Button>
        <Button
          className="flex-1 text-white py-2"
          variant="primary"
          disabled
          onClick={() => {
            onSubmit({ date, opponent, place, score })
            onClose()
          }}
        >
          등록
        </Button>
      </div>
    </div>
  )
}
