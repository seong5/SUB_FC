export {}

declare global {
  interface Window {
    kakao: Kakao
  }

  interface Kakao {
    maps: {
      load(callback: () => void): void
      Map: new (container: HTMLElement, options: { center: LatLng; level: number }) => KakaoMap
      LatLng: new (lat: number, lng: number) => LatLng
      Marker: new (options: { map: KakaoMap; position: LatLng }) => KakaoMarker
      services: {
        Geocoder: new () => {
          addressSearch(
            address: string,
            callback: (result: Array<{ x: string; y: string }>, status: string) => void
          ): void
        }
        Places: new () => {
          keywordSearch(
            keyword: string,
            callback: (
              data: Array<{
                x: string
                y: string
                place_name: string
                address_name: string
                road_address_name: string
              }>,
              status: string
            ) => void
          ): void
        }
        Status: { OK: string }
      }
    }
  }

  interface LatLng {
    getLat(): number
    getLng(): number
  }
  interface KakaoMap {
    setCenter(latlng: LatLng): void
    getCenter(): LatLng
    setLevel(level: number): void
  }
  interface KakaoMarker {
    setMap(map: KakaoMap | null): void
    setPosition(latlng: LatLng): void
  }
}
