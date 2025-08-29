'use client'

import { QuarterLabel } from '@/mocks/QuarterScores'

interface TypeFilterProps {
  selectedType: QuarterLabel | ''
  onChange: (type: QuarterLabel | '') => void
}

const TYPES = ['1 쿼터', '2 쿼터', '3 쿼터', '4 쿼터'] as const

export default function QuarterFilter({ selectedType, onChange }: TypeFilterProps) {
  return (
    <section>
      <div className="text-gray-800 txt-28_M md:txt-32_M mb-2">Quaters</div>
      <div className="flex gap-10 mt-20">
        {TYPES.map((type) => (
          <div
            key={type}
            className={`inline-flex items-center justify-center w-80 md:w-100 h-40 md:h-42 px-4 border rounded-full cursor-pointer transition
              ${
                selectedType === type
                  ? 'bg-primary-500 text-white border'
                  : 'bg-white text-black border-gray-300 hover:border-primary-100 hover:bg-primary-100 hover:text-black'
              }`}
            onClick={() => onChange(selectedType === type ? '' : type)}
          >
            {type}
          </div>
        ))}
      </div>
    </section>
  )
}
