import type { EventsType } from '../ui/CalendarGrid'

export interface ScheduleContentProps {
  variant: 'scheduleEvent'
  onClose: () => void
  onSubmit: (data: { date: string; type: EventsType; title?: string; place?: string }) => void
}
