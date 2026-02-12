'use client'

import Image from 'next/image'
import { Input, Button, Icon } from '@/shared'
import Link from 'next/link'
import { Mail, Lock, ChevronRight, User } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createClient } from '@/shared/api/supabase'
import { SignupSchema, type SignupFormData } from '../model/schemas'

const INPUT_DARK =
  '!bg-slate-950/50 !border-slate-800 !text-slate-200 focus:!border-cyan-500/50 focus:!ring-4 focus:!ring-cyan-500/10 placeholder:!text-slate-600'

export default function SignupForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
  } = useForm<SignupFormData>({
    resolver: zodResolver(SignupSchema),
    mode: 'onChange',
  })

  const onSubmit = async (data: SignupFormData) => {
    const supabase = createClient()
    const { error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          full_name: data.nickname,
        },
      },
    })
    if (error) {
      alert(`회원가입 실패: ${error.message}`)
      return
    }
    window.location.href = '/login'
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
              src="/subfc.png"
              alt="SUB FC"
              width={200}
              height={200}
              priority={false}
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
              <label
                className="text-xs font-bold text-slate-400 ml-1 uppercase tracking-widest flex mb-10 items-center gap-4"
                htmlFor="nickname"
              >
                <User className="w-15 h-15" /> Nickname
              </label>
              <Input
                id="nickname"
                variant="input"
                label=""
                placeholder="닉네임을 입력해주세요."
                autoComplete="nickname"
                errorMessage={errors.nickname?.message}
                className="!gap-2"
                inputClassName={INPUT_DARK}
                {...register('nickname')}
              />
            </div>

            <div className="space-y-2">
              <label
                className="text-xs font-bold text-slate-400 uppercase tracking-widest flex mb-10 items-center gap-4"
                htmlFor="password"
              >
                <Lock className="w-15 h-15" /> Password
              </label>
              <Input
                id="password"
                type="password"
                variant="input"
                label=""
                placeholder="8자 이상, 영문/숫자/특수문자 포함"
                autoComplete="new-password"
                errorMessage={errors.password?.message}
                className="!gap-2"
                inputClassName={INPUT_DARK}
                {...register('password')}
              />
            </div>

            <div className="space-y-2">
              <label
                className="text-xs font-bold text-slate-400 uppercase tracking-widest flex mb-10 items-center gap-4"
                htmlFor="confirm"
              >
                <Lock className="w-15 h-15" /> Password Confirm
              </label>
              <Input
                id="confirm"
                type="password"
                variant="input"
                label=""
                placeholder="비밀번호를 한 번 더 입력해주세요."
                autoComplete="new-password"
                errorMessage={errors.confirm?.message}
                className="!gap-2"
                inputClassName={INPUT_DARK}
                {...register('confirm')}
              />
            </div>

            <Button
              type="submit"
              size="xl"
              disabled={!isValid || isSubmitting}
              className="w-full !bg-cyan-600 hover:!bg-cyan-500 !text-white font-bold py-4 rounded-xl shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:shadow-[0_0_30px_rgba(6,182,212,0.5)] active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-2 group relative overflow-hidden mt-8"
            >
              <span className="relative z-10">
                {isSubmitting ? '처리 중…' : '회원가입하기'}
              </span>
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
              <span>이미 계정이 있으시다면?</span>
              <Link href="/login" className="text-cyan-500 font-bold hover:underline">
                로그인하기
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
