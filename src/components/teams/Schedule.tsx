'use client'

import Button from '../common/Button'
import { useState } from 'react'
import Modal from '../common/Modal'
import { useCreateScheduleEventMutation } from '@/hooks/useTeams'
import { useIsLoggedIn, useAuthLoading } from '@/store/useAuthStore'

export default function Schedule() {
  const [isOpen, setIsOpen] = useState(false)
  const createMutation = useCreateScheduleEventMutation()
  const isLoggedIn = useIsLoggedIn()
  const authLoading = useAuthLoading()
  const disabled = authLoading || !isLoggedIn

  const handleSubmit = (data: {
    date: string
    type: '매치' | '회식' | '기타'
    title?: string
    place?: string
  }) => {
    createMutation.mutate(data, {
      onSuccess: () => {
        setIsOpen(false)
      },
      onError: (error) => {
        console.error('일정 등록 실패:', error)
        alert('일정 등록에 실패했습니다. 다시 시도해주세요.')
      },
    })
  }

  return (
    <section>
      <p className="border-t border-gray-100 pt-20 txt-20_B">SUB 일정</p>
      <Button
        variant="primary"
        size="xl"
        className="my-10"
        onClick={() => {
          if (disabled) return // 로그인 안 했거나 로딩 중이면 클릭 방어
          setIsOpen(true)
        }}
        disabled={disabled || createMutation.isPending} // 비로그인/로딩 시 비활성화
        aria-disabled={disabled || createMutation.isPending}
      >
        {authLoading
          ? '로딩 중 ...'
          : createMutation.isPending
            ? '등록 중...'
            : !isLoggedIn
              ? '로그인 후 이용 가능합니다.'
              : '일정 등록하기'}
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
