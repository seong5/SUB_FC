import Link from 'next/link'
import subfc from '../../public/subfc.png'
import Image from 'next/image'

export default function Gnb() {
  return (
    <div className="flex flex-row justify-between bg-black text-10_M md:text-16_M text-white p-20 md:px-50">
      <div className="flex gap-25 items-center">
        <Link href="/" className="mr-3 md:mr-10">
          <Image src={subfc} alt="subfc-logo" width={70} height={50} className="rounded-full" />
        </Link>
        <Link href="/matches">경기기록</Link>
        <Link href="/teams">팀관리</Link>
        <Link href="/players">선수기록</Link>
      </div>
      <div className="flex gap-25 items-center">
        <Link href="/login">로그인</Link>
        <Link href="/signup">회원가입</Link>
      </div>
    </div>
  )
}
