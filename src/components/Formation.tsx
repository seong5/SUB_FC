import Image from 'next/image'

export default function Formaiton() {
  return (
    <div>
      <Image src={'/pitch.svg'} alt="pitch" width={1000} height={500} className="rotate-90" />
    </div>
  )
}
