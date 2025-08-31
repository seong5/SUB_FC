'use client'
import { useEffect, useRef } from 'react'

type Props = {
  address: string
  level?: number
  className?: string
  disableDrag?: boolean
  onResolved?: (pos: { lat: number; lng: number }) => void
  onError?: (message: string) => void
}

export default function KakaoMap({
  address,
  level = 3,
  className = 'w-full h-[400px] rounded-lg',
  disableDrag = false,
  onResolved,
  onError,
}: Props) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!address) return
    if (!window.kakao?.maps || !ref.current) return

    let map: kakao.maps.Map | null = null
    let marker: kakao.maps.Marker | null = null
    let cancel = false
    let debounceTimer: number | undefined

    window.kakao.maps.load(() => {
      if (!ref.current || cancel) return

      // 1) 지도 생성
      map = new window.kakao.maps.Map(ref.current, {
        center: new window.kakao.maps.LatLng(37.5665, 126.978), // 임시 중심(서울)
        level,
      })
      map.setZoomable(false)
      map.setKeyboardShortcuts(false)
      if (disableDrag) map.setDraggable(false)

      // 2) 주소 → 좌표 (디바운스: 주소가 자주 바뀔 때 호출 난사 방지)
      const geocode = () => {
        const geocoder = new window.kakao.maps.services.Geocoder()
        geocoder.addressSearch(address, (result, status) => {
          if (cancel || !map) return

          if (status !== window.kakao.maps.services.Status.OK || !result?.[0]) {
            onError?.('주소를 좌표로 변환할 수 없습니다.')
            return
          }

          const lat = parseFloat(result[0].y)
          const lng = parseFloat(result[0].x)
          const pos = new window.kakao.maps.LatLng(lat, lng)

          map.setCenter(pos)

          // 기존 마커 제거 후 재생성
          if (marker) marker.setMap(null)
          marker = new window.kakao.maps.Marker({ position: pos, map, title: address })

          onResolved?.({ lat, lng })
        })
      }

      // 주소 변경 시 150ms 지연
      debounceTimer = window.setTimeout(geocode, 150)
    })

    // 3) 클린업 (언마운트/주소 변경 시 마커/타이머 정리)
    return () => {
      cancel = true
      if (debounceTimer) clearTimeout(debounceTimer)
      if (marker) marker.setMap(null)
      // map은 GC에 맡기면 됨
    }
  }, [address, level, disableDrag, onResolved, onError])

  return <div ref={ref} className={className} />
}
