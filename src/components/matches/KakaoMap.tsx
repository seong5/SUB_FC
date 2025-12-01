'use client'

import { useEffect, useRef, useState } from 'react'

type Props = { address: string; lat?: number; lng?: number }

export default function RenderKakaoMap({ address, lat, lng }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!ref.current) return
    const { kakao } = window as typeof window & { kakao: Kakao }
    const container = ref.current
    const map = new kakao.maps.Map(container, {
      center: new kakao.maps.LatLng(37.5665, 126.978), // 서울시청
      level: 3,
    })

    map.setZoomable(false)
    map.setDraggable(false)

    const marker = new kakao.maps.Marker({ map, position: map.getCenter() })

    const placeByCoord = (plat: number, plng: number, label?: string) => {
      const ll = new kakao.maps.LatLng(plat, plng)
      map.setCenter(ll)
      marker.setPosition(ll)
      if (label) container.setAttribute('data-label', label)
    }

    const geocoder = new kakao.maps.services.Geocoder()

    // 1) 주소로 시도
    geocoder.addressSearch(address.trim(), (result, status) => {
      if (status === kakao.maps.services.Status.OK && result.length > 0) {
        const { x, y } = result[0] // x=lng, y=lat
        placeByCoord(Number(y), Number(x), address)
        return
      }

      // 2) 주소 실패 → 키워드(장소명)로 폴백
      const places = new kakao.maps.services.Places()
      places.keywordSearch(address.trim(), (data, pStatus) => {
        if (pStatus === kakao.maps.services.Status.OK && data.length > 0) {
          const { x, y, place_name, road_address_name, address_name } = data[0]
          const label = place_name || road_address_name || address_name || address
          placeByCoord(Number(y), Number(x), label)
          return
        }

        // 3) 그래도 실패 → 좌표가 있으면 좌표로, 없으면 에러
        if (typeof lat === 'number' && typeof lng === 'number') {
          placeByCoord(lat, lng, address)
        } else {
          setError('주소/장소를 좌표로 변환하지 못했습니다.')
        }
      })
    })
  }, [address, lat, lng])

  if (error) return <p className="text-red-500">{error}</p>
  return <div ref={ref} className="w-full h-[320px] rounded-lg shadow" />
}
