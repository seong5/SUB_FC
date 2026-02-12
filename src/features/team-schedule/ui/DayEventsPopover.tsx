'use client'

import { useEffect, useRef, useState } from 'react'
import type { CalendarEvent, EventsType } from './CalendarGrid'
import { useClickOutside } from '@/shared/hooks'

type DayEventsPopoverProps = {
  date: string
  rect: DOMRect
  events: CalendarEvent[]
  onClose: () => void
  onDelete?: (id?: string) => void
  containerRef?: React.RefObject<HTMLElement | null>
}

export default function DayEventsPopover({
  date,
  rect,
  events,
  onClose,
  onDelete,
  containerRef,
}: DayEventsPopoverProps) {
  const [pos, setPos] = useState<{ top: number; left: number }>({ top: 0, left: 0 })
  const [useAbsolute, setUseAbsolute] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  useClickOutside(ref, () => onClose())

  useEffect(() => {
    const yGap = 4
    const xOffset = 0
    const popW = ref.current?.offsetWidth ?? 280
    const popH = ref.current?.offsetHeight ?? 100

    if (containerRef?.current) {
      const containerRect = containerRef.current.getBoundingClientRect()
      setUseAbsolute(true)
      // 그리드 컨테이너 기준 절대 위치: 셀 아래 중앙 정렬
      let top = rect.bottom - containerRect.top + yGap
      let left = rect.left - containerRect.left + rect.width / 2 - popW / 2 + xOffset
      // 컨테이너 안에서 클램프
      const minLeft = 8
      const maxLeft = containerRect.width - popW - 8
      if (left < minLeft) left = minLeft
      if (left > maxLeft) left = maxLeft
      if (top + popH > containerRect.height - 8) {
        top = rect.top - containerRect.top - popH - yGap
      }
      if (top < 8) top = 8
      setPos({ top, left })
    } else {
      setUseAbsolute(false)
      const vw = window.innerWidth
      const vh = window.innerHeight
      let top = rect.bottom + yGap
      let left = rect.left + rect.width / 2 - popW / 2 + xOffset
      if (top + popH > vh - 8) {
        top = rect.top - popH - yGap
      }
      const minLeft = 8
      const maxLeft = vw - popW - 8
      if (left < minLeft) left = minLeft
      if (left > maxLeft) left = maxLeft
      setPos({ top, left })
    }
  }, [rect, containerRef])
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
      className={`z-50 min-w-[200px] max-w-[300px] rounded-xl border border-gray-200 bg-white px-4 py-4 shadow-xl ${useAbsolute ? 'absolute' : 'fixed'}`}
      style={{ top: pos.top, left: pos.left }}
      role="dialog"
      aria-label={`${date} 일정`}
    >
      <div className="flex items-center justify-between mb-10">
        <p className="text-sm font-semibold">{date}</p>
      </div>

      {events.length === 0 ? (
        <p className="text-[13px] text-gray-500">등록된 일정이 없습니다.</p>
      ) : (
        <ul className="space-y-10 max-h-260 overflow-auto">
          {events.map((ev) => (
            <li
              key={ev.id ?? ev.title ?? ev.place ?? Math.random()}
              className="flex items-start gap-8"
            >
              <span className={`px-6 py-3 rounded-full text-[10px] shrink-0 ${badge(ev.type)}`}>
                {ev.type}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold break-words">{ev.title ?? '(제목 없음)'}</p>
                {ev.place && (
                  <p className="text-xs text-gray-500 break-words mt-2">장소: {ev.place}</p>
                )}
              </div>
              {!!onDelete && (
                <button
                  onClick={() => onDelete(ev.id)}
                  className="text-xs text-red-500 hover:text-red-600 shrink-0"
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
