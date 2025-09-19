'use client'

import { useMemo, useState, useEffect } from 'react'
import Pagination from '@/components/common/Pagination'
import SearchBar from '@/components/main/SearchBar'
import DropDown from '@/components/common/DropDown'
import Icon from '@/components/common/Icon'
import MatchInfoCard from '@/components/main/MatchInfoCard'
import Modal from '@/components/common/Modal'
import Button from '@/components/common/Button'
import { useQuery } from '@tanstack/react-query'
import { useMatchesQuery, useCreateMatchMutation } from '@/hooks/useMatches'
import api from '@/libs/axios'

import type { ModalVariant } from '@/constants/modal'
import type {
  UIMatchSummary,
  CreateMatchPayload,
  PostMatchData,
  RosterData,
  QuarterData,
} from '@/types/match'
import Spinner from '@/components/common/spinner/Spinner'

type SortOrder = 'latest' | 'oldest'

/** 서버가 /api/players 에서 내려주는 타입 */
type ServerPlayer = {
  id: number
  name: string
  position: 'GK' | 'DF' | 'MF' | 'FW'
  back_number: number | null
}

/** UI에서 사용할 선수 타입 */
type UIPlayer = {
  id: string
  name: string
  position: ServerPlayer['position']
  back_number: number | null
}

async function fetchPlayers(): Promise<UIPlayer[]> {
  const { data } = await api.get<ServerPlayer[]>('/players')
  const list = data ?? []
  return list.map((p) => ({
    id: String(p.id),
    name: p.name,
    position: p.position,
    back_number: p.back_number,
  }))
}

export default function Home() {
  // 경기 목록
  const {
    data: matchesData = [],
    isLoading: isMatchesLoading,
    error: matchesError,
  } = useMatchesQuery()

  // 선수 목록 (Step2/3에서 사용)
  const {
    data: players = [],
    isLoading: isPlayersLoading,
    error: playersError,
  } = useQuery<UIPlayer[]>({
    queryKey: ['players'],
    queryFn: fetchPlayers,
  })

  // 모달 상태 & 스텝 데이터
  const [variant, setVariant] = useState<ModalVariant | null>(null)
  const openStep1 = () => setVariant('postMatch')

  const [step1, setStep1] = useState<PostMatchData | null>(null)
  const [step2, setStep2] = useState<RosterData | null>(null)
  const [step3, setStep3] = useState<QuarterData[] | null>(null)

  // 검색/정렬/페이지네이션
  const [page, setPage] = useState<number>(1)
  const [query, setQuery] = useState<string>('')
  const [sortOrder, setSortOrder] = useState<SortOrder>('latest')
  const PAGE_SIZE = 5
  const handleSubmitSearch = () => setPage(1)

  const items: UIMatchSummary[] = matchesData

  const q = query.trim().toLowerCase()
  const filtered = useMemo<UIMatchSummary[]>(
    () =>
      q
        ? items.filter((m) => [m.opponent, m.place].some((v) => v.toLowerCase().includes(q)))
        : items,
    [items, q]
  )

  const sorted = useMemo<UIMatchSummary[]>(() => {
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

  // 경기 등록 뮤테이션
  const createMatch = useCreateMatchMutation()

  // 최종 제출 (등록 성공 후 목록 갱신)
  const handleStep4Submit = (final: QuarterData[]) => {
    if (!step1 || !step2) return

    // quarter 번호 보강
    const quartersPayload: QuarterData[] = final.map((q, i) => ({
      ...q,
      quarter: (i + 1) as 1 | 2 | 3 | 4,
    }))

    const payload: CreateMatchPayload = {
      match: {
        date: step1.date,
        opponent: step1.opponent,
        place: step1.place,
        score: step1.score,
      },
      roster: {
        formation: step2.formation,
        GK: step2.GK,
        DF: step2.DF,
        MF: step2.MF,
        FW: step2.FW,
      },
      quarters: quartersPayload,
    }

    createMatch.mutate(payload, {
      onSuccess: () => {
        setVariant(null)
        setStep1(null)
        setStep2(null)
        setStep3(null)
      },
      onError: (err) => alert(err.message),
    })
  }

  // 로스터에서 선택된 선수만 득점/도움 후보로
  const eligiblePlayers = useMemo<Array<{ id: string; name: string }>>(() => {
    if (!step2 || players.length === 0) return []
    const ids = new Set<string>([...step2.GK, ...step2.DF, ...step2.MF, ...step2.FW])
    return players.filter((p) => ids.has(p.id)).map((p) => ({ id: p.id, name: p.name }))
  }, [step2, players])

  return (
    <main className="bg-sub-gray rounded-[16px] p-20">
      <SearchBar value={query} onChange={setQuery} onSubmit={handleSubmitSearch} />

      <div className="mt-20 flex items-center justify-between">
        <div className="flex items-center gap-3">
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

        <Button
          variant="primary"
          className="rounded-[20px] txt-16_B w-250 md:w-500 h-47 px-12 py-4"
          onClick={openStep1}
          disabled={isPlayersLoading || Boolean(playersError)}
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
        ) : isMatchesLoading ? (
          <li className="rounded-md p-6 text-gray-500 text-center">
            <Spinner />
          </li>
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
