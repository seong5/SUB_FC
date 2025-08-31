'use client'

import { useEffect, useState } from 'react'

import RenderKakaoMap from '@/components/KakaoMap'

interface LoadKakaoMapProps {
  address: string
}

export default function LoadKakaoMap({ address }: LoadKakaoMapProps) {
  const [loaded, setLoaded] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const scriptId = 'kakao-map-sdk'

    if (typeof window === 'undefined') return

    const onLoad = () => {
      if (window.kakao && window.kakao.maps) {
        window.kakao.maps.load(() => {
          setLoaded(true)
        })
      }
    }

    if (document.getElementById(scriptId)) {
      onLoad()
    } else {
      const script = document.createElement('script')
      script.id = scriptId
      script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_MAP_KEY}&autoload=false&libraries=services`
      script.async = true
      script.onload = onLoad
      script.onerror = () => {
        console.error('지도를 불러오는데 실패했습니다.')
        setError('지도를 불러오는데 실패했습니다.')
      }
      document.head.appendChild(script)
    }

    // 10초 후에도 로딩 안되면 에러
    const timeout = setTimeout(() => {
      if (!loaded) {
        console.error('지도 로딩 시간이 초과되었습니다.')
        setError('지도 로딩 시간이 초과되었습니다.')
      }
    }, 10000)

    return () => clearTimeout(timeout)
  }, [loaded])

  if (error) {
    return <p className="text-red-500">{error}</p>
  }

  return loaded ? <RenderKakaoMap address={address} /> : <p>지도를 불러오는 중...</p>
}
