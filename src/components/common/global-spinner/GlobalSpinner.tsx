'use client'

import { useIsFetching, useIsMutating } from '@tanstack/react-query'
import { usePathname } from 'next/navigation'
import Spinner from '@/components/common/spinner/Spinner'
import { useControlledSpinner } from '@/hooks/useControllSpinner'

export default function GlobalSpinner() {
  const pathname = usePathname()
  const fetching = useIsFetching()
  const mutating = useIsMutating()
  const active = fetching + mutating > 0

  // 팀 관리 페이지에서는 스피너를 표시하지 않음
  const isTeamsPage = pathname?.startsWith('/teams')

  const visible = useControlledSpinner(active, {
    delayBeforeShow: 50,
    minVisibleMs: 500,
  })

  if (!visible || isTeamsPage) return null

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60">
      <Spinner />
    </div>
  )
}
