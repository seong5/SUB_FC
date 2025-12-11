'use client'

import { useState, useMemo } from 'react'
import Button from '@/components/common/Button'

const EXCLUDED_PLAYERS = ['제갈진석', '차우현', '윤동관', '유동엽', '현신우', 'Guest']

export interface PostMomContentProps {
  onBack: () => void
  onClose: () => void
  onSubmit: (momPlayerIds: string[]) => void
  eligiblePlayers: { id: string; name: string }[]
  initial?: string[]
  mode?: 'create' | 'edit'
}

export default function PostMomContent({
  onBack,
  onClose,
  onSubmit,
  eligiblePlayers,
  initial = [],
  mode = 'create',
}: PostMomContentProps) {
  const [selectedMomIds, setSelectedMomIds] = useState<string[]>(initial)

  const filteredPlayers = useMemo(() => {
    return eligiblePlayers.filter((player) => !EXCLUDED_PLAYERS.includes(player.name))
  }, [eligiblePlayers])

  const togglePlayer = (playerId: string) => {
    setSelectedMomIds((prev) => {
      if (prev.includes(playerId)) {
        // 이미 선택된 경우 제거
        return prev.filter((id) => id !== playerId)
      } else {
        // 최대 2명까지만 선택 가능
        if (prev.length >= 2) {
          return prev
        }
        return [...prev, playerId]
      }
    })
  }

  const handleSubmit = () => {
    onSubmit(selectedMomIds)
  }

  return (
    <div className="px-15 py-10 w-350 md:w-400">
      <h2 className="text-lg font-bold mb-4 text-center">MOM 선정</h2>
      <p className="text-sm text-gray-600 mb-6 text-center">
        선정된 인원 2명을 골라주세요. ({selectedMomIds.length}/2)
      </p>

      <div className="flex flex-col gap-3 max-h-400 overflow-y-auto">
        {filteredPlayers.length === 0 ? (
          <p className="text-center text-gray-500 py-10">선택 가능한 선수가 없습니다.</p>
        ) : (
          filteredPlayers.map((player) => {
            const isSelected = selectedMomIds.includes(player.id)
            return (
              <button
                key={player.id}
                type="button"
                onClick={() => togglePlayer(player.id)}
                className={`flex items-center justify-between p-4 rounded-[12px] border-2 transition-all ${
                  isSelected
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <span
                  className={`txt-16_M ${isSelected ? 'text-primary-500 font-semibold' : 'text-gray-700'}`}
                >
                  {player.name}
                </span>
                {isSelected && <span className="text-primary-500 font-bold">✓</span>}
              </button>
            )
          })
        )}
      </div>

      <div className="mt-10 flex gap-5 justify-evenly">
        <Button className="flex-1" size="lg" variant="secondary" onClick={onBack}>
          이전
        </Button>
        <Button className="flex-1" size="lg" variant="secondary" onClick={onClose}>
          취소
        </Button>
        <Button
          className="flex-1 text-white"
          size="lg"
          variant="primary"
          onClick={handleSubmit}
          disabled={selectedMomIds.length === 0}
        >
          {mode === 'edit' ? '저장' : '완료'}
        </Button>
      </div>
    </div>
  )
}
