'use client'

import { useMemo, useRef, useState } from 'react'
import {
  getCalendarDates,
  getMonthName,
  formatDateKorean,
  isSameDate,
} from '@/shared/utils/calenderUtils'
import { useScheduleEventsQuery, useDeleteScheduleEventMutation } from '@/entities/team'
import type { ScheduleEvent } from '@/entities/team'
import CalendarSkeleton from './CalendarSkeleton'
import CalendarHeader from './CalendarHeader'
import CalendarGrid from './CalendarGrid'
import DayEventsPopover from './DayEventsPopover'
import type { CalendarEvent } from './CalendarGrid'

type Props = {
  value?: Date
  onChange?: (date: Date) => void
  className?: string
  /** 서버에서 미리 가져온 일정 목록 (서버 컴포넌트에서 전달 시 LCP 개선) */
  initialScheduleEvents?: ScheduleEvent[] | null
}

export default function Calendar({ value, onChange, className, initialScheduleEvents }: Props) {
  const today = useMemo(() => new Date(), [])
  const [viewDate, setViewDate] = useState<Date>(value ?? today)
  const [openPopover, setOpenPopover] = useState<{ date: string; rect: DOMRect } | null>(null)
  const gridContainerRef = useRef<HTMLDivElement>(null)
  const { data: scheduleEventsFromQuery = [], isLoading } = useScheduleEventsQuery()
  const deleteMutation = useDeleteScheduleEventMutation()

  const scheduleEvents = initialScheduleEvents ?? scheduleEventsFromQuery

  const dates = useMemo(() => getCalendarDates(viewDate), [viewDate])

  const calendarEvents: CalendarEvent[] = useMemo(() => {
    return scheduleEvents.map((event) => ({
      id: event.id,
      date: event.date.includes('T') ? event.date.slice(0, 10) : event.date,
      type: event.type,
      title: event.title,
      place: event.place,
    }))
  }, [scheduleEvents])

  // 이벤트를 날짜별로 그룹화 (성능 최적화: O(N) → O(1) 조회)
  const eventsByDate = useMemo(() => {
    const grouped: Record<string, CalendarEvent[]> = {}
    calendarEvents.forEach((event) => {
      const dateKey = event.date.includes('T') ? event.date.slice(0, 10) : event.date
      if (!grouped[dateKey]) {
        grouped[dateKey] = []
      }
      grouped[dateKey].push(event)
    })
    return grouped
  }, [calendarEvents])

  const goPrevMonth = () =>
    setViewDate((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1))
  const goNextMonth = () =>
    setViewDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1))

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

  if (initialScheduleEvents == null && isLoading) {
    return <CalendarSkeleton viewDate={viewDate} onPrev={goPrevMonth} onNext={goNextMonth} />
  }

  return (
    <section
      className={`relative overflow-hidden rounded-[40px] border border-white/5 bg-slate-900/40 p-10 shadow-2xl backdrop-blur-3xl md:p-12 lg:p-16 ${className ?? ''}`}
      aria-label="달력"
    >
      {/* Background Decorative Glow */}
      <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-blue-600/10 blur-[100px]" />

      <div ref={gridContainerRef} className="relative z-10 w-full min-w-0">
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
          selected={value}
          onSelect={(d) => onChange?.(d)}
          onDayClick={(dateStr, rect) => setOpenPopover({ date: dateStr, rect })}
          isSameDate={isSameDate}
          eventsByDate={eventsByDate}
          onDeleteEvent={handleDeleteEvent}
        />

        {openPopover && (
          <DayEventsPopover
            date={openPopover.date}
            rect={openPopover.rect}
            containerRef={gridContainerRef}
            events={calendarEvents.filter((ev) => ev.date === openPopover.date)}
            onClose={() => setOpenPopover(null)}
            onDelete={handleDeleteEvent}
          />
        )}
      </div>
    </section>
  )
}
