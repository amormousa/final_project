import type { Farm } from '../types'

const FARM_STORAGE_KEY = 'plant-green.selected-farm'

export interface FarmStorage {
  getItem: (key: string) => string | null
  setItem: (key: string, value: string) => void
  removeItem: (key: string) => void
}

export function readPersistedFarmId(storage: Pick<FarmStorage, 'getItem'>): string | null {
  return storage.getItem(FARM_STORAGE_KEY)
}

export function persistFarmId(storage: FarmStorage, farmId: string | null): void {
  if (farmId) storage.setItem(FARM_STORAGE_KEY, farmId)
  else storage.removeItem(FARM_STORAGE_KEY)
}

export function resolveSelectedFarmId(farms: Farm[], storedId: string | null): string | null {
  return farms.find((farm) => farm.id === storedId)?.id ?? farms[0]?.id ?? null
}
