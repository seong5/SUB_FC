'use client'

import { useState } from 'react'
import { QuarterLabel } from '@/mocks/QuarterScores'
import Icon from '../common/Icon'
import DropDown from '../common/DropDown'
import Modal from '../common/Modal'
import { deleteMatch, patchMatch } from '@/libs/matchesApi'

interface TypeFilterProps {
  selectedType: QuarterLabel | ''
  onChange: (type: QuarterLabel | '') => void
  matchId: number
  initialMatch: {
    date: string
    place: string
    score: string
    opponent: string
  }
  onRefetch?: () => void
}

const TYPES = ['1 쿼터', '2 쿼터', '3 쿼터', '4 쿼터'] as const

export default function QuarterFilter({
  selectedType,
  onChange,
  matchId,
  initialMatch,
  onRefetch,
}: TypeFilterProps) {
  const [openDelete, setOpenDelete] = useState(false)
  const [openEdit, setOpenEdit] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleDelete = async () => {
    try {
      setLoading(true)
      await deleteMatch(matchId)
      setOpenDelete(false)
      onRefetch?.()
      alert('삭제가 완료되었습니다.')
    } catch (err) {
      console.error(err)
      alert('삭제에 실패했습니다.')
    } finally {
      setLoading(false)
    }
  }

  const handleEditSubmit = async (payload: {
    date: string
    place: string
    score: string
    opponent: string
  }) => {
    try {
      setLoading(true)
      await patchMatch(matchId, payload)
      setOpenEdit(false)
      onRefetch?.()
      alert('수정이 완료되었습니다.')
    } catch (err) {
      console.error(err)
      alert('수정에 실패했습니다.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section>
      <div className="flex flex-row justify-between items-center text-gray-800 txt-28_M md:txt-32_M mb-2">
        Quaters
        <DropDown
          trigger={
            <button type="button">
              <Icon icon="More" className="w-22 h-22 text-black" />
            </button>
          }
          items={[
            { text: '수정하기', onClick: () => setOpenEdit(true) },
            { text: '삭제하기', onClick: () => setOpenDelete(true) },
          ]}
          position="left"
        />
      </div>

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

      {openDelete && (
        <Modal
          onClose={() => setOpenDelete(false)}
          variant="warning"
          message="정말 삭제하시겠습니까?"
          onCancel={() => setOpenDelete(false)}
          onConfirm={handleDelete}
          cancelText="아니오"
          confirmText={loading ? '삭제 중' : '삭제하기'}
        />
      )}

      {openEdit && (
        <Modal
          variant="postMatch"
          mode="edit"
          initial={initialMatch}
          onClose={() => setOpenEdit(false)}
          onSubmit={handleEditSubmit}
        />
      )}
    </section>
  )
}
