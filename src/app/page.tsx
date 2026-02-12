'use client'

import { useMemo, useState } from 'react'
import { Modal, Button } from '@/shared'
import { MatchList } from '@/widgets/match-list'
import { WinRate } from '@/features/team-stats'
import { useQuery } from '@tanstack/react-query'
import { useMatchesQuery, useCreateMatchMutation } from '@/entities/match'
import { api } from '@/shared/api'
import { useIsLoggedIn, useAuthLoading } from '@/shared/lib/store'
import { Plus } from 'lucide-react'

import type { ModalVariant } from '@/shared/config/modal'
import type {
  CreateMatchPayload,
  PostMatchData,
  RosterData,
  QuarterData,
} from '@/entities/match'

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
  const isLoggedIn = useIsLoggedIn()
  const authLoading = useAuthLoading()

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
  const [step4, setStep4] = useState<QuarterData[] | null>(null)
  const [step5, setStep5] = useState<string[] | null>(null)


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

  const handleStep4Submit = (final: QuarterData[]) => {
    setStep4(final)
    setVariant('postMom')
  }

  // 경기 등록 뮤테이션
  const createMatch = useCreateMatchMutation()

  // 최종 제출 (등록 성공 후 목록 갱신)
  const handleStep5Submit = (momPlayerIds: string[]) => {
    if (!step1 || !step2 || !step4) return

    // quarter 번호 보강
    const quartersPayload: QuarterData[] = step4.map((q, i) => ({
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
      mom_player_ids: momPlayerIds.length > 0 ? momPlayerIds : undefined,
    }

    createMatch.mutate(payload, {
      onSuccess: () => {
        setVariant(null)
        setStep1(null)
        setStep2(null)
        setStep3(null)
        setStep4(null)
        setStep5(null)
      },
      onError: (err: unknown) => {
        console.error('경기 등록 에러:', err)
        // 서버에서 반환한 에러 메시지 확인
        let errorMessage = '경기 등록에 실패했습니다.'

        if (err && typeof err === 'object') {
          const error = err as {
            response?: { data?: { error?: string; details?: string } }
            message?: string
          }
          errorMessage =
            error.response?.data?.error ||
            error.response?.data?.details ||
            error.message ||
            errorMessage
        } else if (err instanceof Error) {
          errorMessage = err.message
        }

        console.error('서버 에러 메시지:', err)
        alert(`경기 등록 실패: ${errorMessage}`)
      },
    })
  }

  // 로스터에서 선택된 선수만 득점/도움 후보로
  const eligiblePlayers = useMemo<Array<{ id: string; name: string }>>(() => {
    if (!step2 || players.length === 0) return []
    const ids = new Set<string>([...step2.GK, ...step2.DF, ...step2.MF, ...step2.FW])
    return players
      .filter((p) => ids.has(String(p.id))) // 플레이어 id는 number, 로스터 id는 string이라 변환
      .map((p) => ({ id: String(p.id), name: p.name }))
  }, [step2, players])

  return (
    <div className="min-h-screen bg-[#020617]">
      <main className="rounded-b-[16px] p-20 space-y-16 md:px-40">
        <div className="flex justify-end">
          <Button
            variant="primary"
            className="rounded-[20px] txt-16_B w-170 md:w-300 h-47 px-12 py-4 flex items-center justify-center gap-2"
            icon={isLoggedIn ? <Plus size={20} className="shrink-0" /> : undefined}
            onClick={isLoggedIn ? openStep1 : undefined}
            disabled={authLoading || !isLoggedIn || isPlayersLoading || Boolean(playersError)}
          >
            {!isLoggedIn
              ? '로그인이 필요합니다.'
              : isPlayersLoading
                ? '선수 불러오는 중…'
                : '경기 등록하기'}
          </Button>
        </div>
        <WinRate />
        <MatchList matches={matchesData} isLoading={isMatchesLoading} error={matchesError} />

        {/* Step1 */}
        {variant === 'postMatch' && (
          <Modal
            variant="postMatch"
            onClose={() => setVariant(null)}
            onSubmit={handleStep1Submit}
          />
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

        {/* Step5 */}
        {variant === 'postMom' && (
          <Modal
            variant="postMom"
            onBack={() => setVariant('postScores')}
            onClose={() => setVariant(null)}
            onSubmit={handleStep5Submit}
            eligiblePlayers={eligiblePlayers}
            initial={step5 ?? undefined}
          />
        )}
      </main>
    </div>
  )
}
