'use client'

import { QuarterLabel } from '@/mocks/QuarterScores'
import Icon from '../common/Icon'
import DropDown from '../common/DropDown'

interface TypeFilterProps {
  selectedType: QuarterLabel | ''
  onChange: (type: QuarterLabel | '') => void
}

const TYPES = ['1 쿼터', '2 쿼터', '3 쿼터', '4 쿼터'] as const

export default function QuarterFilter({ selectedType, onChange }: TypeFilterProps) {
  return (
    <section>
      <div className="flex flex-row justify-between items-center text-gray-800 txt-28_M md:txt-32_M mb-2">
        Quaters
        <DropDown
          trigger={
            <button>
              <Icon icon="More" className="w-22 h-22 text-black" />
            </button>
          }
          items={[
            { text: '수정하기', onClick: () => console.log('수정하기') },
            {
              text: '삭제하기',
              onClick: () => {
                console.log('삭제하기')
              },
            },
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
    </section>
  )
}
