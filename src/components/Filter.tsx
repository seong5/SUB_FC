'use client'

interface TypeFilterProps {
  selectedType: string
  onChange: (type: string) => void
}

const TYPES = ['1 Q', '2 Q', '3 Q', '4 Q']

export default function Filter({ selectedType, onChange }: TypeFilterProps) {
  return (
    <section>
      <div className="font-[700] text-gray-800 txt-32_M mb-2">Quaters</div>
      <div className="flex gap-10">
        {TYPES.map((type) => (
          <div
            key={type}
            className={`inline-flex items-center justify-center w-100 h-42 px-4 border rounded-full cursor-pointer transition
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
