import Calender from '@/components/teams/calender/Calender'
import Schedule from '@/components/teams/Schedule'

export default function TeamPage() {
  return (
    <main className="bg-sub-gray p-20 rounded-[16px]">
      <Schedule />
      <Calender />
    </main>
  )
}
