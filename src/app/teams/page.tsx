import { headers } from 'next/headers'
import Calendar from '@/features/team-schedule/ui/Calendar'
import Schedule from '@/features/team-schedule/ui/Schedule'
import type { ScheduleEvent } from '@/entities/team'

export const dynamic = 'force-dynamic'
export const revalidate = 0

async function fetchScheduleEvents(origin: string, cookie: string): Promise<ScheduleEvent[] | null> {
  try {
    const res = await fetch(`${origin}/api/teams/schedule`, {
      cache: 'no-store',
      headers: { cookie },
    })
    if (!res.ok) return null
    return res.json()
  } catch {
    return null
  }
}

export default async function TeamPage() {
  const h = await headers()
  const host = h.get('x-forwarded-host') ?? h.get('host') ?? 'localhost:3000'
  const proto = h.get('x-forwarded-proto') ?? 'http'
  const origin = `${proto}://${host}`
  const cookie = h.get('cookie') ?? ''

  const scheduleEvents = await fetchScheduleEvents(origin, cookie)

  return (
    <div className="min-h-screen bg-[#020617]">
      <main className="rounded-b-[16px] p-20 md:px-40">
        <Schedule />
        <Calendar initialScheduleEvents={scheduleEvents} />
      </main>
    </div>
  )
}
