'use client'

import Image from 'next/image'
import subfc from '../../../public/subfc.png'
import { Input, Button, Icon } from '@/shared'
import Link from 'next/link'
import { Mail, Lock, ChevronRight } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { createClient } from '@/shared/api/supabase'

const LoginSchema = z.object({
  email: z.string().min(1, '이메일을 입력해주세요.').email('이메일 형식이 올바르지 않습니다.'),
  password: z.string().min(1, '비밀번호를 입력해주세요.'),
})

type LoginForm = z.infer<typeof LoginSchema>

const INPUT_DARK =
  '!bg-slate-950/50 !border-slate-800 !text-slate-200 focus:!border-cyan-500/50 focus:!ring-4 focus:!ring-cyan-500/10 placeholder:!text-slate-600'

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

  const onSubmit = async ({ email, password }: LoginForm) => {
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      const message = error.message.includes('Invalid login credentials')
        ? '이메일 또는 비밀번호가 올바르지 않습니다.'
        : error.message.includes('Email not confirmed')
          ? '이메일 인증이 완료되지 않았습니다.'
          : `로그인 실패: ${error.message}`
      setError('password', { message })
      return
    }
    window.location.href = '/'
  }

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
    <div className="bg-[#020617] text-slate-200 font-sans selection:bg-cyan-500/30 overflow-hidden relative flex items-center justify-center p-20">
      <div className="relative z-10 w-full max-w-md mx-auto">
        <div className="flex flex-col items-center text-center my-20">
          <div>
            <Image
              src={subfc}
              alt="SUB FC"
              width={200}
              height={200}
              className="relative z-10 w-[200px] h-[200px] rounded-full"
            />
          </div>
          <h1 className="text-4xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-white to-slate-500 my-10">
            SUB FC
          </h1>
        </div>

        {/* 폼 카드 */}
        <div className="bg-slate-900/50 backdrop-blur-xl border border-white/10 p-10 rounded-3xl shadow-2xl relative">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="space-y-2">
              <label
                className="text-xs font-bold text-slate-400 ml-1 uppercase tracking-widest flex mb-10 items-center gap-4"
                htmlFor="email"
              >
                <Mail className="w-15 h-15" /> Email
              </label>
              <Input
                id="email"
                type="email"
                variant="input"
                label=""
                placeholder="email@email.com"
                autoComplete="email"
                errorMessage={errors.email?.message}
                className="!gap-2"
                inputClassName={INPUT_DARK}
                {...register('email')}
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <label
                  className="text-xs font-bold text-slate-400 uppercase tracking-widest flex mb-10 items-center gap-4"
                  htmlFor="password"
                >
                  <Lock className="w-15 h-15" /> Password
                </label>
              </div>
              <Input
                id="password"
                type="password"
                variant="input"
                label=""
                placeholder="••••••••"
                autoComplete="current-password"
                errorMessage={errors.password?.message}
                className="!gap-2"
                inputClassName={INPUT_DARK}
                {...register('password')}
              />
            </div>

            <Button
              type="submit"
              size="xl"
              disabled={!isValid || isSubmitting}
              className="w-full !bg-cyan-600 hover:!bg-cyan-500 !text-white font-bold py-4 rounded-xl shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:shadow-[0_0_30px_rgba(6,182,212,0.5)] active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-2 group relative overflow-hidden mt-8"
            >
              <span className="relative z-10">{isSubmitting ? '처리 중…' : '로그인하기'}</span>
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform relative z-10" />
            </Button>
          </form>

          <div className="flex items-center my-8">
            <div className="h-[1px] flex-grow bg-gradient-to-r from-transparent to-slate-700" />
            <span className="px-4 text-[10px] font-bold text-slate-500 uppercase tracking-[0.3em]">
              소셜 로그인
            </span>
            <div className="h-[1px] flex-grow bg-gradient-to-l from-transparent to-slate-700" />
          </div>

          <Button
            type="button"
            onClick={handleKakaoLogin}
            size="xl"
            icon={<Icon icon="Kakao" className="w-20 h-20" />}
            variant="kakao"
            className="w-full !bg-[#FEE500] hover:!bg-[#FEE500]/90 !text-[#3C1E1E] py-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-3 active:scale-[0.98]"
          >
            카카오 로그인
          </Button>

          <div className="mt-8 pt-6 border-t border-white/5 flex flex-col items-center gap-4">
            <div className="flex gap-2 text-xs text-slate-500">
              <span>계정이 없으시다면?</span>
              <Link href="/signup" className="text-cyan-500 font-bold hover:underline">
                회원가입하기
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
