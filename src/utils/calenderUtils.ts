export const isSameDate = (date1: Date, date2: Date) => {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  )
}

// 월의 첫 번째 날짜 가져오기
export const getFirstDayOfMonth = (date: Date): Date => {
  return new Date(date.getFullYear(), date.getMonth(), 1)
}

// 월의 마지막 날짜 가져오기
export const getLastDayOfMonth = (date: Date): Date => {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0)
}

// 달력에 표시할 모든 날짜 배열 생성
export const getCalendarDates = (date: Date): Date[] => {
  const firstDay = getFirstDayOfMonth(date)
  const firstDayOfWeek = firstDay.getDay() // 0(일요일) ~ 6(토요일)
  const daysInMonth = getLastDayOfMonth(date).getDate() // 해당 월의 마지막 날

  // 필요한 주 수 계산
  const weeksCount = Math.ceil((firstDayOfWeek + daysInMonth) / 7)
  const totalDays = weeksCount * 7 // 총 필요한 날짜 수

  // 시작 날짜 (일요일부터)
  const startDate = new Date(firstDay)
  startDate.setDate(startDate.getDate() - firstDayOfWeek)

  // 끝 날짜
  const endDate = new Date(startDate)
  endDate.setDate(endDate.getDate() + totalDays - 1)

  const dates: Date[] = []
  const current = new Date(startDate)

  while (current <= endDate) {
    dates.push(new Date(current))
    current.setDate(current.getDate() + 1)
  }

  return dates
}

// 날짜를 YYYY-MM-DD 형식으로 변환
export const formatDate = (date: Date): string => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

// 사용자 표시용 (한국어, 2자리 년도)
export const formatDateKorean = (date: Date): string => {
  const year = String(date.getFullYear()).slice(-2)
  const month = date.getMonth() + 1
  const day = date.getDate()
  return `${year}년 ${month}월 ${day}일`
}

// 월 이름 가져오기
export const getMonthName = (date: Date): string => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  return `${year}년 ${month}월`
}

export const formatDateForAPI = (date: Date) => ({
  year: date.getFullYear().toString(),
  month: (date.getMonth() + 1).toString().padStart(2, '0'),
})
