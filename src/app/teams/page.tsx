import { Calendar, Schedule } from '@/features/team-schedule'

export default function TeamPage() {
  return (
    <div className="min-h-screen bg-[#020617]">
      <main className="rounded-b-[16px] p-20 md:px-40">
        <Schedule />
        <Calendar />
      </main>
    </div>
  )
}
