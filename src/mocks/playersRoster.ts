export interface PlayersRoster {
  id: number
  name: string
  backNumber: number
  position: 'GK' | 'DF' | 'MF' | 'FW'
}

export interface PlayerStats extends PlayersRoster {
  goals: number
  assists: number
  attendancePercent: number
}

export const playersRoster: PlayersRoster[] = [
  { id: 1, name: '최동민', backNumber: 1, position: 'GK' },
  { id: 2, name: '문현준', backNumber: 2, position: 'DF' },
  { id: 3, name: '정수양', backNumber: 3, position: 'DF' },
  { id: 4, name: '오병휘', backNumber: 4, position: 'DF' },
  { id: 5, name: '주영익', backNumber: 5, position: 'DF' },
  { id: 6, name: '최승호', backNumber: 6, position: 'MF' },
  { id: 7, name: '제갈진석', backNumber: 7, position: 'MF' },
  { id: 8, name: '유동엽', backNumber: 8, position: 'MF' },
  { id: 9, name: '신성오', backNumber: 9, position: 'FW' },
  { id: 10, name: '현신우', backNumber: 10, position: 'MF' },
  { id: 11, name: '윤동관', backNumber: 11, position: 'MF' },
  { id: 12, name: '고형우', backNumber: 12, position: 'MF' },
  { id: 13, name: '차우현', backNumber: 16, position: 'MF' },
  { id: 14, name: '민윤기', backNumber: 17, position: 'MF' },
  { id: 15, name: '박준휘', backNumber: 19, position: 'MF' },
  { id: 16, name: '진바울', backNumber: 21, position: 'DF' },
  { id: 17, name: '박성빈', backNumber: 23, position: 'MF' },
  { id: 18, name: '이영호', backNumber: 24, position: 'MF' },
  { id: 19, name: '송대현', backNumber: 66, position: 'DF' },
  { id: 20, name: '조태형', backNumber: 77, position: 'MF' },
  { id: 21, name: '문태중', backNumber: 95, position: 'GK' },
  { id: 22, name: '강하람', backNumber: 96, position: 'DF' },
  { id: 23, name: '이한석', backNumber: 99, position: 'FW' },
  { id: 24, name: '우찬영', backNumber: 13, position: 'GK' },
  { id: 25, name: '이주현', backNumber: 15, position: 'MF' },
]

export const playersWithStats: PlayerStats[] = playersRoster.map((player) => ({
  ...player,
  goals: Math.floor(Math.random() * 10), // 임시 득점
  assists: Math.floor(Math.random() * 5), // 임시 도움
  attendancePercent: Math.floor(Math.random() * 100), // 임시 참석률
}))
