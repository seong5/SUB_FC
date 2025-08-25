'use client'

import { ReactNode, useRef, useState } from 'react'
import { cn } from '@/utils/cn'

type DropDownItem = {
  text: string
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void
  danger?: boolean // 로그아웃 버튼에 텍스트컬러 적용을 위한 Prop
}

type DropDownProps = {
  trigger: ReactNode // 클릭하면 드롭다운이 열림
  items: DropDownItem[] // 드롭다운에 들어갈 텍스트들
  position?: 'bottom' | 'left'
}

export default function DropDown({ trigger, items, position = 'bottom' }: DropDownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const buttonClass = cn(
    'cursor-pointer hover:bg-primary-100 hover:rounded-[8px] w-full min-h-55 txt-16_M'
  )

  return (
    <div ref={dropdownRef} className="relative">
      <div className="cursor-pointer" onClick={() => setIsOpen((prev) => !prev)}>
        {trigger}
      </div>
      {isOpen && (
        <div
          className={cn(
            'absolute z-50',
            position === 'left'
              ? 'top-1/2 right-full mr-2 -translate-y-1/5'
              : 'top-full left-1/2 mt-2 -translate-x-1/2',
            'flex w-95 flex-col justify-center shadow-md rounded-[8px] border border-gray-50 bg-white text-gray-950 md:h-auto md:w-103 lg:w-95'
          )}
        >
          {items.map(({ text, onClick, danger }, idx) => (
            <button
              key={idx}
              className={buttonClass}
              onClick={(e) => {
                onClick(e)
                setIsOpen(false)
              }}
            >
              <span className={cn('text-gray-950', danger && 'text-red-500')}>{text}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
