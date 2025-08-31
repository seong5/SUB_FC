declare global {
  interface Window {
    kakao: typeof kakao
  }

  namespace kakao {
    namespace maps {
      class LatLng {
        constructor(lat: number, lng: number)
      }
      interface MapOptions {
        center: LatLng
        level: number
      }
      class Map {
        constructor(container: HTMLElement, options: MapOptions)
        setZoomable(zoomable: boolean): void
        setDraggable(draggable: boolean): void
        setKeyboardShortcuts(active: boolean): void
        setCenter(latlng: LatLng): void
        getCenter(): LatLng
      }
      class Marker {
        constructor(opts: { position: LatLng; map?: Map; title?: string })
        setMap(map: Map | null): void
        setPosition(pos: LatLng): void
      }
      function load(cb: () => void): void

      namespace services {
        class Geocoder {
          addressSearch(
            query: string,
            cb: (result: { x: string; y: string }[], status: string) => void
          ): void
        }
        const Status: { OK: string }
      }
    }
  }
}
export {}
