import { useMemo } from 'react'

const weekdays = ['일', '월', '화', '수', '목', '금', '토']

type GridProps = {
  viewDate: Date
  dates: Date[]
  today: Date
  selected?: Date
  onSelect: (date: Date) => void
  isSameDate: (a: Date, b: Date) => boolean
}

export default function CalendarGrid({
  viewDate,
  dates,
  today,
  selected,
  onSelect,
  isSameDate,
}: GridProps) {
  const isSameMonth = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth()

  const weekdayHeader = useMemo(
    () => (
      <div className="grid grid-cols-7 py-10 text-center text-xs md:text-sm text-gray-500">
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

          return (
            <button
              key={d.toISOString()}
              onClick={() => onSelect(d)}
              className={[
                'aspect-square rounded-xl text-sm md:text-base',
                'flex justify-center select-none',
                'transition-colors',
                inThisMonth ? 'text-gray-900' : 'text-gray-400',
                isSelected
                  ? 'bg-gray-900 text-white hover:bg-gray-800'
                  : isToday
                    ? 'ring-2 ring-gray-900/30'
                    : 'hover:bg-gray-100',
              ].join(' ')}
              aria-label={`${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`}
            >
              {d.getDate()}
            </button>
          )
        })}
      </div>
    </div>
  )
}
