'use client'
import { useEffect, useState } from 'react'
import { matchLocations } from '@/mocks/matchLocation'
import Pagination from '@/components/Pagination'
import SearchBar from '@/components/SearchBar'

export default function Home() {
  const [page, setPage] = useState(1)
  const [query, setQuery] = useState('')
  const PAGE_SIZE = 5

  const handleSubmit = () => setPage(1) // 검색 시 페이지를 1페이지로 설정

  const q = query.trim().toLowerCase()
  const filtered = q
    ? matchLocations.filter((loc) =>
        [loc.name, loc.address].some((v) => v.toLowerCase().includes(q))
      )
    : matchLocations

  const totalCount = filtered.length
  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE))
  const safePage = Math.min(page, totalPages)
  const start = (safePage - 1) * PAGE_SIZE
  const current = filtered.slice(start, start + PAGE_SIZE)

  useEffect(() => {}, [query])

  return (
    <main className="bg-primary-100 p-4">
      <SearchBar value={query} onChange={setQuery} onSubmit={handleSubmit} />

      <ul className="space-y-3 mt-4">
        {current.length > 0 ? (
          current.map((loc) => (
            <li key={loc.id} className="rounded-md border p-3 bg-white">
              <p className="font-semibold text-gray-900">{loc.name}</p>
              <p className="text-sm text-gray-500">{loc.address}</p>
            </li>
          ))
        ) : (
          <li className="rounded-md border p-6 bg-white text-gray-500 text-center">
            검색 결과가 없어요.
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
