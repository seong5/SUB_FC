import Gnb from '@/components/common/Gnb'
import './globals.css'
import Footer from '@/components/common/Footer'
import QueryProvider from './provider/QueryProvider'
import GlobalSpinner from '@/components/common/global-spinner/GlobalSpinner'
import AuthProvider from './provider/AuthProvider'

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
            <Gnb />
            {children}
            <Footer />
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  )
}
