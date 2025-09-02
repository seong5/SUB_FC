'use client'

import { useMemo, useState } from 'react'
import CalendarHeader from '@/components/calender/CalenderHeader'
import CalendarGrid from '@/components/calender/CalenderGrid'
import { getCalendarDates, getMonthName, formatDateKorean, isSameDate } from '@/utils/calenderUtils'

type Props = {
  value?: Date
  onChange?: (date: Date) => void
  className?: string
}

export default function Calendar({ value, onChange, className }: Props) {
  const today = useMemo(() => new Date(), [])
  const [viewDate, setViewDate] = useState<Date>(value ?? today)

  const dates = useMemo(() => getCalendarDates(viewDate), [viewDate])

  const goPrevMonth = () =>
    setViewDate((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1))
  const goNextMonth = () =>
    setViewDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1))

  const selected = value

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
      />
    </section>
  )
}
