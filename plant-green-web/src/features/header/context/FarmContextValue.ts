import { createContext } from 'react'
import type { Farm } from '../types'

export interface FarmContextValue {
  farms: Farm[]
  selectedFarm: Farm | null
  cachedFarmNameKey: string | null
  loading: boolean
  error: unknown
  selectFarm: (farmId: string) => void
  retry: () => void
}

export const FarmContext = createContext<FarmContextValue | null>(null)
