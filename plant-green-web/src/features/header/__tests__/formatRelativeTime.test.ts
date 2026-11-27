import { describe, expect, it } from 'vitest'
import { formatRelativeTime } from '../utils/formatRelativeTime'

describe('formatRelativeTime', () => {
  const now = new Date('2026-11-28T12:00:00Z')

  it('formats recent past times', () => {
    expect(formatRelativeTime('2026-11-28T11:59:00Z', now, 'en')).toBe('1 minute ago')
  })

  it('formats future times in the requested locale', () => {
    expect(formatRelativeTime('2026-11-28T12:01:00Z', now, 'ar')).toContain('دقيقة')
  })

  it('surfaces invalid timestamps', () => {
    expect(() => formatRelativeTime('not-a-date', now)).toThrow(RangeError)
  })
})
