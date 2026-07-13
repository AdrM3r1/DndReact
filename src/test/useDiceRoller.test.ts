import { describe, it, expect } from 'vitest'

function roll(n: number): number {
  return Math.floor(Math.random() * n) + 1
}

describe('Dice rolling', () => {
  it('rolls within valid range for d20', () => {
    for (let i = 0; i < 100; i++) {
      const result = roll(20)
      expect(result).toBeGreaterThanOrEqual(1)
      expect(result).toBeLessThanOrEqual(20)
    }
  })

  it('rolls within valid range for d6', () => {
    for (let i = 0; i < 100; i++) {
      const result = roll(6)
      expect(result).toBeGreaterThanOrEqual(1)
      expect(result).toBeLessThanOrEqual(6)
    }
  })
})
