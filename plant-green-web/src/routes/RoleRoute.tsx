import type { PropsWithChildren } from 'react'
import { Navigate } from 'react-router-dom'
import type { ApplicationRole } from '../app/config/roles'
import { useAuth } from '../app/providers/useAuth'

interface RoleRouteProps extends PropsWithChildren {
  allowedRoles: ApplicationRole[]
}

export function RoleRoute({ allowedRoles, children }: RoleRouteProps) {
  const { role, isAuthenticated } = useAuth()
  if (!isAuthenticated) return <Navigate to="/auth" replace />
  return role && allowedRoles.includes(role) ? children : <Navigate to="/app" replace />
}
