import Image from 'next/image'

export default function Formaiton() {
  return (
    <div className="flex items-center justify-center">
      <Image src={'/pitch.svg'} alt="pitch" width={600} height={600} className="rotate-90 my-20" />
      <Image src={'/uniform.png'} alt="유니폼" width={100} height={100} />
    </div>
  )
}
