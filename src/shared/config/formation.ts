export const FORMATION_442 = [
  { role: 'GK', x: 50, y: 92 },
  { role: 'LB', x: 25, y: 72 },
  { role: 'LCB', x: 42, y: 76 },
  { role: 'RCB', x: 58, y: 76 },
  { role: 'RB', x: 75, y: 72 },
  { role: 'LM', x: 25, y: 48 },
  { role: 'LCM', x: 40, y: 54 },
  { role: 'RCM', x: 60, y: 54 },
  { role: 'RM', x: 75, y: 48 },
  { role: 'LST', x: 42, y: 28 },
  { role: 'RST', x: 58, y: 28 },
]

export const FORMATION_433 = [
  { role: 'GK', x: 50, y: 92 },
  { role: 'LB', x: 25, y: 72 },
  { role: 'LCB', x: 42, y: 76 },
  { role: 'RCB', x: 58, y: 76 },
  { role: 'RB', x: 75, y: 72 },
  { role: 'LCM', x: 30, y: 50 },
  { role: 'CM', x: 50, y: 50 },
  { role: 'RCM', x: 70, y: 50 },
  { role: 'LW', x: 30, y: 25 },
  { role: 'ST', x: 50, y: 22 },
  { role: 'RW', x: 72, y: 25 },
]

export const FORMATION_4231 = [
  { role: 'GK', x: 50, y: 92 },
  { role: 'LB', x: 25, y: 72 },
  { role: 'LCB', x: 42, y: 76 },
  { role: 'RCB', x: 58, y: 76 },
  { role: 'RB', x: 75, y: 72 },
  { role: 'LDM', x: 40, y: 60 },
  { role: 'RDM', x: 60, y: 60 },
  { role: 'CAM', x: 50, y: 42 },
  { role: 'LW', x: 28, y: 36 },
  { role: 'RW', x: 72, y: 36 },
  { role: 'ST', x: 50, y: 22 },
]

export const FORMATIONS = {
  '4-4-2': FORMATION_442,
  '4-3-3': FORMATION_433,
  '4-2-3-1': FORMATION_4231,
} as const

export type FormationKey = keyof typeof FORMATIONS
