'use client'

import { useIsFetching, useIsMutating } from '@tanstack/react-query'
import Spinner from '@/components/common/spinner/Spinner'
import { useControlledSpinner } from '@/hooks/useControllSpinner'

export default function GlobalSpinner() {
  const fetching = useIsFetching()
  const mutating = useIsMutating()
  const active = fetching + mutating > 0

  const visible = useControlledSpinner(active, {
    delayBeforeShow: 50,
    minVisibleMs: 500,
  })

  if (!visible) return null

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60">
      <Spinner />
    </div>
  )
}
