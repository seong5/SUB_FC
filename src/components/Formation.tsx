import Image from 'next/image'

export default function Formaiton() {
  return (
    <div className="flex items-center justify-center">
      <Image src={'/pitch.svg'} alt="pitch" width={600} height={600} className="rotate-90 my-20" />
    </div>
  )
}
