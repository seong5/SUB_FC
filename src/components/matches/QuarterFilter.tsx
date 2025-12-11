'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { QuarterLabel } from '@/mocks/QuarterScores'
import Icon from '../common/Icon'
import DropDown from '../common/DropDown'
import Modal from '../common/Modal'
import { patchMatch, patchRoster, patchQuarters, patchScores } from '@/libs/matchesApi'
import { useDeleteMatchMutation } from '@/hooks/useMatches'
import type { PostMatchData, RosterData, QuarterData } from '@/types/match'
import { useIsLoggedIn } from '@/store/useAuthStore'

interface TypeFilterProps {
  selectedType: QuarterLabel | ''
  onChange: (type: QuarterLabel | '') => void
  matchId: number
  initialMatch: PostMatchData
  initialRoster?: RosterData
  initialQuarters?: QuarterData[]
  initialScores?: QuarterData[]
  players?: { id: string; name: string; position: 'GK' | 'DF' | 'MF' | 'FW' }[]
  onRefetch?: () => void
}

type FlowStep = 'match' | 'roster' | 'quarters' | 'scores'
type FlowState = { mode: 'edit'; step: FlowStep } | null

const TYPES = ['1 쿼터', '2 쿼터', '3 쿼터', '4 쿼터'] as const

export default function QuarterFilter({
  selectedType,
  onChange,
  matchId,
  initialMatch,
  initialRoster,
  initialQuarters,
  initialScores,
  players = [],
  onRefetch,
}: TypeFilterProps) {
  const [openDelete, setOpenDelete] = useState(false)
  const [flow, setFlow] = useState<FlowState>(null)
  const isLoggedIn = useIsLoggedIn()
  const router = useRouter()
  const deleteMatchMutation = useDeleteMatchMutation()

  // 삭제
  const handleDelete = async () => {
    try {
      await deleteMatchMutation.mutateAsync(matchId)
      setOpenDelete(false)
      alert('삭제가 완료되었습니다.')
      // 삭제 성공 후 홈으로 이동하고 강제 새로고침
      router.push('/')
      router.refresh() // Next.js 서버 컴포넌트 캐시도 새로고침
    } catch (err) {
      console.error(err)
      alert('삭제에 실패했습니다.')
    }
  }

  // ---- Step1: 경기 기본 정보 ----
  const handleStep1 = async (payload: PostMatchData) => {
    await patchMatch(matchId, payload)
    setFlow({ mode: 'edit', step: 'roster' })
  }

  // ---- Step2: 명단/포메이션 ----
  const handleStep2 = async (payload: RosterData) => {
    await patchRoster(matchId, payload)
    setFlow({ mode: 'edit', step: 'quarters' })
  }

  // ---- Step3: 쿼터별 스코어 ----
  const handleStep3 = async (payload: QuarterData[]) => {
    await patchQuarters(matchId, payload)
    setFlow({ mode: 'edit', step: 'scores' })
  }

  // ---- Step4: 득점/도움 ----
  const handleStep4 = async (payload: QuarterData[]) => {
    await patchScores(matchId, payload)
    setFlow(null)
    onRefetch?.()
    alert('수정이 완료되었습니다.')
  }

  return (
    <section>
      <div className="flex flex-row justify-between items-center text-gray-800 txt-28_M md:txt-32_M mb-2">
        Quaters
        {isLoggedIn && (
          <DropDown
            trigger={
              <button type="button">
                <Icon icon="More" className="w-22 h-22 text-black" />
              </button>
            }
            items={[
              { text: '수정하기', onClick: () => setFlow({ mode: 'edit', step: 'match' }) },
              { text: '삭제하기', onClick: () => setOpenDelete(true) },
            ]}
            position="left"
          />
        )}
      </div>

      {/* 쿼터 선택 버튼 */}
      <div className="flex gap-10 mt-20">
        {TYPES.map((type) => (
          <div
            key={type}
            className={`inline-flex items-center justify-center w-80 md:w-100 h-40 md:h-42 px-4 border rounded-full cursor-pointer transition
              ${
                selectedType === type
                  ? 'bg-sub-navy text-white border'
                  : 'bg-white text-black border-gray-200 hover:border-gray-100 hover:bg-blue-800 hover:text-white'
              }`}
            onClick={() => onChange(selectedType === type ? '' : type)}
          >
            {type}
          </div>
        ))}
      </div>

      {/* 삭제 모달 */}
      {openDelete && (
        <Modal
          onClose={() => setOpenDelete(false)}
          variant="warning"
          message="정말 삭제하시겠습니까?"
          onCancel={() => setOpenDelete(false)}
          onConfirm={handleDelete}
          cancelText="아니오"
          confirmText={deleteMatchMutation.isPending ? '삭제 중' : '삭제하기'}
        />
      )}

      {/*  수정하기 */}
      {flow?.step === 'match' && (
        <Modal
          variant="postMatch"
          mode="edit"
          initial={initialMatch}
          onClose={() => setFlow(null)}
          onSubmit={handleStep1}
        />
      )}

      {flow?.step === 'roster' && (
        <Modal
          variant="postRoster"
          mode="edit"
          initial={initialRoster}
          players={players}
          onBack={() => setFlow({ mode: 'edit', step: 'match' })}
          onClose={() => setFlow(null)}
          onSubmit={handleStep2}
        />
      )}

      {flow?.step === 'quarters' && (
        <Modal
          variant="postQuarters"
          mode="edit"
          initial={initialQuarters}
          onBack={() => setFlow({ mode: 'edit', step: 'roster' })}
          onClose={() => setFlow(null)}
          onSubmit={handleStep3}
          eligiblePlayers={players}
        />
      )}

      {flow?.step === 'scores' && (
        <Modal
          variant="postScores"
          mode="edit"
          initial={initialScores}
          onBack={() => setFlow({ mode: 'edit', step: 'quarters' })}
          onClose={() => setFlow(null)}
          onSubmit={handleStep4}
          eligiblePlayers={players}
        />
      )}
    </section>
  )
}
