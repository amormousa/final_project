import { describe, expect, it } from 'vitest'
import { NAV } from '../data/navigation'
import { filterNavigation } from '../utils/filterNavigation'

describe('filterNavigation', () => {
  it('keeps only matching children and keeps a matching parent', () => {
    const result = filterNavigation(NAV, 'a')
    const services = result.sections.find((section) => section.id === 'services')
    const financial = services?.items.find((item) => item.id === 'financial')

    expect(financial?.children?.map((child) => child.id)).toEqual(['finance'])
    expect(result.results.map((item) => item.id)).not.toContain('subscriptions')
    expect(result.results.map((item) => item.id)).toContain('finance')
  })

  it('matches Arabic labels and restores the original tree for an empty query', () => {
    const arabicResult = filterNavigation(NAV, 'الاشتراكات')
    const services = arabicResult.sections.find((section) => section.id === 'services')
    const financial = services?.items.find((item) => item.id === 'financial')
    const emptyResult = filterNavigation(NAV, '  ')

    expect(financial?.children?.map((child) => child.id)).toEqual(['subscriptions'])
    expect(emptyResult.sections).toBe(NAV)
    expect(emptyResult.results).toEqual([])
  })
})
