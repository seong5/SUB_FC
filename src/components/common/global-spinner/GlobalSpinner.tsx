'use client'

import { useIsFetching, useIsMutating } from '@tanstack/react-query'
import Spinner from '@/components/common/spinner/Spinner'

export default function GlobalQueryLoader() {
  const fetching = useIsFetching()
  const mutating = useIsMutating()
  const active = fetching + mutating > 0

  if (!active) return null

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white/60">
      <Spinner />
    </div>
  )
}
