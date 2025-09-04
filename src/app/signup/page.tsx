import Image from 'next/image'
import subfc from '../../../public/subfc.png'
import Input from '@/components/common/Input'
import Button from '@/components/common/Button'
import Link from 'next/link'

export default function Signup() {
  return (
    <main className="flex flex-col justify-center items-center px-20 py-20">
      <Image
        src={subfc}
        alt="로고"
        width={200}
        height={200}
        className="w-150 h-150 md:w-200 md:h-200"
      />
      <div className="md:w-640 w-328">
        <Input id="text1" variant="input" label="이메일" placeholder="subfc@subfc.com" />
        <Input id="text1" variant="input" label="닉네임" placeholder="닉네임을 입력해주세요." />
        <Input
          id="password2"
          variant="input"
          type="password"
          label="비밀번호"
          placeholder="비밀번호는 8자리 이상 입력해주세요."
        />
        <Input
          id="password2"
          variant="input"
          type="password"
          label="비밀번호 확인"
          placeholder="비밀번호를 확인해주세요."
        />
        <Button variant="primary" size="xl" disabled className="mt-10">
          회원가입
        </Button>
      </div>
      <div className="flex flex gap-5 items-center justify-center text-gray-400 txt-16_M mt-20">
        <Link href={'/login'}>
          <div className="underline">로그인</div>
        </Link>
        <h1>하러 가시겠어요?</h1>
      </div>
    </main>
  )
}
