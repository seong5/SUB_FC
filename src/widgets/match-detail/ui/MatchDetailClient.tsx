'use client'

import dynamic from 'next/dynamic'
import { MapPin } from 'lucide-react'
import type { MatchDetailFull } from '@/entities/match'

const Formation = dynamic(
  () => import('@/features/match-detail/ui/Formation').then((m) => ({ default: m.default })),
  {
    ssr: false,
    loading: () => (
      <div className="min-h-[487.7px] animate-pulse rounded-lg bg-white/5" aria-hidden />
    ),
  }
)

const LoadKakaoMap = dynamic(
  () => import('@/features/match-detail/ui/LoadKakaoMap').then((m) => ({ default: m.default })),
  {
    ssr: false,
    loading: () => (
      <div className="h-[320px] w-full animate-pulse rounded-lg bg-white/5" aria-hidden />
    ),
  }
)

export default function MatchDetailClient({
  initialDetail,
}: {
  initialDetail: MatchDetailFull
}) {
  const address = initialDetail.place_address ?? initialDetail.place
  return (
    <div className="min-h-screen bg-[#020617]">
      <h1 className="sr-only">경기 상세</h1>
      <main className="rounded-b-[16px] px-20 py-10 space-y-6 md:px-40">
        <div className="min-h-[487.7px]">
          <Formation initialData={initialDetail} />
        </div>
        <div className="my-5 space-y-2">
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-3">
              <h2 className="text-2xl mt-15 font-black italic text-white uppercase tracking-tighter">
                Location
              </h2>
            </div>
          </div>
          <div className="flex items-center gap-3 text-[16px] font-bold text-white">
            <div className="flex items-center justify-center w-30 h-30 text-emerald-400">
              <MapPin size={22} />
            </div>
            <span className="text-white truncate">{address}</span>
          </div>
        </div>
        <LoadKakaoMap
          address={address}
          lat={initialDetail.place_lat ?? undefined}
          lng={initialDetail.place_lng ?? undefined}
        />
      </main>
    </div>
  )
}
