import Image from 'next/image'

type UnifomProps = {
  number: number
  name: string
  x: number
  y: number
  size?: number
  hideName?: boolean
}

export default function Uniform({ number, name, x, y, size = 64, hideName }: UnifomProps) {
  const plateWidth = size * 1
  const plateHeight = size * 0.43
  const overlap = size * 0.22

  return (
    <div
      className="absolute"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        transform: 'translate(-50%, -50%)',
      }}
    >
      <div className="relative" style={{ width: size, height: size }}>
        <Image
          src="/uniform.png"
          alt="uniform"
          fill
          className="object-contain select-none pointer-events-none"
          priority
        />
        <span
          className="absolute inset-0 flex items-center justify-center font-extrabold leading-none"
          style={{ fontSize: Math.round(size * 0.28) }}
        >
          {number}
        </span>
      </div>
      {!hideName && (
        <div
          className="absolute left-1/2 -translate-x-1/2 rounded-md bg-white font-semibold border-2 border-black grid place-items-center"
          style={{
            top: size - overlap,
            width: plateWidth,
            height: plateHeight,
            fontSize: Math.round(size * 0.23),
          }}
        >
          {name}
        </div>
      )}
    </div>
  )
}
