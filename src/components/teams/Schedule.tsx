'use client'

import { useState } from 'react'
import { Beer, Calendar, MoreHorizontal, Trophy } from 'lucide-react'
import { Button, Modal } from '@/shared'
import { useCreateScheduleEventMutation } from '@/entities/team'
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
      <div className="flex items-center gap-10 rounded-2xl border border-white/10 bg-white/5 px-10 py-10 backdrop-blur-md">
        <Calendar size={22} className="text-blue-500" />
        <h2 className="text-sm font-black uppercase tracking-[0.4em] text-white md:text-base">
          SUB Schedule
        </h2>
      </div>
      <Button
        variant="primary"
        size="xl"
        className="my-10 font-bold"
        onClick={() => {
          if (disabled) return
          setIsOpen(true)
        }}
        disabled={disabled || createMutation.isPending}
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

      {/* 뱃지(인디케이터) 섹션 */}
      <div className="relative z-10">
        <div className="flex flex-row flex-wrap my-20 gap-3">
          {[
            {
              label: '매치',
              type: 'Match',
              icon: Trophy,
              color: 'text-orange-400',
              bg: 'bg-orange-400/10',
              border: 'border-orange-400/20',
              glow: 'shadow-orange-400/20',
            },
            {
              label: '회식',
              type: 'Social',
              icon: Beer,
              color: 'text-purple-400',
              bg: 'bg-purple-400/10',
              border: 'border-purple-400/20',
              glow: 'shadow-purple-400/20',
            },
            {
              label: '기타',
              type: 'Misc',
              icon: MoreHorizontal,
              color: 'text-slate-400',
              bg: 'bg-slate-400/10',
              border: 'border-slate-400/20',
              glow: 'shadow-slate-400/20',
            },
          ].map((item) => (
            <div
              key={item.label}
              className={`flex w-70 shrink-0 items-center gap-10 rounded-2xl border p-8 shadow-lg md:w-72 md:gap-4 md:p-8 ${item.bg} ${item.border} ${item.glow}`}
            >
              <div
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/5 bg-slate-900/50 md:h-10 md:w-10 ${item.color}`}
              >
                <item.icon size={16} className="shrink-0" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-black italic uppercase leading-none tracking-tight text-white">
                  {item.label}
                </p>
              </div>
              <div
                className={`h-6 w-1 shrink-0 rounded-full opacity-20 ${item.color.replace('text', 'bg')}`}
              />
            </div>
          ))}
        </div>
      </div>

      {isOpen && (
        <Modal variant="scheduleEvent" onClose={() => setIsOpen(false)} onSubmit={handleSubmit} />
      )}
    </section>
  )
}
