import { MOCK_USER } from '../data/mock/user'
import type { UserSummary } from '../features/header/types'
import { mockDelay } from './mockDelay'

export function getCurrentUser(): Promise<UserSummary> {
  return mockDelay({ ...MOCK_USER })
}
