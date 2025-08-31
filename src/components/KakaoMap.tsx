'use client'

import { useEffect, useRef, useState } from 'react'

interface RenderKakaoMapProps {
  address: string
}

export default function RenderKakaoMap({ address }: RenderKakaoMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const [error, setError] = useState<string | null>(null)

  // 리사이즈 핸들러를 useEffect 바깥에 정의 가능하도록 초기화
  const resizeHandlerRef = useRef<(() => void) | null>(null)

  useEffect(() => {
    if (!window.kakao || !mapRef.current) {
      setError('지도 정보를 불러올 수 없습니다.')
      return
    }

    const geocoder = new window.kakao.maps.services.Geocoder()

    geocoder.addressSearch(address, (result, status) => {
      if (status !== window.kakao.maps.services.Status.OK) {
        console.error('주소 검색 실패:', status)
        setError('올바른 주소를 입력해주세요.')
        return
      }

      try {
        const coords = new window.kakao.maps.LatLng(result[0].y, result[0].x)

        const map = new window.kakao.maps.Map(mapRef.current!, {
          center: coords,
          level: 3,
          draggable: false,
          scrollwheel: false,
          disableDoubleClick: true,
          disableDoubleClickZoom: true,
        })

        const marker = new window.kakao.maps.Marker({
          map,
          position: map.getCenter(),
        })

        const handleResize = () => {
          map.setCenter(coords)
          marker.setPosition(coords)
        }

        // 핸들러를 ref에 저장해서 클린업 함수에 접근 가능하게 함
        resizeHandlerRef.current = handleResize

        window.addEventListener('resize', handleResize)
      } catch (e) {
        console.error('지도 로딩 중 에러:', e)
        setError('지도를 표시하는 중 문제가 발생했습니다.')
      }
    })

    return () => {
      if (resizeHandlerRef.current) {
        window.removeEventListener('resize', resizeHandlerRef.current)
      }
    }
  }, [address])

  return (
    <div className="flex flex-col border-t border-gray-200 py-40 md:p-40">
      <p className="txt-16_B md:txt-24_B my-5 leading-21 text-gray-950">축구장 주소</p>
      <p className="txt-14_M my-5 leading-24 font-semibold opacity-75">{address}</p>
      <div>
        {error ? (
          <p className="text-sm text-red-500">{error}</p>
        ) : (
          <div ref={mapRef} className="h-180 w-full rounded-[16px] md:h-500 md:rounded-[24px]" />
        )}
      </div>
    </div>
  )
}
