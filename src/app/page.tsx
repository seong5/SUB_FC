'use client'
import { useEffect, useState } from 'react'
import { matchLocations } from '@/mocks/matchLocation'
import Pagination from '@/components/Pagination'
import SearchBar from '@/components/SearchBar'
import DropDown from '@/components/DropDown'
import Icon from '@/components/Icon'

type SortOrder = 'latest' | 'oldest'

export default function Home() {
  const [page, setPage] = useState(1)
  const [query, setQuery] = useState('')
  const [sortOrder, setSortOrder] = useState<SortOrder>('latest')
  const PAGE_SIZE = 5

  const handleSubmit = () => setPage(1)

  // 검색 적용
  const q = query.trim().toLowerCase()
  const filtered = q
    ? matchLocations.filter((loc) =>
        [loc.name, loc.address].some((v) => v.toLowerCase().includes(q))
      )
    : matchLocations

  // 👉 정렬 적용 (useMemo 없이 그냥 바로)
  const sorted = [...filtered].sort((a, b) => {
    const da = new Date(a.date).getTime()
    const db = new Date(b.date).getTime()
    return sortOrder === 'latest' ? db - da : da - db
  })

  // 페이지네이션 계산
  const totalCount = sorted.length
  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE))
  const safePage = Math.min(page, totalPages)
  const start = (safePage - 1) * PAGE_SIZE
  const current = sorted.slice(start, start + PAGE_SIZE)

  useEffect(() => {
    setPage(1) // 검색어나 정렬이 바뀌면 1페이지로
  }, [query, sortOrder])

  return (
    <main className="bg-primary-100 p-20">
      <SearchBar value={query} onChange={setQuery} onSubmit={handleSubmit} />
      <div className="flex justify-end">
        <DropDown
          trigger={
            <div className="flex items-center gap-2 min-w-90 bg-white rounded-full my-10 px-8 py-4 text-black cursor-pointer">
              <span>{sortOrder === 'latest' ? '최근순' : '오래된순'}</span>
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
      <ul className="space-y-3 mt-4">
        {current.length > 0 ? (
          current.map((loc) => (
            <li key={loc.id} className="rounded-md border p-3 bg-white">
              <p>{loc.date}</p>
              <p className="font-semibold text-gray-900">{loc.name}</p>
              <p className="text-sm text-gray-500">{loc.address}</p>
            </li>
          ))
        ) : (
          <li className="rounded-md p-6 text-gray-500 text-center">
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
    </main>
  )
}
