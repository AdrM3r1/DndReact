export const XP_THRESHOLDS = [
  0, 300, 900, 2700, 6500, 14000, 23000, 34000, 48000, 64000,
  85000, 100000, 120000, 140000, 165000, 195000, 225000, 265000, 305000, 355000,
]

export const HIT_DICE: Record<string, string> = {
  BARBARO: 'd12',
  BARDO: 'd8',
  BRUJO: 'd8',
  CLERIGO: 'd8',
  DRUIDA: 'd8',
  EXPLORADOR: 'd10',
  GUERRERO: 'd10',
  HECHICERO: 'd6',
  MAGO: 'd6',
  MONJE: 'd8',
  PALADIN: 'd10',
  PICARO: 'd8',
}

export function getHitDice(className: string): string {
  return HIT_DICE[className] || 'd8'
}

export function getHitDiceValue(className: string): number {
  const map: Record<string, number> = { d6: 6, d8: 8, d10: 10, d12: 12 }
  return map[getHitDice(className)] || 8
}

export function getXPForLevel(level: number): number {
  return XP_THRESHOLDS[level - 1] || 0
}

export function getLevelFromXP(xp: number): number {
  for (let i = XP_THRESHOLDS.length - 1; i >= 0; i--) {
    if (xp >= XP_THRESHOLDS[i]) return i + 1
  }
  return 1
}

export function getXPToNextLevel(level: number): number {
  if (level >= 20) return 0
  return XP_THRESHOLDS[level] - XP_THRESHOLDS[level - 1]
}

export function getMaxHPForLevel(className: string, level: number, conMod: number): number {
  const hdValue = getHitDiceValue(className)
  let hp = hdValue + conMod
  for (let i = 2; i <= level; i++) {
    hp += Math.max(1, Math.floor(hdValue / 2) + 1) + conMod
  }
  return Math.max(hp, level)
}
