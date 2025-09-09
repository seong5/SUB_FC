'use client'
import { useEffect, useMemo, useState } from 'react'
import { matchLocations as MOCKS } from '@/mocks/matchLocation'
import Pagination from '@/components/common/Pagination'
import SearchBar from '@/components/SearchBar'
import DropDown from '@/components/common/DropDown'
import Icon from '@/components/common/Icon'
import MatchInfoCard from '@/components/MatchInfoCard'
import Modal from '@/components/common/Modal'
import Button from '@/components/common/Button'

// ▼ 추가: 모달 타입/프롭(프로젝트 정의에 맞춰 import)
import type {
  PostMatchData, // Step1 데이터 { date, opponent, place, score }
  RosterData, // Step2 데이터 { formation, GK, DF, MF, FW }
  QuarterData, // Step3/4 데이터 { goals[], conceded, scoreAfter }
  ModalVariant,
} from '@/constants/modal'

type SortOrder = 'latest' | 'oldest'

// ▼ 예시 플레이어(나중에 실제 데이터로 대체)
const players = [
  { id: 'u1', name: '김GK', position: 'GK' as const },
  { id: 'u2', name: '박DF', position: 'DF' as const },
  { id: 'u3', name: '이DF', position: 'DF' as const },
  { id: 'u4', name: '최MF', position: 'MF' as const },
  { id: 'u5', name: '정MF', position: 'MF' as const },
  { id: 'u6', name: '한FW', position: 'FW' as const },
  { id: 'u7', name: '문FW', position: 'FW' as const },
]

export default function Home() {
  const [items, setItems] = useState([...MOCKS])

  // ▼ 멀티스텝 모달 상태
  const [variant, setVariant] = useState<ModalVariant | null>(null)
  const openStep1 = () => setVariant('postMatch')

  // ▼ 스텝 데이터 (등록 페이로드 임시 보관)
  const [step1, setStep1] = useState<PostMatchData | null>(null)
  const [step2, setStep2] = useState<RosterData | null>(null)
  const [step3, setStep3] = useState<QuarterData[] | null>(null)

  // ▼ 검색/정렬/페이지네이션 (기존 그대로)
  const [page, setPage] = useState(1)
  const [query, setQuery] = useState('')
  const [sortOrder, setSortOrder] = useState<SortOrder>('latest')
  const PAGE_SIZE = 5
  const handleSubmitSearch = () => setPage(1)
  const q = query.trim().toLowerCase()
  const filtered = useMemo(
    () =>
      q
        ? items.filter((loc) => [loc.name, loc.address].some((v) => v.toLowerCase().includes(q)))
        : items,
    [items, q]
  )
  const sorted = useMemo(() => {
    const copy = [...filtered]
    copy.sort((a, b) =>
      sortOrder === 'latest'
        ? new Date(b.date).getTime() - new Date(a.date).getTime()
        : new Date(a.date).getTime() - new Date(b.date).getTime()
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

  // Step1 완료 → Step2로
  const handleStep1Submit = (data: PostMatchData) => {
    setStep1(data)
    setVariant('postRoster')
  }

  // Step2 완료 → Step3로
  const handleStep2Submit = (data: RosterData) => {
    setStep2(data)
    setVariant('postQuarters')
  }

  // Step3 완료 → Step4로
  const handleStep3Submit = (quarters: QuarterData[]) => {
    setStep3(quarters)
    setVariant('postScores')
  }

  // Step4 완료(최종) → 리스트 반영 + 모달 닫기
  const handleStep4Submit = (final: QuarterData[]) => {
    setStep3(final)

    const nextId = (items.reduce((m, it) => Math.max(m, it.id), 0) || 0) + 1
    const newItem = {
      id: nextId,
      name: step1?.opponent ?? '상대팀',
      address: step1?.place ?? '-',
      date: step1?.date ?? new Date().toISOString(),
    }
    setItems((prev) => [newItem, ...prev])

    // 최종 종료
    setVariant(null)
    setStep1(null)
    setStep2(null)
    setStep3(null)
  }

  // Step2 → Step3/4에 넘길 득점/도움 후보(로스터 선택된 선수만)
  const eligiblePlayers = useMemo(() => {
    if (!step2) return []
    const ids = new Set([...step2.GK, ...step2.DF, ...step2.MF, ...step2.FW])
    return players.filter((p) => ids.has(p.id)).map((p) => ({ id: p.id, name: p.name }))
  }, [step2])

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
          onClick={openStep1}
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

      {/* Step1 */}
      {variant === 'postMatch' && (
        <Modal variant="postMatch" onClose={() => setVariant(null)} onSubmit={handleStep1Submit} />
      )}

      {/* Step2 */}
      {variant === 'postRoster' && (
        <Modal
          variant="postRoster"
          onBack={() => setVariant('postMatch')}
          onClose={() => setVariant(null)}
          onSubmit={handleStep2Submit}
          players={players}
          initial={step2 ?? undefined}
        />
      )}

      {/* Step3 */}
      {variant === 'postQuarters' && (
        <Modal
          variant="postQuarters"
          onBack={() => setVariant('postRoster')}
          onClose={() => setVariant(null)}
          onSubmit={handleStep3Submit}
          eligiblePlayers={eligiblePlayers}
          initial={step3 ?? undefined}
        />
      )}

      {/* Step4 */}
      {variant === 'postScores' && (
        <Modal
          variant="postScores"
          onBack={() => setVariant('postQuarters')}
          onClose={() => setVariant(null)}
          onSubmit={handleStep4Submit}
          eligiblePlayers={eligiblePlayers}
          initial={step3 ?? undefined}
        />
      )}
    </main>
  )
}
