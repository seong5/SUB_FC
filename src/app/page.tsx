'use client'
import { useState } from 'react'
import { matchLocations } from '@/mocks/matchLocation'
import Pagination from '@/components/Pagination'
import SearchBar from '@/components/SearchBar'

export default function Home() {
  const [page, setPage] = useState(1)
  const PAGE_SIZE = 5 //해당 페이지에서 보여줄 갯수
  const totalCount = matchLocations.length

  const start = (page - 1) * PAGE_SIZE
  const current = matchLocations.slice(start, start + PAGE_SIZE)

  return (
    <main className="bg-primary-100 p-4">
      <SearchBar />
      <ul className="space-y-3">
        {current.map((loc) => (
          <li key={loc.id} className="rounded-md border p-3 bg-white">
            <p className="font-semibold text-gray-900">{loc.name}</p>
            <p className="text-sm text-gray-500">{loc.address}</p>
          </li>
        ))}
      </ul>
      <div className="flex items-center justify-center mt-6">
        <Pagination
          currentPage={page}
          pageSize={PAGE_SIZE}
          totalCount={totalCount}
          onPageChange={setPage}
        />
      </div>
    </main>
  )
}
