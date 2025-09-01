'use client'
import { useEffect, useMemo, useState } from 'react'
import { matchLocations as MOCKS } from '@/mocks/matchLocation'
import Pagination from '@/components/Pagination'
import SearchBar from '@/components/SearchBar'
import DropDown from '@/components/DropDown'
import Icon from '@/components/Icon'
import MatchInfoCard from '@/components/MatchInfoCard'
import Modal from '@/components/Modal'
import type { PostMatchData } from '@/constants/modal'
import Button from '@/components/Button'

type SortOrder = 'latest' | 'oldest'

export default function Home() {
  // 목록을 로컬 상태로 복사해서 관리 (모달 등록 시 여기로 push)
  const [items, setItems] = useState([...MOCKS])
  const [isOpen, setIsOpen] = useState(false)
  const [page, setPage] = useState(1)
  const [query, setQuery] = useState('')
  const [sortOrder, setSortOrder] = useState<SortOrder>('latest')
  const PAGE_SIZE = 5

  const handleSubmitSearch = () => setPage(1)

  // 검색
  const q = query.trim().toLowerCase()
  const filtered = useMemo(
    () =>
      q
        ? items.filter((loc) => [loc.name, loc.address].some((v) => v.toLowerCase().includes(q)))
        : items,
    [items, q]
  )

  // 정렬
  const sorted = useMemo(() => {
    const copy = [...filtered]
    copy.sort((a, b) => {
      const da = new Date(a.date).getTime()
      const db = new Date(b.date).getTime()
      return sortOrder === 'latest' ? db - da : da - db
    })
    return copy
  }, [filtered, sortOrder])

  // 페이지네이션 계산
  const totalCount = sorted.length
  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE))
  const safePage = Math.min(page, totalPages)
  const start = (safePage - 1) * PAGE_SIZE
  const current = sorted.slice(start, start + PAGE_SIZE)

  useEffect(() => {
    setPage(1)
  }, [query, sortOrder])

  // 모달 onSubmit → 로컬 목록에 추가
  const handleCreateMatch = (data: PostMatchData) => {
    // data: { date: 'YYYY-MM-DD', place, score, opponent }
    // matchLocations mock에 맞춰 최소 필드 채워 넣기 (name은 opponent 기준 예시)
    const nextId = (items.reduce((m, it) => Math.max(m, it.id), 0) || 0) + 1
    const newItem = {
      id: nextId,
      name: data.opponent, // 예: 카드에서 팀명으로 사용한다면 opponent를 name에 매핑
      address: data.place,
      date: data.date,
    }
    setItems((prev) => [newItem, ...prev])
  }
  return (
    <main className="bg-primary-100 p-20">
      <SearchBar value={query} onChange={setQuery} onSubmit={handleSubmitSearch} />
      <div className="mt-20 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <DropDown
            trigger={
              <div className="flex items-center gap-2 min-w-90 min-h-47 justify-center bg-white rounded-full px-8 py-4 text-black cursor-pointer">
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
        <Button
          variant="primary"
          className="rounded-[20px] txt-16_B w-250 md:w-500 h-47 px-12 py-4"
          onClick={() => setIsOpen(true)}
        >
          경기 등록
        </Button>
      </div>
      <ul className="space-y-3 mt-6">
        {current.length > 0 ? (
          current.map((loc) => (
            <li key={loc.id}>
              <MatchInfoCard matchId={loc.id} />
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
      {isOpen && (
        <Modal
          variant="postMatch"
          onClose={() => setIsOpen(false)}
          onSubmit={(data) => {
            handleCreateMatch(data)
            setIsOpen(false)
          }}
        />
      )}
    </main>
  )
}
