'use client'

import { useEffect, useRef, useState } from 'react'
import type { CalendarEvent, EventsType } from './CalenderGrid'
import { useClickOutside } from '@/hooks/useClickOutside'

export default function DayEventsPopover({
  date,
  rect,
  events,
  onClose,
  onDelete,
}: {
  date: string
  rect: DOMRect
  events: CalendarEvent[]
  onClose: () => void
  onDelete?: (id?: string) => void
}) {
  const [pos, setPos] = useState<{ top: number; left: number }>({ top: 0, left: 0 })
  const ref = useRef<HTMLDivElement>(null)
  useClickOutside(ref, () => onClose())

  useEffect(() => {
    const gap = 8
    const scrollX = window.scrollX
    const scrollY = window.scrollY
    const vw = window.innerWidth
    const vh = window.innerHeight

    const popW = ref.current?.offsetWidth ?? 280
    const popH = ref.current?.offsetHeight ?? 220

    // 기본 위치: 셀 아래
    let top = rect.bottom + gap + scrollY
    // 가로: 셀의 중앙과 팝오버 중앙 정렬
    let left = rect.left + rect.width / 2 - popW / 2 + scrollX

    // 아래로 넘치면 위로 뒤집기
    const bottomEdge = top + popH - scrollY
    if (bottomEdge > vh - 8) {
      top = rect.top + scrollY - gap - popH
    }

    // 좌우 화면 클램프(여백 8px)
    const minLeft = 8 + scrollX
    const maxLeft = vw - popW - 8 + scrollX
    if (left < minLeft) left = minLeft
    if (left > maxLeft) left = maxLeft

    setPos({ top, left })
  }, [rect])

  const badge = (t: EventsType) =>
    t === '매치'
      ? 'px-8 py-5 bg-orange-200 text-orange-900'
      : t === '회식'
        ? 'bg-purple-200 text-purple-900'
        : 'bg-gray-200 text-gray-900'

  return (
    <div
      ref={ref}
      data-popover
      className="fixed z-50 w-150 rounded-xl bg-white border border-gray-200 shadow-xl px-10 py-10"
      style={{ top: pos.top, left: pos.left }}
      role="dialog"
      aria-label={`${date} 일정`}
    >
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm font-semibold">{date}</p>
      </div>

      {events.length === 0 ? (
        <p className="text-[13px] text-gray-500">등록된 일정이 없습니다.</p>
      ) : (
        <ul className="space-y-2 max-h-260 overflow-auto pr-1">
          {events.map((ev) => (
            <li
              key={ev.id ?? ev.title ?? ev.place ?? Math.random()}
              className="flex items-center gap-8"
            >
              <span className={`px-8 py-5 rounded-full text-xs shrink-0 ${badge(ev.type)}`}>
                {ev.type}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold truncate">{ev.title ?? '(제목 없음)'}</p>
                {ev.place && <p className="text-xs text-gray-500 truncate">장소: {ev.place}</p>}
              </div>
              {!!onDelete && (
                <button
                  onClick={() => onDelete(ev.id)}
                  className="text-xs text-red-500 hover:text-red-600"
                >
                  삭제
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
