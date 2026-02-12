'use client'

import dynamic from 'next/dynamic'

const LoginForm = dynamic(
  () => import('@/features/auth/ui/LoginForm'),
  {
    ssr: false,
    loading: () => (
      <div className="bg-[#020617] text-slate-200 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-xl font-bold mb-2">로딩 중...</div>
          <div className="text-sm text-slate-500">잠시만 기다려주세요</div>
        </div>
      </div>
    ),
  }
)

export default function Login() {
  return <LoginForm />
}
