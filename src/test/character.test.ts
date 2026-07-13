import { describe, it, expect } from 'vitest'

interface Character {
  id: number
  nombre: string
  clase: string
  raza: string
  nivel: number
  fuerza?: number
  destreza?: number
  constitucion?: number
  inteligencia?: number
  sabiduria?: number
  carisma?: number
  hitPoints?: number
  armorClass?: number
  classList?: { name: string; level: number }[]
}

function calcTotalLevel(c: Character): number {
  if (c.classList && c.classList.length > 0) {
    return c.classList.reduce((s, e) => s + e.level, 0)
  }
  return c.nivel
}

function calcMod(stat: number): number {
  return Math.floor((stat - 10) / 2)
}

function calcProfBonus(level: number): number {
  return 2 + Math.floor((level - 1) / 4)
}

describe('Character helpers', () => {
  const char: Character = {
    id: 1, nombre: 'Test', clase: 'Guerrero', raza: 'Humano', nivel: 5,
    fuerza: 16, destreza: 14, constitucion: 14,
    classList: [{ name: 'Guerrero', level: 3 }, { name: 'Paladin', level: 2 }],
  }

  it('calculates total level from classList', () => {
    expect(calcTotalLevel(char)).toBe(5)
  })

  it('calculates stat modifier correctly', () => {
    expect(calcMod(10)).toBe(0)
    expect(calcMod(16)).toBe(3)
    expect(calcMod(8)).toBe(-1)
    expect(calcMod(20)).toBe(5)
  })

  it('calculates proficiency bonus', () => {
    expect(calcProfBonus(1)).toBe(2)
    expect(calcProfBonus(5)).toBe(3)
    expect(calcProfBonus(9)).toBe(4)
    expect(calcProfBonus(17)).toBe(6)
  })
})
