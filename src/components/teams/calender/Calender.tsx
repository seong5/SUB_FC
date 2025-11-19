'use client'

import { useMemo, useState } from 'react'
import CalendarHeader from '@/components/teams/calender/CalenderHeader'
import CalendarGrid from '@/components/teams/calender/CalenderGrid'
import CalendarSkeleton from '@/components/teams/calender/CalendarSkeleton'
import { getCalendarDates, getMonthName, formatDateKorean, isSameDate } from '@/utils/calenderUtils'
import { useScheduleEventsQuery, useDeleteScheduleEventMutation } from '@/hooks/useTeams'
import type { CalendarEvent } from '@/components/teams/calender/CalenderGrid'

type Props = {
  value?: Date
  onChange?: (date: Date) => void
  className?: string
}

export default function Calendar({ value, onChange, className }: Props) {
  const today = useMemo(() => new Date(), [])
  const [viewDate, setViewDate] = useState<Date>(value ?? today)
  const { data: scheduleEvents = [], isLoading } = useScheduleEventsQuery()
  const deleteMutation = useDeleteScheduleEventMutation()

  const dates = useMemo(() => getCalendarDates(viewDate), [viewDate])

  // ScheduleEvent를 CalendarEvent 형식으로 변환
  const calendarEvents: CalendarEvent[] = useMemo(() => {
    return scheduleEvents.map((event) => ({
      id: event.id,
      date: event.date,
      type: event.type,
      title: event.title,
      place: event.place,
    }))
  }, [scheduleEvents])

  const goPrevMonth = () =>
    setViewDate((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1))
  const goNextMonth = () =>
    setViewDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1))

  const selected = value

  const handleDeleteEvent = (id?: string) => {
    if (id) {
      deleteMutation.mutate(id, {
        onError: (error) => {
          console.error('일정 삭제 실패:', error)
          alert('일정 삭제에 실패했습니다. 다시 시도해주세요.')
        },
      })
    }
  }

  if (isLoading) {
    return (
      <CalendarSkeleton
        viewDate={viewDate}
        onPrev={goPrevMonth}
        onNext={goNextMonth}
      />
    )
  }

  return (
    <section
      className={`p-20 my-20 w-full border border-gray-100 rounded-[20px] bg-white card-shadow ${className ?? ''}`}
      aria-label="달력"
    >
      <CalendarHeader
        title={getMonthName(viewDate)}
        subtitle={formatDateKorean(viewDate)}
        onPrev={goPrevMonth}
        onNext={goNextMonth}
      />

      <CalendarGrid
        viewDate={viewDate}
        dates={dates}
        today={today}
        selected={selected}
        onSelect={(d) => onChange?.(d)}
        isSameDate={isSameDate}
        events={calendarEvents}
        onDeleteEvent={handleDeleteEvent}
      />
    </section>
  )
}
