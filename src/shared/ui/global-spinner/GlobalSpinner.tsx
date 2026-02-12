'use client'

import { useIsFetching, useIsMutating } from '@tanstack/react-query'
import { usePathname } from 'next/navigation'
import { Spinner } from '@/shared/ui/spinner'
import { useControlledSpinner } from '@/shared/hooks/useControllSpinner'

export default function GlobalSpinner() {
  const pathname = usePathname()
  const fetching = useIsFetching()
  const mutating = useIsMutating()
  const active = fetching + mutating > 0

  // 메인페이지, 팀 관리 페이지, 선수 관리 페이지에서는 스피너를 표시하지 않음
  const isHomePage = pathname === '/'
  const isTeamsPage = pathname?.startsWith('/teams')
  const isPlayersPage = pathname?.startsWith('/players')
  const isMatchDetailPage = pathname?.startsWith('/matches/')

  const visible = useControlledSpinner(active, {
    delayBeforeShow: 50,
    minVisibleMs: 500,
  })

  if (!visible || isHomePage || isTeamsPage || isPlayersPage || isMatchDetailPage) return null

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60">
      <Spinner />
    </div>
  )
}
