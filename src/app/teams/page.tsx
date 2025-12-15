import Calender from '@/components/teams/calender/Calender'
import Schedule from '@/components/teams/Schedule'
import WinRate from '@/components/teams/WinRate'

export default function TeamPage() {
  return (
    <main className="bg-sub-gray p-20 rounded-[16px]">
      <WinRate />
      <Schedule />
      <Calender />
    </main>
  )
}
