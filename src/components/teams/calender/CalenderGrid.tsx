'use client'

import { useMemo } from 'react'
import { Beer, MoreHorizontal, Trophy } from 'lucide-react'
import { formatDate } from '@/utils/calenderUtils'

const weekdays = ['일', '월', '화', '수', '목', '금', '토']

export type EventsType = '매치' | '회식' | '기타'

export type CalendarEvent = {
  date: string
  type: EventsType
  title?: string
  place?: string
  id?: string
}

const EVENT_BADGE_THEMES: Record<
  EventsType,
  { label: string; color: string; bg: string; border: string; icon: typeof Trophy }
> = {
  매치: {
    label: '매치',
    color: 'text-orange-400',
    bg: 'bg-orange-400/10',
    border: 'border-orange-400/20',
    icon: Trophy,
  },
  회식: {
    label: '회식',
    color: 'text-purple-400',
    bg: 'bg-purple-400/10',
    border: 'border-purple-400/20',
    icon: Beer,
  },
  기타: {
    label: '기타',
    color: 'text-slate-400',
    bg: 'bg-slate-400/10',
    border: 'border-slate-400/20',
    icon: MoreHorizontal,
  },
}

type GridProps = {
  viewDate: Date
  dates: Date[]
  today: Date
  selected?: Date
  onSelect: (date: Date) => void
  onDayClick?: (dateStr: string, rect: DOMRect) => void
  isSameDate: (a: Date, b: Date) => boolean
  events?: CalendarEvent[]
  onDeleteEvent?: (id?: string) => void
}

export default function CalendarGrid({
  viewDate,
  dates,
  today,
  selected,
  onSelect,
  onDayClick,
  isSameDate,
  events = [],
}: GridProps) {
  const isSameMonth = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth()
  const weekdayHeader = useMemo(
    () => (
      <div className="grid grid-cols-7 py-4 text-center text-sm text-slate-400 md:py-5 md:text-base">
        {weekdays.map((w, i) => (
          <div
            key={w}
            className={`py-1 ${i === 0 ? 'text-red-500' : i === 6 ? 'text-blue-500' : ''}`}
          >
            {w}
          </div>
        ))}
      </div>
    ),
    []
  )
  return (
    <div className="w-full min-w-0">
      {weekdayHeader}

      <div
        className="grid w-full min-w-0 gap-2 md:gap-3"
        style={{ gridTemplateColumns: 'repeat(7, minmax(0, 1fr))' }}
      >
        {dates.map((d) => {
          const inThisMonth = isSameMonth(viewDate, d)
          const isToday = isSameDate(d, today)
          const isSelected = selected ? isSameDate(d, selected) : false
          const dateStr = formatDate(d)
          const dayEvents = events.filter((ev) => {
            const evDate = ev.date.includes('T') ? ev.date.slice(0, 10) : ev.date
            return evDate === dateStr
          })

          return (
            <button
              key={d.toISOString()}
              type="button"
              onClick={(e) => {
                onSelect(d)
                onDayClick?.(dateStr, e.currentTarget.getBoundingClientRect())
              }}
              className={[
                'flex min-h-[110px] min-w-0 flex-col items-stretch justify-start overflow-hidden rounded-xl px-2 py-2.5 text-base select-none transition-colors md:min-h-[140px] md:px-2.5 md:py-3 md:text-lg',
                'relative w-full box-border',
                inThisMonth ? 'text-gray-900' : 'text-gray-400',
                isSelected
                  ? 'bg-gray-900 text-white hover:bg-gray-800'
                  : isToday
                    ? 'ring-2 ring-primary-500'
                    : 'hover:bg-gray-100',
              ].join(' ')}
              aria-label={`${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`}
              aria-haspopup="dialog"
            >
              <span className="shrink-0 text-center">{d.getDate()}</span>

              <div className="mt-2.5 flex min-w-0 flex-1 flex-col gap-1.5">
                {dayEvents.map((ev, idx) => {
                  const theme = EVENT_BADGE_THEMES[ev.type] ?? EVENT_BADGE_THEMES.기타
                  const IconComponent = theme.icon
                  return (
                    <div
                      key={ev.id ?? idx}
                      className={`flex min-w-0 w-full items-center gap-2 rounded-lg border px-2 py-1.5 shadow md:gap-2.5 md:rounded-xl md:px-2.5 md:py-2 ${theme.bg} ${theme.border}`}
                      title={`${ev.type}${ev.title ? `: ${ev.title}` : ''}`}
                    >
                      <div
                        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded border border-white/5 bg-slate-900/50 md:h-7 md:w-7 ${theme.color}`}
                      >
                        <IconComponent size={12} className="shrink-0" />
                      </div>
                      <span className="min-w-0 flex-1 truncate text-[10px] font-black italic uppercase leading-none tracking-tight text-white md:text-xs">
                        {theme.label}
                      </span>
                      <div
                        className={`h-5 w-1 shrink-0 rounded-full opacity-20 md:h-6 ${theme.color.replace('text', 'bg')}`}
                      />
                    </div>
                  )
                })}
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
