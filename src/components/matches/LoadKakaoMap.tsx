'use client'

import { useEffect, useState } from 'react'
import RenderKakaoMap from '@/components/matches/KakaoMap'

type Props = { address: string; lat?: number; lng?: number }

export default function LoadKakaoMap({ address, lat, lng }: Props) {
  const [loaded, setLoaded] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const id = 'kakao-map-sdk'
    const onLoad = () => window.kakao?.maps?.load(() => setLoaded(true))

    if (document.getElementById(id)) onLoad()
    else {
      const s = document.createElement('script')
      s.id = id
      s.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_MAP_KEY}&autoload=false&libraries=services`
      s.async = true
      s.onload = onLoad
      s.onerror = () => setError('지도를 불러오지 못했습니다.')
      document.head.appendChild(s)
    }
  }, [])

  if (error) return <p className="text-red-500">{error}</p>
  if (!loaded) return <p>지도를 불러오는 중…</p>
  return <RenderKakaoMap address={address} lat={lat} lng={lng} />
}
