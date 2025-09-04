import Calender from '@/components/calender/Calender'
import Schedule from '@/components/Schedule'
import WinRate from '@/components/WinRate'

export default function TeamPage() {
  return (
    <main className="px-20">
      <WinRate />
      <Schedule />
      <Calender />
    </main>
  )
}
