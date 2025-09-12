'use client'

import { useMemo, useState } from 'react'
import { formatDate } from '@/utils/calenderUtils'
import { mockEvents } from '@/mocks/calenderEvents'
import DayEventsPopover from './DayEventsPopover'

const weekdays = ['일', '월', '화', '수', '목', '금', '토']

export type EventsType = '매치' | '회식' | '기타'

export type CalendarEvent = {
  date: string
  type: EventsType
  title?: string
  place?: string
  id?: string
}

const EVENT_COLORS: Record<EventsType, string> = {
  매치: 'bg-orange-300',
  회식: 'bg-purple-300',
  기타: 'bg-gray-300',
}

type GridProps = {
  viewDate: Date
  dates: Date[]
  today: Date
  selected?: Date
  onSelect: (date: Date) => void
  isSameDate: (a: Date, b: Date) => boolean
  events?: CalendarEvent[]
  onDeleteEvent?: (id?: string) => void // 삭제가 필요하면 넘기기(선택)
}

export default function CalendarGrid({
  viewDate,
  dates,
  today,
  selected,
  onSelect,
  isSameDate,
  events = mockEvents,
  onDeleteEvent,
}: GridProps) {
  const isSameMonth = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth()
  const [open, setOpen] = useState<{ date: string; rect: DOMRect } | null>(null)
  const weekdayHeader = useMemo(
    () => (
      <div className="grid grid-cols-7 py-2 text-center text-xs md:text-sm text-gray-500">
        {weekdays.map((w, i) => (
          <div
            key={w}
            className={`py-1 ${i === 0 ? 'text-red-500' : i === 6 ? 'text-blue-600' : ''}`}
          >
            {w}
          </div>
        ))}
      </div>
    ),
    []
  )
  return (
    <div>
      {weekdayHeader}

      <div className="grid grid-cols-7 gap-1">
        {dates.map((d) => {
          const inThisMonth = isSameMonth(viewDate, d)
          const isToday = isSameDate(d, today)
          const isSelected = selected ? isSameDate(d, selected) : false
          const dateStr = formatDate(d)
          const dayEvents = events.filter((ev) => ev.date === dateStr)

          return (
            <button
              key={d.toISOString()}
              onClick={(e) => {
                onSelect(d)
                setOpen({ date: dateStr, rect: e.currentTarget.getBoundingClientRect() })
              }}
              className={[
                'aspect-square rounded-xl text-sm md:text-base flex flex-col items-center select-none',
                'transition-colors relative',
                inThisMonth ? 'text-gray-900' : 'text-gray-400',
                isSelected
                  ? 'bg-gray-900 text-white hover:bg-gray-800'
                  : isToday
                    ? 'ring-2 ring-primary-500'
                    : 'hover:bg-gray-100',
              ].join(' ')}
              aria-label={`${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`}
              aria-haspopup="dialog"
              aria-expanded={open?.date === dateStr}
            >
              <span>{d.getDate()}</span>

              <div className="flex flex-col gap-1 mt-1">
                {dayEvents.map((ev, idx) => (
                  <span
                    key={ev.id ?? idx}
                    className={`w-30 h-10 rounded-full ${EVENT_COLORS[ev.type]}`}
                  />
                ))}
              </div>
            </button>
          )
        })}
      </div>
      {/* 팝오버 */}
      {open && (
        <DayEventsPopover
          date={open.date}
          rect={open.rect}
          events={events.filter((ev) => ev.date === open.date)}
          onClose={() => setOpen(null)}
          onDelete={onDeleteEvent}
        />
      )}
    </div>
  )
}
