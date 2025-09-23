'use client'

import Button from '../common/Button'
import { useState } from 'react'
import Modal from '../common/Modal'
import { useScheduleStore } from '@/store/useScheduleStore'

export default function Schedule() {
  const [isOpen, setIsOpen] = useState(false)
  const add = useScheduleStore((s) => s.add)

  const handleSubmit = (data: {
    date: string
    type: '매치' | '회식' | '기타'
    title?: string
    place?: string
  }) => {
    add(data)
    setIsOpen(false)
  }

  return (
    <section>
      <p className="border-t border-gray-100 pt-20 txt-20_B">SUB 일정</p>
      <Button variant="primary" size="xl" className="my-10" onClick={() => setIsOpen(true)}>
        일정 등록하기
      </Button>
      <div className="txt-16_B flex flex-row gap-5 mt-10 items-center">
        <p className="card-shadow rounded-full text-center min-w-50 bg-orange-300">매치</p>
        <p className="card-shadow rounded-full text-center min-w-50 bg-purple-300">회식</p>
        <p className="card-shadow rounded-full text-center min-w-50 bg-gray-300">기타</p>
      </div>
      {isOpen && (
        <Modal variant="scheduleEvent" onClose={() => setIsOpen(false)} onSubmit={handleSubmit} />
      )}
    </section>
  )
}
