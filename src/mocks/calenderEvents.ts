export type EventsType = '매치' | '회식' | '기타'

export type CalendarEvent = {
  id: string
  date: string
  type: EventsType
  title?: string
  place?: string
}

export const mockEvents: CalendarEvent[] = [
  { id: 'e1', date: '2025-09-02', type: '매치', title: '짱구fc', place: '다락원' },
  { id: 'e2', date: '2025-09-05', type: '회식', title: '짱구fc', place: '다락원' },
  { id: 'e3', date: '2025-09-05', type: '기타', title: '결혼식', place: '강남' },
  { id: 'e4', date: '2025-09-10', type: '매치', title: '리브레', place: '마들' },
  { id: 'e5', date: '2025-09-15', type: '기타', title: '형우결혼식', place: '다락원' },
  { id: 'e6', date: '2025-09-20', type: '회식', title: '2차회식', place: '도봉역' },
  { id: 'e7', date: '2025-09-23', type: '매치', title: 'fc', place: '중랑구립' },
]
