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
import { useQuery, useQueryClient } from '@tanstack/react-query'
import api from '@/libs/axios'

import type { PostMatchData, RosterData, QuarterData, ModalVariant } from '@/constants/modal'

type SortOrder = 'latest' | 'oldest'

/** 서버가 /api/matches 에서 내려주는 원본 타입(예상) */
type ServerMatchItem = {
  id: number
  date: string
  opponent: string
  place: string
  score: string
}

/** UI 리스트 카드에서 쓰는 아이템 타입 */
type UIMatchItem = { id: number; name: string; address: string; date: string }

/** 서버가 /api/players 에서 내려주는 원본 타입 */
type ServerPlayer = {
  id: number // int8
  name: string
  position: 'GK' | 'DF' | 'MF' | 'FW'
  back_number?: number | null
  goals?: number
  assists?: number
  attendance_matches?: number
}

/** 모달에서 사용할 플레이어 타입(id는 string으로 통일) */
type UIPlayer = {
  id: string
  name: string
  position: 'GK' | 'DF' | 'MF' | 'FW'
  back_number?: number | null
}

/* Fetchers (컴포넌트 밖에 정의) */
async function fetchMatches(): Promise<UIMatchItem[]> {
  const { data } = await api.get<ServerMatchItem[]>('/matches')
  return data.map((it) => ({
    id: it.id,
    name: it.opponent,
    address: it.place,
    date: it.date,
  }))
}

async function fetchPlayers(): Promise<UIPlayer[]> {
  const { data } = await api.get<ServerPlayer[]>('/players')
  // 모달/로스터에서 id를 string으로 쓰는 경우가 많으므로 문자열로 통일
  return (data ?? []).map((p) => ({
    id: String(p.id),
    name: p.name,
    position: p.position,
    back_number: p.back_number ?? null,
  }))
}

export default function Home() {
  const queryClient = useQueryClient()

  // 경기 목록 불러오기
  const {
    data: matchesData,
    isLoading: isMatchesLoading,
    error: matchesError,
  } = useQuery({
    queryKey: ['matches'],
    queryFn: fetchMatches,
  })

  // 선수 목록 불러오기
  const {
    data: players = [],
    isLoading: isPlayersLoading,
    error: playersError,
  } = useQuery({
    queryKey: ['players'],
    queryFn: fetchPlayers,
  })

  // 페이지 내부에서 검색/정렬/페이지네이션에 사용하는 원본 배열
  const [items, setItems] = useState<UIMatchItem[]>([...MOCKS])

  // 서버 데이터가 오면 한번만 덮어쓰기
  useEffect(() => {
    if (matchesData) setItems(matchesData)
  }, [matchesData])

  // 모달 상태
  const [variant, setVariant] = useState<ModalVariant | null>(null)
  const openStep1 = () => setVariant('postMatch')

  // 스텝 데이터
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

  // Step1 → Step2
  const handleStep1Submit = (data: PostMatchData) => {
    setStep1(data)
    setVariant('postRoster')
  }

  // Step2 → Step3
  const handleStep2Submit = (data: RosterData) => {
    setStep2(data)
    setVariant('postQuarters')
  }

  // Step3 → Step4
  const handleStep3Submit = (quarters: QuarterData[]) => {
    setStep3(quarters)
    setVariant('postScores')
  }

  // Step4 완료
  const handleStep4Submit = (final: QuarterData[]) => {
    setStep3(final)

    // (선택) 낙관적 추가
    const nextId = (items.reduce((m, it) => Math.max(m, it.id), 0) || 0) + 1
    const optimistic: UIMatchItem = {
      id: nextId,
      name: step1?.opponent ?? '상대팀',
      address: step1?.place ?? '-',
      date: step1?.date ?? new Date().toISOString(),
    }
    setItems((prev) => [optimistic, ...prev])

    // 실제 등록 API 성공 시 목록 최신화
    queryClient.invalidateQueries({ queryKey: ['matches'] })
    queryClient.invalidateQueries({ queryKey: ['players'] })

    // 리셋
    setVariant(null)
    setStep1(null)
    setStep2(null)
    setStep3(null)
  }

  // Step2 → Step3/4에 넘길 득점/도움 후보(로스터 선택된 선수만)
  const eligiblePlayers = useMemo(() => {
    if (!step2 || players.length === 0) return []
    const ids = new Set([...step2.GK, ...step2.DF, ...step2.MF, ...step2.FW]) // string[]
    return players
      .filter((p) => ids.has(p.id)) // p.id 는 string (fetchPlayers에서 변환)
      .map((p) => ({ id: p.id, name: p.name }))
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
          disabled={isPlayersLoading || !!playersError} // 선수 없으면 등록 비활성화(선택)
        >
          {isPlayersLoading ? '선수 불러오는 중…' : '경기 등록'}
        </Button>
      </div>

      <ul className="space-y-3 mt-6">
        {current.length > 0 ? (
          current.map((loc) => (
            <li key={loc.id}>
              <MatchInfoCard matchId={loc.id} />
            </li>
          ))
        ) : isMatchesLoading ? (
          <li className="rounded-md p-6 text-gray-500 text-center">불러오는 중…</li>
        ) : matchesError ? (
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

      {/* Step2: DB에서 불러온 players 사용 */}
      {variant === 'postRoster' && (
        <Modal
          variant="postRoster"
          onBack={() => setVariant('postMatch')}
          onClose={() => setVariant(null)}
          onSubmit={handleStep2Submit}
          players={players} // ← DB 선수
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
          eligiblePlayers={eligiblePlayers} // ← 로스터에서 고른 선수만
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
