'use client'

import { Skeleton } from '@/shared'

export default function MapSkeleton() {
  return (
    <Skeleton
      variant="box"
      className="w-full h-[320px] rounded-lg shadow"
    />
  )
}
