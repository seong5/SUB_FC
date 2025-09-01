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
  attendanceMatches: number
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

const TOTAL_MATCHES = 15

export const playersWithStats: PlayerStats[] = [
  { ...playersRoster[0], goals: 0, assists: 0, attendanceMatches: 6, attendancePercent: 0 }, //최동민
  { ...playersRoster[1], goals: 4, assists: 2, attendanceMatches: 15, attendancePercent: 0 }, //문현준
  { ...playersRoster[2], goals: 0, assists: 2, attendanceMatches: 10, attendancePercent: 0 }, //정수양
  { ...playersRoster[3], goals: 0, assists: 0, attendanceMatches: 2, attendancePercent: 0 }, //오병휘
  { ...playersRoster[4], goals: 1, assists: 0, attendanceMatches: 9, attendancePercent: 0 }, //주영익
  { ...playersRoster[5], goals: 0, assists: 0, attendanceMatches: 7, attendancePercent: 0 }, //최승호
  { ...playersRoster[6], goals: 11, assists: 11, attendanceMatches: 9, attendancePercent: 0 }, //제갈
  { ...playersRoster[7], goals: 0, assists: 2, attendanceMatches: 11, attendancePercent: 0 }, //유동엽
  { ...playersRoster[8], goals: 6, assists: 3, attendanceMatches: 6, attendancePercent: 0 }, //신성오
  { ...playersRoster[9], goals: 3, assists: 1, attendanceMatches: 11, attendancePercent: 0 }, //현신우
  { ...playersRoster[10], goals: 7, assists: 7, attendanceMatches: 14, attendancePercent: 0 }, //윤동관
  { ...playersRoster[11], goals: 7, assists: 4, attendanceMatches: 9, attendancePercent: 0 }, //고형우
  { ...playersRoster[12], goals: 11, assists: 5, attendanceMatches: 11, attendancePercent: 0 }, //차우현
  { ...playersRoster[13], goals: 0, assists: 0, attendanceMatches: 6, attendancePercent: 0 }, //민윤기
  { ...playersRoster[14], goals: 0, assists: 0, attendanceMatches: 2, attendancePercent: 0 }, //박준휘
  { ...playersRoster[15], goals: 1, assists: 0, attendanceMatches: 12, attendancePercent: 0 }, //진바울
  { ...playersRoster[16], goals: 1, assists: 2, attendanceMatches: 12, attendancePercent: 0 }, //박성빈
  { ...playersRoster[17], goals: 2, assists: 5, attendanceMatches: 5, attendancePercent: 0 }, //이영호
  { ...playersRoster[18], goals: 0, assists: 0, attendanceMatches: 13, attendancePercent: 0 }, //송대현
  { ...playersRoster[19], goals: 3, assists: 1, attendanceMatches: 6, attendancePercent: 0 }, //조태형
  { ...playersRoster[20], goals: 0, assists: 0, attendanceMatches: 3, attendancePercent: 0 }, //문태중
  { ...playersRoster[21], goals: 6, assists: 3, attendanceMatches: 7, attendancePercent: 0 }, //강하람
  { ...playersRoster[22], goals: 2, assists: 0, attendanceMatches: 2, attendancePercent: 0 }, //이한석
  { ...playersRoster[23], goals: 0, assists: 0, attendanceMatches: 1, attendancePercent: 0 }, //우찬영
  { ...playersRoster[24], goals: 0, assists: 0, attendanceMatches: 1, attendancePercent: 0 }, //이주현
].map((p) => ({
  ...p,
  attendancePercent: Math.round((p.attendanceMatches / TOTAL_MATCHES) * 100),
}))
