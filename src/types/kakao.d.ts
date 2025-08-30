declare global {
  interface Window {
    kakao: typeof kakao
  }

  namespace kakao {
    namespace maps {
      class LatLng {
        constructor(lat: number, lng: number)
      }
      class Map {
        constructor(container: HTMLElement | null, options: MapOptions)
      }
      interface MapOptions {
        center: LatLng
        level: number
      }
      function load(callback: () => void): void
    }
  }
}

export {}
