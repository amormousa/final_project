import { describe, expect, it } from 'vitest'
import type { Farm } from '../types'
import { persistDefaultFarmId, persistFarmId, readPersistedFarmId, resolveSelectedFarmId } from '../context/farmStorage'

describe('FarmContext persistence helpers', () => {
  const farms: Farm[] = [
    { id: 'farm-one', nameKey: 'farm.one', locationKey: 'location.one' },
    { id: 'farm-two', nameKey: 'farm.two', locationKey: 'location.two' },
  ]

  it('falls back to the first farm when storage has no selection', () => {
    const storedId = null
    const selectedId = resolveSelectedFarmId(farms, storedId)
    expect(selectedId).toBe('farm-one')
    const values = new Map<string, string>()
    const storage = {
      getItem: (key: string) => values.get(key) ?? null,
      setItem: (key: string, value: string) => values.set(key, value),
      removeItem: (key: string) => values.delete(key),
    }
    const updatedStoredId = persistDefaultFarmId(storage, selectedId!)
    expect(updatedStoredId).toBe('farm-one')
    expect(readPersistedFarmId(storage)).toBe(updatedStoredId)
  })

  it('keeps a valid persisted selection and replaces stale ids', () => {
    expect(resolveSelectedFarmId(farms, 'farm-two')).toBe('farm-two')
    expect(resolveSelectedFarmId(farms, 'removed-farm')).toBe('farm-one')
  })

  it('persists and reads the selected farm id', () => {
    const values = new Map<string, string>()
    const storage = {
      getItem: (key: string) => values.get(key) ?? null,
      setItem: (key: string, value: string) => values.set(key, value),
      removeItem: (key: string) => values.delete(key),
    }
    persistFarmId(storage, 'farm-two')
    expect(readPersistedFarmId(storage)).toBe('farm-two')
    persistFarmId(storage, null)
    expect(readPersistedFarmId(storage)).toBeNull()
  })
})
