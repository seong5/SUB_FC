'use client'

import { useState } from 'react'
import { matchLocations } from '@/mocks/matchLocation'
import Button from './Button'

export default function SearchBar() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState(matchLocations)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const q = query.trim().toLowerCase()

    // 빈 검색어면 전체
    if (!q) {
      setResults(matchLocations)
      return
    }
    // name 과 address 로 검색가능
    const filtered = matchLocations.filter((loc) => {
      const name = loc.name.toLowerCase()
      const addr = loc.address.toLowerCase()
      return name.includes(q) || addr.includes(q)
    })

    setResults(filtered)
  }
  return (
    <div className="p-20">
      <form onSubmit={handleSearch} className="flex gap-10 md:gap-20">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="축구장 혹은 주소를 입력해주세요."
          className="flex-1 bg-white txt-12_M md:txt-16_M md:w-full md:h-70 rounded-[20px] px-15 py-10 card-shadow"
        />
        <Button
          variant="primary"
          size="md"
          className="w-full rounded-[20px] txt-12_M md:txt-20_M w-100 md:w-full md:h-70"
        >
          검색
        </Button>
      </form>
      <ul className="mt-10 space-y-2">
        {results.length > 0 ? (
          results.map((loc) => (
            <li key={loc.id} className="border p-3 rounded">
              <p className="font-bold">{loc.name}</p>
              <p className="text-sm text-gray-500">{loc.address}</p>
            </li>
          ))
        ) : (
          <p className="text-gray-500">검색 결과가 없습니다.</p>
        )}
      </ul>
    </div>
  )
}
