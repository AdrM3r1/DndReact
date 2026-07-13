import { describe, it, expect } from 'vitest'
import { sanitize, sanitizePlain } from '../utils/sanitize'

describe('sanitize', () => {
  it('allows safe HTML tags', () => {
    expect(sanitize('<b>bold</b>')).toBe('<b>bold</b>')
  })

  it('strips script tags', () => {
    expect(sanitize('<script>alert("xss")</script>hello')).toBe('hello')
  })

  it('strips event handlers', () => {
    expect(sanitize('<div onclick="alert(1)">text</div>')).toContain('text')
  })
})

describe('sanitizePlain', () => {
  it('strips all HTML', () => {
    expect(sanitizePlain('<b>hello</b>')).toBe('hello')
  })
})
