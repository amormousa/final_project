import type { PropsWithChildren } from 'react'
import { Navigate } from 'react-router-dom'
import type { ApplicationRole } from '../app/config/roles'

interface RoleRouteProps extends PropsWithChildren {
  allowedRoles: ApplicationRole[]
}

export function RoleRoute({ allowedRoles, children }: RoleRouteProps) {
  void allowedRoles
  void children
  return <Navigate to="/auth" replace />
}
