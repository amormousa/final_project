import { describe, expect, it } from 'vitest'
import { normalizeText } from '../utils/normalizeText'

describe('normalizeText', () => {
  it('trims and lowercases English text', () => {
    expect(normalizeText('  FINANCE  ')).toBe('finance')
  })

  it('trims Arabic text without changing its letters', () => {
    expect(normalizeText('  الاشتراكات  ')).toBe('الاشتراكات')
  })
})
