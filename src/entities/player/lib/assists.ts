import type { Player } from '../model/types'

export type TopAssistPlayer = Player & {
  assistRate: number
}

export function getTopAssistPlayers(players: Player[]): TopAssistPlayer[] {
  if (!players || players.length === 0) return []

  const maxAssists = players.reduce((max, p) => (p.assists > max ? p.assists : max), 0)
  if (maxAssists === 0) {
    return players.map((p) => ({
      ...p,
      assistRate: 0,
    }))
  }

  const totalAssists = players.reduce((sum, p) => sum + p.assists, 0) || 1

  return players
    .filter((p) => p.assists === maxAssists)
    .map((p) => ({
      ...p,
      assistRate: Math.round((p.assists / totalAssists) * 100),
    }))
}

