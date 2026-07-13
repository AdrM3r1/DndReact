import { describe, it, expect } from 'vitest'
import { COLORS } from '../theme/colors'

describe('COLORS constants', () => {
  it('has gold color defined', () => {
    expect(COLORS.gold).toBe('#d4af37')
  })

  it('has all required color keys', () => {
    expect(COLORS).toHaveProperty('gold')
    expect(COLORS).toHaveProperty('cream')
    expect(COLORS).toHaveProperty('danger')
    expect(COLORS).toHaveProperty('green')
  })
})
