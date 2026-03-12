import type { RosterData } from '../model/types'

export type MatchOutcome = 'win' | 'draw' | 'lose'

export type AttendWdlSummary = {
  attended: number
  win: number
  draw: number
  lose: number
  unknown: number
  winRate: number
  drawRate: number
  loseRate: number
}

export function didPlayerAttendRoster(roster: RosterData | null | undefined, playerId: string) {
  if (!roster) return false
  const allIds = [...roster.GK, ...roster.DF, ...roster.MF, ...roster.FW]
  return allIds.includes(playerId)
}

export function parseFinalScore(score: string | null | undefined) {
  if (!score) return null
  const trimmed = score.trim()
  const parts = trimmed.split('-')
  if (parts.length !== 2) return null
  const left = Number(parts[0].trim())
  const right = Number(parts[1].trim())
  if (!Number.isFinite(left) || !Number.isFinite(right)) return null
  return { my: left, opp: right }
}

export function getOutcomeFromScore(score: string | null | undefined): MatchOutcome | null {
  const parsed = parseFinalScore(score)
  if (!parsed) return null
  if (parsed.my > parsed.opp) return 'win'
  if (parsed.my < parsed.opp) return 'lose'
  return 'draw'
}

export type MatchForAttendWdl = {
  roster?: RosterData | null
  score?: string | null
}

export function calcAttendWdlForPlayer(playerId: string, matches: MatchForAttendWdl[]): AttendWdlSummary {
  const base = matches.reduce<
    Omit<AttendWdlSummary, 'winRate' | 'drawRate' | 'loseRate'>
  >(
    (acc, m) => {
      if (!didPlayerAttendRoster(m.roster ?? null, playerId)) return acc

      acc.attended += 1
      const outcome = getOutcomeFromScore(m.score ?? null)
      if (outcome === 'win') acc.win += 1
      else if (outcome === 'draw') acc.draw += 1
      else if (outcome === 'lose') acc.lose += 1
      else acc.unknown += 1

      return acc
    },
    { attended: 0, win: 0, draw: 0, lose: 0, unknown: 0 }
  )

  const total = base.attended || 0

  return {
    ...base,
    winRate: total ? Math.round((base.win / total) * 100) : 0,
    drawRate: total ? Math.round((base.draw / total) * 100) : 0,
    loseRate: total ? Math.round((base.lose / total) * 100) : 0,
  }
}

