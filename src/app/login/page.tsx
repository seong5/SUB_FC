import Image from 'next/image'
import subfc from '../../../public/subfc.png'
import Input from '@/components/common/Input'
import Button from '@/components/common/Button'
import Icon from '@/components/common/Icon'
import Link from 'next/link'

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
        <Button variant="primary" size="xl" disabled className="my-15">
          로그인
        </Button>
      </div>
      <div className="flex items-center w-full">
        <hr className="h-1 flex-grow text-gray-100"></hr>
        <span className="text-center text-gray-950 txt-16_M px-16">or</span>
        <hr className="h-1 flex-grow text-gray-100"></hr>
      </div>
      <Button
        icon={<Icon icon="Kakao" className="w-24 h-24 mr-4" />}
        variant="kakao"
        size="xl"
        className="mt-15 md:w-640 w-328 text-[#000000] opacity-85"
      >
        카카오 로그인
      </Button>
      <div className="flex flex gap-5 items-center justify-center text-gray-400 txt-16_M mt-20">
        <Link href={'/signup'}>
          <div className="underline">회원가입</div>
        </Link>
        <h1>이 필요하신가요?</h1>
      </div>
    </main>
  )
}
