import { Gnb, Footer } from '@/widgets'
import './globals.css'
import QueryProvider from './provider/QueryProvider'
import { GlobalSpinner } from '@/shared'
import AuthProvider from './provider/AuthProvider'
import NotificationProvider from './provider/NotificationProvider'

export const metadata = {
  title: 'SUB FC | 팀·선수 관리',
  description: 'SUB FC 팀 일정, 경기 기록, 선수 명단을 관리합니다.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ko">
      <body>
        <QueryProvider>
          <GlobalSpinner />
          <AuthProvider>
            <NotificationProvider>
              <Gnb />
              {children}
              <Footer />
            </NotificationProvider>
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  )
}
