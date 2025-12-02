import Image from 'next/image'

type UnifomProps = {
  number: number
  name: string
  x: number
  y: number
  hideName?: boolean
}

export default function Uniform({ number, name, x, y, hideName }: UnifomProps) {
  return (
    <div
      className="absolute -translate-x-1/2 -translate-y-1/2"
      style={{ left: `${x}%`, top: `${y}%` }}
    >
      <div className="relative w-[38px] h-[38px] md:w-[72px] md:h-[72px]">
        <Image
          src="/uniform.png"
          alt="uniform"
          fill
          sizes="(max-width: 768px) 38px, 72px"
          className="object-contain select-none pointer-events-none"
          priority
        />
        <span
          className="
            absolute inset-0 flex items-center justify-center
            font-extrabold leading-none
            text-[12px] md:text-[20px]
          "
        >
          {number}
        </span>
      </div>
      {!hideName && (
        <div
          className="
            absolute left-1/2 -translate-x-1/2
            top-[calc(100%-10px)] md:top-[calc(100%-12px)] lg:top-[calc(100%-14px)]
            w-[45px] h-[20px] md:w-[70px] md:h-[30px]
            rounded-md bg-white font-semibold border border-black
            grid place-items-center
            text-[11px] md:text-[15px]
          "
        >
          {name}
        </div>
      )}
    </div>
  )
}
