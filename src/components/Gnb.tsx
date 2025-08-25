import Link from 'next/link'

export default function Gnb() {
  return (
    <div className="flex flex-row gap-4 justify-between md:gap-10 bg-black text-10 md:text-16 text-white px-5 py-4 md:px-10 md:py-8">
      <div>
        <Link href="/" className="mr-3 md:mr-10">
          SUB
        </Link>
        <Link href="/matches">경기기록</Link>
        <Link href="/teams">팀관리</Link>
        <Link href="/players">선수기록</Link>
      </div>
      <div>
        <Link href="/login">로그인</Link>
        <Link href="/signup">회원가입</Link>
      </div>
    </div>
  )
}
