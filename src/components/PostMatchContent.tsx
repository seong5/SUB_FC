'use client'
import { useState } from 'react'
import type { PostMatchProps } from '@/constants/modal'

export function PostMatchContent({ onClose, onSubmit }: PostMatchProps) {
  const [date, setDate] = useState('')
  const [opponent, setOpponent] = useState('')
  const [place, setPlace] = useState('')

  return (
    <div className="p-6 w-[320px] md:w-[400px]">
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
          value={opponent}
          onChange={(e) => setOpponent(e.target.value)}
          className="border rounded p-2"
          placeholder="상대팀"
        />
        <input
          type="text"
          value={place}
          onChange={(e) => setPlace(e.target.value)}
          className="border rounded p-2"
          placeholder="장소"
        />
      </div>

      <div className="mt-6 flex gap-3">
        <button className="flex-1 rounded bg-gray-200 py-2" onClick={onClose}>
          취소
        </button>
        <button
          className="flex-1 rounded bg-blue-500 text-white py-2"
          onClick={() => {
            onSubmit({ date, opponent, place })
            onClose()
          }}
        >
          등록
        </button>
      </div>
    </div>
  )
}
