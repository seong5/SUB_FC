'use client'

import { useState } from 'react'
import Modal from '@/components/Modal'

export default function MyPage() {
  const [open, setOpen] = useState(false)

  return (
    <div className="p-6">
      <button onClick={() => setOpen(true)} className="px-4 py-2 bg-green-500 text-white rounded">
        경기 등록하기
      </button>

      {open && (
        <Modal
          variant="postMatch"
          onClose={() => setOpen(false)}
          onSubmit={(data) => {
            console.log('등록 데이터:', data)
          }}
        />
      )}
    </div>
  )
}
