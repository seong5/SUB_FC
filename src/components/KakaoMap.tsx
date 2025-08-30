// components/KakaoMap.tsx (Client Component)
'use client'
import { useEffect } from 'react'

export default function KakaoMap() {
  useEffect(() => {
    if (typeof window === 'undefined') return

    // SDK 로드 완료 시점까지 짧게 폴링
    const t = setInterval(() => {
      const kakao = (window as unknown as { kakao?: typeof window.kakao }).kakao
      if (!kakao?.maps) return

      clearInterval(t)
      kakao.maps.load(() => {
        const container = document.getElementById('map')
        if (!container) return
        const options: kakao.maps.MapOptions = {
          center: new kakao.maps.LatLng(37.5665, 126.978),
          level: 3,
        }
        new kakao.maps.Map(container, options)
      })
    }, 50)

    return () => clearInterval(t)
  }, [])

  return <div id="map" className="w-full h-[400px] rounded-lg" />
}
