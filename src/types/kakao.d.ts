export {}

// 전역스코프에 타입 확장
declare global {
  interface Window {
    kakao: Kakao
  }

  interface Kakao {
    maps: {
      load(callback: () => void): void
      Map: new (
        container: HTMLElement,
        options: {
          center: LatLng
          level: number
          draggable?: boolean
          scrollwheel?: boolean
          disableDoubleClick?: boolean
          disableDoubleClickZoom?: boolean
        }
      ) => KakaoMap
      LatLng: new (lat: number | string, lng: number | string) => LatLng
      Marker: new (options: { map: KakaoMap; position: LatLng }) => KakaoMarker
      services: {
        Geocoder: new () => {
          addressSearch(
            address: string,
            callback: (
              result: Array<{
                x: string
                y: string
              }>,
              status: string
            ) => void
          ): void
        }
        Status: {
          OK: string
        }
      }
    }
  }

  interface LatLng {
    getLat(): number
    getLng(): number
  }

  interface KakaoMap {
    setCenter(latlng: LatLng): void
    setLevel(level: number): void
    getCenter(): LatLng
  }

  interface KakaoMarker {
    setMap(map: KakaoMap | null): void
    setPosition(latlng: LatLng): void
  }
}
