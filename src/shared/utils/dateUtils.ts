export function formatKoreanDate(dateStr: string) {
  const date = new Date(dateStr)
  const year = date.getFullYear()
  const month = date.getMonth() + 1 // 0부터 시작하므로 +1
  const day = date.getDate()

  return `${year}년 ${month}월 ${day}일`
}
