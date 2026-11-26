import { createContext } from 'react'
import type { ApplicationRole } from '../../core/permissions/roles'
import type { Permission } from '../../core/permissions/permissions'

export interface AuthContextValue {
  isAuthenticated: boolean
  role: ApplicationRole | null
  permissions: Permission[]
  setSession: (role: ApplicationRole, permissions: Permission[]) => void
  clearSession: () => void
}

export const AuthContext = createContext<AuthContextValue>({
  isAuthenticated: false,
  role: null,
  permissions: [],
  setSession: () => undefined,
  clearSession: () => undefined,
})
