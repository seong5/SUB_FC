import { Skeleton } from '@/shared'

export default function MatchInfoCardSkeleton() {
  return (
    <div className="block group">
      <div className="relative overflow-hidden rounded-[32px] border border-slate-700/60 bg-slate-900/80 backdrop-blur-xl transition-all duration-500 min-h-[165px] md:min-h-[173px]">
        {/* 상단 그라데이션 블러 */}
        <div className="absolute -right-20 -top-20 h-40 w-40 bg-slate-500 blur-[80px] opacity-20" />

        <div className="relative z-10 p-6 md:p-8">
          {/* 날짜 / 장소 영역 (MatchInfoCard와 동일 레이아웃) */}
          <div className="mb-4 p-10 flex flex-col gap-4">
            {/* 날짜 라인: Calendar(14x14) + 날짜 텍스트(90.38x20) */}
            <div className="flex items-center gap-2">
              <Skeleton className="h-[14px] w-[14px] rounded-full" />
              <Skeleton className="h-[20px] w-[90.38px] rounded-md" />
            </div>
            <div className="h-1 w-1 rounded-full bg-slate-800" />
            {/* 장소 라인: MapPin + 장소 텍스트 */}
            <div className="flex items-center gap-2">
              <Skeleton className="h-[14px] w-[14px] rounded-full" />
              <Skeleton className="h-[16px] w-[30.24px] rounded-md" />
            </div>
          </div>

          {/* 본문 영역: VS / 스코어 */}
          <div className="flex flex-col items-center gap-8 md:flex-row">
            <div className="w-full flex-1 space-y-4 text-center md:text-left">
              <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
                {/* VS 상대 팀 이름 영역 (text-2xl ~ md:text-4xl) */}
                <div className="space-y-1 items-center justify-center">
                  <Skeleton className="h-[24px] w-[159px] rounded-md" />
                </div>

                {/* 스코어 영역 (최종 스코어 + 숫자) */}
                <div className="flex flex-col items-center justify-center md:items-end gap-2">
                  {/* '최종 스코어' 텍스트 (text-[10px]) */}
                  <Skeleton className="mb-1 h-[15px] w-[63.88px] rounded-md" />
                  <div className="flex items-center gap-3">
                    {/* 좌측 스코어 (text-4xl ~ md:text-5xl) */}
                    <Skeleton className="h-[36px] w-[17.5px] rounded-md" />
                    {/* 콜론 ':' (text-xl) */}
                    <Skeleton className="h-[28px] w-[5px]" />
                    {/* 우측 스코어 */}
                    <Skeleton className="h-[36px] w-[17.5px] rounded-md" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
