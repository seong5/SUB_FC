import Image from 'next/image'
import subfc from '../../../public/subfc.png'
import Input from '@/components/common/Input'
import Button from '@/components/common/Button'

export default function Login() {
  return (
    <main className="flex flex-col justify-center items-center px-20 py-40">
      <Image
        src={subfc}
        alt="로고"
        width={200}
        height={200}
        className="w-150 h-150 md:w-200 md:h-200"
      />
      <div className="md:w-640 w-328">
        <Input id="text1" variant="input" label="이메일" placeholder="이메일을 입력해주세요." />
        <Input id="text1" variant="input" label="비밀번호" placeholder="비밀번호를 입력해주세요." />
        <Button variant="primary" size="xl" disabled className="mt-15">
          로그인
        </Button>
      </div>
    </main>
  )
}
