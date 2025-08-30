import Gnb from '@/components/Gnb'
import './globals.css'
import Footer from '@/components/Footer'
import Script from 'next/script'

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
        <Script
          strategy="afterInteractive"
          src={`https://dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_MAP_KEY}&libraries=services&autoload=false`}
        />
        <Footer />
      </body>
    </html>
  )
}
