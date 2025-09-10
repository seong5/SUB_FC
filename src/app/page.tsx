'use client'

import { useEffect, useMemo, useState } from 'react'
import Pagination from '@/components/common/Pagination'
import SearchBar from '@/components/SearchBar'
import DropDown from '@/components/common/DropDown'
import Icon from '@/components/common/Icon'
import MatchInfoCard from '@/components/MatchInfoCard'
import Modal from '@/components/common/Modal'
import Button from '@/components/common/Button'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import api from '@/libs/axios'

import type { PostMatchData, RosterData, QuarterData, ModalVariant } from '@/constants/modal'

type SortOrder = 'latest' | 'oldest'

/** 서버가 /api/matches 에서 내려주는 타입 */
type ServerMatchItem = {
  id: number
  date: string
  opponent: string
  place: string
  score: string
}

/** 서버가 /api/players 에서 내려주는 타입 (필요 시) */
type ServerPlayer = {
  id: number
  name: string
  position: 'GK' | 'DF' | 'MF' | 'FW'
  back_number?: number | null
}

async function fetchMatches(): Promise<ServerMatchItem[]> {
  const { data } = await api.get<ServerMatchItem[]>('/matches')
  return data ?? []
}

async function fetchPlayers(): Promise<
  Array<{
    id: string
    name: string
    position: ServerPlayer['position']
    back_number?: number | null
  }>
> {
  const { data } = await api.get<ServerPlayer[]>('/players')
  return (data ?? []).map((p) => ({
    id: String(p.id),
    name: p.name,
    position: p.position,
    back_number: p.back_number ?? null,
  }))
}

export default function Home() {
  const queryClient = useQueryClient()

  // ✅ 경기 목록 (실데이터)
  const {
    data: matchesData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['matches'],
    queryFn: fetchMatches,
  })

  // ✅ 선수 목록 (Step2/3에서 사용)
  const {
    data: players = [],
    isLoading: isPlayersLoading,
    error: playersError,
  } = useQuery({
    queryKey: ['players'],
    queryFn: fetchPlayers,
  })

  // 페이지네이션/검색/정렬용 로컬 상태
  const [items, setItems] = useState<ServerMatchItem[]>([])
  useEffect(() => {
    if (matchesData) setItems(matchesData)
  }, [matchesData])

  // 모달 상태 & 스텝 데이터
  const [variant, setVariant] = useState<ModalVariant | null>(null)
  const openStep1 = () => setVariant('postMatch')

  const [step1, setStep1] = useState<PostMatchData | null>(null)
  const [step2, setStep2] = useState<RosterData | null>(null)
  const [step3, setStep3] = useState<QuarterData[] | null>(null)

  // 검색/정렬/페이지네이션
  const [page, setPage] = useState(1)
  const [query, setQuery] = useState('')
  const [sortOrder, setSortOrder] = useState<SortOrder>('latest')
  const PAGE_SIZE = 5
  const handleSubmitSearch = () => setPage(1)

  const q = query.trim().toLowerCase()
  const filtered = useMemo(
    () =>
      q
        ? items.filter((m) => [m.opponent, m.place].some((v) => v.toLowerCase().includes(q)))
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

  // Step handlers
  const handleStep1Submit = (data: PostMatchData) => {
    setStep1(data)
    setVariant('postRoster')
  }
  const handleStep2Submit = (data: RosterData) => {
    setStep2(data)
    setVariant('postQuarters')
  }
  const handleStep3Submit = (quarters: QuarterData[]) => {
    setStep3(quarters)
    setVariant('postScores')
  }

  // 최종 제출 (등록 성공 후 목록 갱신)
  const handleStep4Submit = (final: QuarterData[]) => {
    setStep3(final)

    // (선택) 낙관적 카드 1개 추가 – 서버에서 재조회되면 덮어씌워짐
    const optimistic = {
      id: Date.now(),
      date: step1?.date ?? new Date().toISOString(),
      opponent: step1?.opponent ?? '상대팀',
      place: step1?.place ?? '-',
      score: final?.[final.length - 1]?.scoreAfter ?? step1?.score ?? '0-0',
    } satisfies ServerMatchItem
    setItems((prev) => [optimistic, ...prev])

    // 서버 최신화
    queryClient.invalidateQueries({ queryKey: ['matches'] })
    queryClient.invalidateQueries({ queryKey: ['players'] })

    // 리셋
    setVariant(null)
    setStep1(null)
    setStep2(null)
    setStep3(null)
  }

  // 로스터에서 선택된 선수만 득점/도움 후보로
  const eligiblePlayers = useMemo(() => {
    if (!step2 || players.length === 0) return []
    const ids = new Set([...step2.GK, ...step2.DF, ...step2.MF, ...step2.FW]) // string[]
    return players.filter((p) => ids.has(p.id)).map((p) => ({ id: p.id, name: p.name }))
  }, [step2, players])

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
          disabled={isPlayersLoading || !!playersError}
        >
          {isPlayersLoading ? '선수 불러오는 중…' : '경기 등록'}
        </Button>
      </div>

      <ul className="space-y-3 mt-6">
        {current.length > 0 ? (
          current.map((m) => (
            <li key={m.id}>
              <MatchInfoCard match={m} />
            </li>
          ))
        ) : isLoading ? (
          <li className="rounded-md p-6 text-gray-500 text-center">불러오는 중…</li>
        ) : error ? (
          <li className="rounded-md p-6 text-red-500 text-center">목록을 불러오지 못했어요.</li>
        ) : (
          <li className="rounded-md p-6 text-gray-500 text-center">
            검색 결과를 찾을 수 없습니다.
          </li>
        )}
      </ul>

      <div className="flex items-center justify-center mt-6">
        <Pagination
          currentPage={safePage}
          pageSize={5}
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
          players={players} // DB 선수 목록
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
