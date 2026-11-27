import { MOCK_FARMS } from '../data/mock/farms'
import type { Farm } from '../features/header/types'
import { mockDelay } from './mockDelay'

export function getFarms(): Promise<Farm[]> {
  return mockDelay(MOCK_FARMS.map((farm) => ({ ...farm })))
}
