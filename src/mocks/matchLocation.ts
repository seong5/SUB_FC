export type MatchLocation = {
  id: number
  name: string
  address: string
  lat: number
  lng: number
}

export const matchLocations: MatchLocation[] = [
  {
    id: 1,
    name: '서울 월드컵경기장',
    address: '서울특별시 마포구 성산동 515',
    lat: 37.5683,
    lng: 126.8974,
  },
  {
    id: 2,
    name: '잠실 올림픽주경기장',
    address: '서울특별시 송파구 올림픽로 25',
    lat: 37.515,
    lng: 127.0736,
  },
  {
    id: 3,
    name: '효창운동장',
    address: '서울특별시 용산구 효창동 255',
    lat: 37.5453,
    lng: 126.9614,
  },
  {
    id: 4,
    name: '탄천종합운동장',
    address: '경기도 성남시 분당구 탄천동',
    lat: 37.4103,
    lng: 127.1265,
  },
]
