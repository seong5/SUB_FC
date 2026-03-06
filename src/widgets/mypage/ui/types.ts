export type UserData = {
  name: string
  id: string
  rank: string
  position: string
  stats: {
    pace: number
    shooting: number
    passing: number
    defense: number
    physical: number
  }
}

export type ActivityLog = {
  date: string
  type: string
  desc: string
  status: string
}
