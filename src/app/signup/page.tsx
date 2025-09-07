'use client'
import Image from 'next/image'
import subfc from '../../../public/subfc.png'
import Input from '@/components/common/Input'
import Button from '@/components/common/Button'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

// zod 스키마 검증
const SignupSchema = z
  .object({
    email: z.string().min(1, '이메일을 입력해주세요.').email('이메일이 올바르지 않습니다.'),
    nickname: z
      .string()
      .min(2, '닉네임은 2자 이상 입력해주세요.')
      .max(20, '닉네임을 20자 이하로 입력해주세요.'),
    password: z
      .string()
      .min(8, '비밀번호는 8자 이상 입력해주세요.')
      .regex(/(?=.*[A-Za-z])(?=.*\d)(?=.*[^\w\s])/, '영문/숫자/특수문자를 포함해야 해요.'),
    confirm: z.string().min(1, '비밀번호를 한 번 더 입력해주세요.'),
  })
  .refine((data) => data.password === data.confirm, {
    path: ['confirm'],
    message: '비밀번호가 일치하지 않습니다.',
  })

type SignupForm = z.infer<typeof SignupSchema>

export default function Signup() {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
  } = useForm<SignupForm>({
    resolver: zodResolver(SignupSchema),
    mode: 'onChange',
  })

  const onSubmit = async (data: SignupForm) => {
    console.log('회원가입 데이터', data)
  }

  return (
    <main className="flex flex-col justify-center items-center px-20 py-20">
      <Image
        src={subfc}
        alt="로고"
        width={200}
        height={200}
        className="w-150 h-150 md:w-200 md:h-200"
      />
      <form onSubmit={handleSubmit(onSubmit)} className="md:w-640 w-328 flex flex-col gap-10">
        <Input
          id="email"
          variant="input"
          type="email"
          label="이메일"
          placeholder="subfc@subfc.com"
          errorMessage={errors.email?.message}
          {...register('email')}
          autoComplete="email"
        />
        <Input
          id="nickname"
          variant="input"
          label="닉네임"
          placeholder="닉네임을 입력해주세요."
          errorMessage={errors.nickname?.message}
          {...register('nickname')}
          autoComplete="nickname"
        />
        <Input
          id="password"
          variant="input"
          type="password"
          label="비밀번호"
          placeholder="비밀번호는 8자리 이상 입력해주세요."
          errorMessage={errors.password?.message}
          {...register('password')}
          autoComplete="new-password"
        />
        <Input
          id="confirm"
          variant="input"
          type="password"
          label="비밀번호 확인"
          placeholder="비밀번호를 확인해주세요."
          errorMessage={errors.confirm?.message}
          {...register('confirm')}
          autoComplete="new-password"
        />
        <Button
          type="submit"
          variant="primary"
          size="xl"
          disabled={!isValid || isSubmitting}
          className="mt-10"
        >
          회원가입
        </Button>
      </form>
      <div className="flex flex gap-5 items-center justify-center text-gray-400 txt-16_M mt-20">
        <Link href={'/login'}>
          <div className="underline">로그인</div>
        </Link>
        <h1>하러 가시겠어요?</h1>
      </div>
    </main>
  )
}
