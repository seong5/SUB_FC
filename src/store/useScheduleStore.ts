'use client'

import { create } from 'zustand'
import { devtools, persist, createJSONStorage } from 'zustand/middleware'
import { generateId } from '@/utils/uuid'

export type EventsType = '매치' | '회식' | '기타'

export type CalendarEvent = {
  id: string
  date: string
  type: EventsType
  title?: string
  place?: string
}

export type CreateEventDto = Omit<CalendarEvent, 'id'>
export type UpdateEventDto = Partial<Omit<CalendarEvent, 'id'>>

type State = {
  events: CalendarEvent[]
  add: (dto: CreateEventDto) => void
  update: (id: string, patch: UpdateEventDto) => void
  remove: (id: string) => void
  byDate: (yyyyMMdd: string) => CalendarEvent[]
}

export const useScheduleStore = create<State>()(
  devtools(
    persist(
      (set, get) => ({
        events: [],
        add: (dto) => set((s) => ({ events: [...s.events, { ...dto, id: generateId() }] })),
        update: (id, patch) =>
          set((s) => ({
            events: s.events.map((e) => (e.id === id ? { ...e, ...patch } : e)),
          })),
        remove: (id) => set((s) => ({ events: s.events.filter((e) => e.id !== id) })),
        byDate: (d) => get().events.filter((e) => e.date === d),
      }),
      {
        name: 'subfc-events-v1',
        storage: createJSONStorage(() => localStorage),
      }
    )
  )
)
