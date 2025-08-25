import Link from 'next/link'

export default function Gnb() {
  return (
    <div className="flex flex-row gap-4 md:gap-10 bg-navy text-[10px] md:text-[16px] text-white px-5 py-4 md:px-10 md:py-8">
      <Link href="/" className="mr-3 md:mr-10">
        SUB
      </Link>
      <Link href="/matches">경기기록</Link>
      <Link href="/teams">팀관리</Link>
      <Link href="/players">선수기록</Link>
    </div>
  )
}
