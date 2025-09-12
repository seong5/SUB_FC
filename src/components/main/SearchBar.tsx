'use client'
import { useId } from 'react'
import Button from '../common/Button'

type Props = {
  value: string
  onChange: (v: string) => void
  onSubmit?: () => void
}

export default function SearchBar({ value, onChange, onSubmit }: Props) {
  const id = useId()
  return (
    <div>
      <h1 className="txt-16_B md:txt-32_B text-center my-10">지난 매치들을 검색해 보세요!</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          onSubmit?.()
        }}
        className="flex gap-10 md:gap-20"
      >
        <label htmlFor={id} className="sr-only">
          검색
        </label>
        <input
          id={id}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="검색어를 입력해주세요."
          className="flex-1 bg-white txt-13_M md:txt-16_M md:w/full md:h-70 rounded-[20px] px-15 py-10 card-shadow"
        />
        <Button
          type="submit"
          variant="primary"
          size="md"
          className="rounded-[20px] txt-12_M md:txt-20_M w-100 md:w-full md:h-70"
        >
          검색
        </Button>
      </form>
    </div>
  )
}
