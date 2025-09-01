import Link from 'next/link'
import subfc from '../../../public/subfc.png'
import Image from 'next/image'

export default function Gnb() {
  return (
    <div className="flex flex-row justify-between sticky top-0 z-50 gap-20 bg-white/60 backdrop-blur-md txt-black h-80 px-20 md:px-30">
      <div className="flex gap-15 md:gap-25 items-center txt-12_M md:txt-14_M ">
        <Link href="/" className="md:mr-10">
          <Image
            src={subfc}
            alt="subfc-logo"
            width={70}
            height={50}
            className="rounded-full w-50 h-50 md:w-70 md:h-70"
          />
        </Link>
        <Link href="/teams">팀관리</Link>
        <Link href="/players">선수관리</Link>
      </div>
      <div className="flex gap-15 md:gap-25 items-center txt-12_M md:txt-14_M">
        <Link href="/login">로그인</Link>
        <Link href="/signup">회원가입</Link>
      </div>
    </div>
  )
}
