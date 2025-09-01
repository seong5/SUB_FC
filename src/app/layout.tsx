import Gnb from '@/components/common/Gnb'
import './globals.css'
import Footer from '@/components/common/Footer'

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ko">
      <body>
        <Gnb />
        {children}
        <Footer />
      </body>
    </html>
  )
}
