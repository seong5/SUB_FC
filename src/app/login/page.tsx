'use client'

import Image from 'next/image'
import subfc from '../../../public/subfc.png'
import Input from '@/components/common/Input'
import Button from '@/components/common/Button'
import Icon from '@/components/common/Icon'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { createClient } from '@/libs/supabase/client'

// zod 스키마 검증
const LoginSchema = z.object({
  email: z.string().min(1, '이메일을 입력해주세요.').email('이메일 형식이 올바르지 않습니다.'),
  password: z.string().min(1, '비밀번호를 입력해주세요.'),
})

type LoginForm = z.infer<typeof LoginSchema>

export default function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
    setError,
  } = useForm<LoginForm>({
    resolver: zodResolver(LoginSchema),
    mode: 'onChange',
  })

  // 이메일/비번 로그인
  const onSubmit = async ({ email, password }: LoginForm) => {
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      // 에러 메시지 한국어 변환(간단 매핑)
      const message = error.message.includes('Invalid login credentials')
        ? '이메일 또는 비밀번호가 올바르지 않습니다.'
        : error.message.includes('Email not confirmed')
          ? '이메일 인증이 완료되지 않았습니다.'
          : `로그인 실패: ${error.message}`

      setError('password', { message }) // 비번 필드에 표시
      return
    }
    // 성공 → 홈으로
    window.location.href = '/'
  }

  // 카카오 로그인(이미 세팅한 스코프 사용)
  const handleKakaoLogin = async () => {
    const supabase = createClient()
    await supabase.auth.signInWithOAuth({
      provider: 'kakao',
      options: {
        redirectTo: `${location.origin}/`,
        queryParams: {
          scope: 'profile_nickname profile_image account_email',
          prompt: 'login',
        },
      },
    })
  }

  return (
    <main className="flex flex-col justify-center items-center px-20 py-40">
      <Image
        src={subfc}
        alt="로고"
        width={200}
        height={200}
        className="w-150 h-150 md:w-200 md:h-200"
        priority
      />

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-10 md:w-640 w-328">
        <Input
          id="email"
          type="email"
          variant="input"
          label="이메일"
          placeholder="subfc@subfc.com"
          autoComplete="email"
          errorMessage={errors.email?.message}
          {...register('email')}
        />
        <Input
          id="password"
          type="password"
          variant="input"
          label="비밀번호"
          placeholder="비밀번호를 입력해주세요."
          autoComplete="current-password"
          errorMessage={errors.password?.message}
          {...register('password')}
        />

        <Button
          type="submit"
          variant="primary"
          size="xl"
          disabled={!isValid || isSubmitting}
          className="my-15"
        >
          로그인
        </Button>
      </form>

      <div className="flex items-center w-full">
        <hr className="h-1 flex-grow text-gray-100" />
        <span className="text-center text-gray-950 txt-16_M px-16">or</span>
        <hr className="h-1 flex-grow text-gray-100" />
      </div>

      <Button
        onClick={handleKakaoLogin}
        icon={<Icon icon="Kakao" className="w-24 h-24 mr-4" />}
        variant="kakao"
        size="xl"
        className="mt-15 md:w-640 w-328 text-[#000000] opacity-85"
      >
        카카오 로그인
      </Button>

      <div className="flex gap-5 items-center justify-center text-gray-400 txt-16_M mt-20">
        <Link href="/signup" className="underline">
          회원가입
        </Link>
        <span>이 필요하신가요?</span>
      </div>
    </main>
  )
}
