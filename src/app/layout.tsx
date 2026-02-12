import Gnb from '@/components/common/Gnb'
import './globals.css'
import Footer from '@/components/common/Footer'
import QueryProvider from './provider/QueryProvider'
import { GlobalSpinner } from '@/shared'
import AuthProvider from './provider/AuthProvider'
import NotificationProvider from './provider/NotificationProvider'

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
