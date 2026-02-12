'use client'

import dynamic from 'next/dynamic'

const TeamSchedule = dynamic(
  () => import('@/widgets/team-schedule/ui/TeamSchedule'),
  {
    ssr: false,
    loading: () => (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center">
        <div className="text-center">
          <div className="text-xl font-bold mb-2 text-white">로딩 중...</div>
          <div className="text-sm text-slate-500">일정을 불러오는 중입니다</div>
        </div>
      </div>
    ),
  }
)

export default function TeamPage() {
  return (
    <div className="min-h-screen bg-[#020617]">
      <main className="rounded-b-[16px] p-20 md:px-40">
        <TeamSchedule />
      </main>
    </div>
  )
}
