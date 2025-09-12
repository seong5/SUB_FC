import Gnb from '@/components/common/Gnb'
import './globals.css'
import Footer from '@/components/common/Footer'
import QueryProvider from './provider/QueryProvider'

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ko">
      <body>
        <QueryProvider>
          <Gnb />
          {children}
          <Footer />
        </QueryProvider>
      </body>
    </html>
  )
}
