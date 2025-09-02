export type EventsType = '매치' | '회식' | '기타'

export type CalendarEvent = {
  date: string // YYYY-MM-DD
  type: EventsType // '매치' | '회식' | '기타'
}

export const mockEvents: CalendarEvent[] = [
  { date: '2025-09-02', type: '매치' },
  { date: '2025-09-05', type: '회식' },
  { date: '2025-09-05', type: '기타' },
  { date: '2025-09-10', type: '매치' },
  { date: '2025-09-15', type: '기타' },
  { date: '2025-09-20', type: '회식' },
  { date: '2025-09-23', type: '매치' },
]
