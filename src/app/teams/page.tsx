import Calender from '@/components/calender/Calender'
import Schedule from '@/components/Schedule'
import WinRate from '@/components/WinRate'

export default function TeamPage() {
  return (
    <main className="bg-sub-gray p-20">
      <WinRate />
      <Schedule />
      <Calender />
    </main>
  )
}
