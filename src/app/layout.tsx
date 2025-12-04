import Gnb from '@/components/common/Gnb'
import './globals.css'
import Footer from '@/components/common/Footer'
import QueryProvider from './provider/QueryProvider'
import GlobalSpinner from '@/components/common/global-spinner/GlobalSpinner'
import AuthProvider from './provider/AuthProvider'
import NotificationProvider from './provider/NotificationProvider'
import Notification from '@/components/common/Notification'

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
              <Notification />
            </NotificationProvider>
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  )
}
