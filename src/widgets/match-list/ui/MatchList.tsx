'use client'

import { useMemo, useState, useEffect } from 'react'
import { Pagination, DropDown, Icon } from '@/shared'
import { SearchBar } from '@/features/match-search'
import { MatchCard, MatchCardSkeleton } from '@/entities/match'
import type { UIMatchSummary } from '@/entities/match'

type SortOrder = 'latest' | 'oldest'

interface MatchListProps {
  matches: UIMatchSummary[]
  isLoading?: boolean
  error?: Error | null
}

// MatchList는 이미 props로 데이터를 받고 있으므로 변경 불필요

const PAGE_SIZE = 6

export default function MatchList({ matches, isLoading = false, error = null }: MatchListProps) {
  const [page, setPage] = useState<number>(1)
  const [query, setQuery] = useState<string>('')
  const [sortOrder, setSortOrder] = useState<SortOrder>('latest')

  const handleSubmitSearch = () => setPage(1)

  const q = query.trim().toLowerCase()
  const filtered = useMemo<UIMatchSummary[]>(
    () =>
      q
        ? matches.filter((m) => [m.opponent, m.place].some((v) => v.toLowerCase().includes(q)))
        : matches,
    [matches, q],
  )

  const sorted = useMemo<UIMatchSummary[]>(() => {
    const copy = [...filtered]
    copy.sort((a, b) =>
      sortOrder === 'latest'
        ? new Date(b.date).getTime() - new Date(a.date).getTime()
        : new Date(a.date).getTime() - new Date(b.date).getTime(),
    )
    return copy
  }, [filtered, sortOrder])

  const totalCount = sorted.length
  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE))
  const safePage = Math.min(page, totalPages)
  const start = (safePage - 1) * PAGE_SIZE
  const current = sorted.slice(start, start + PAGE_SIZE)

  useEffect(() => {
    setPage(1)
  }, [query, sortOrder])

  return (
    <div className="space-y-16">
      <SearchBar value={query} onChange={setQuery} onSubmit={handleSubmitSearch} />
      <div className="mt-20 flex items-center gap-3">
        <DropDown
          trigger={
            <div className="flex items-center gap-2 min-w-90 min-h-47 justify-center border-2 border-sub-red bg-white rounded-full px-8 py-4 text-black cursor-pointer">
              <span className="txt-16_M">{sortOrder === 'latest' ? '최근순' : '오래된순'}</span>
              <Icon icon="ChevDown" />
            </div>
          }
          position="bottom"
          items={[
            { text: '최근순', onClick: () => setSortOrder('latest') },
            { text: '오래된순', onClick: () => setSortOrder('oldest') },
          ]}
        />
      </div>

      <ul className="mt-6 grid grid-cols-2 gap-4">
        {isLoading ? (
          Array.from({ length: PAGE_SIZE }).map((_, index) => (
            <li key={`skeleton-${index}`}>
              <MatchCardSkeleton />
            </li>
          ))
        ) : current.length > 0 ? (
          current.map((m) => (
            <li key={m.id}>
              <MatchCard match={m} />
            </li>
          ))
        ) : error ? (
          <li className="col-span-2 rounded-md p-6 text-center text-red-500">
            목록을 불러오지 못했어요.
          </li>
        ) : (
          <li className="col-span-2 rounded-md p-6 text-center text-gray-500">
            검색 결과를 찾을 수 없습니다.
          </li>
        )}
      </ul>

      <div className="flex items-center justify-center mt-6">
        <Pagination
          currentPage={safePage}
          pageSize={PAGE_SIZE}
          totalCount={totalCount}
          onPageChange={setPage}
        />
      </div>
    </div>
  )
}
