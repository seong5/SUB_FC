'use client'
import { useId } from 'react'
import Button from './Button'

type Props = {
  value: string
  onChange: (v: string) => void
  onSubmit?: () => void
}

export default function SearchBar({ value, onChange, onSubmit }: Props) {
  const id = useId()
  return (
    <div className="p-20">
      <h1 className="txt-16_B md:txt-32_B text-center my-10">지난 매치를 검색하고 싶으신가요?</h1>
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
          placeholder="축구장 혹은 주소를 입력해주세요."
          className="flex-1 bg-white txt-12_M md:txt-16_M md:w/full md:h-70 rounded-[20px] px-15 py-10 card-shadow"
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
