import type { PropsWithChildren } from 'react'
import { useMemo, useState } from 'react'
import { AuthContext } from './AuthContext'
import type { ApplicationRole } from '../../core/permissions/roles'
import type { Permission } from '../../core/permissions/permissions'
import {
  clearSession as clearMemorySession,
  setSession as setMemorySession,
} from '../../core/auth/session'

export function AuthProvider({ children }: PropsWithChildren) {
  const [role, setRole] = useState<ApplicationRole | null>(null)
  const [permissions, setPermissions] = useState<Permission[]>([])

  const value = useMemo(
    () => ({
      isAuthenticated: role !== null,
      role,
      permissions,
      setSession: (nextRole: ApplicationRole, nextPermissions: Permission[]) => {
        setMemorySession(nextRole, nextPermissions)
        setRole(nextRole)
        setPermissions(nextPermissions)
      },
      clearSession: () => {
        clearMemorySession()
        setRole(null)
        setPermissions([])
      },
    }),
    [role, permissions],
  )

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
