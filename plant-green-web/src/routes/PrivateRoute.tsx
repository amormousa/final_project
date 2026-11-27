import type { PropsWithChildren } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../app/providers/useAuth'

interface PrivateRouteProps extends PropsWithChildren {
  allowDevelopmentPreview?: boolean
}

export function PrivateRoute({
  children,
  allowDevelopmentPreview = false,
}: PrivateRouteProps) {
  const { isAuthenticated } = useAuth()

  const canAccess = isAuthenticated || (allowDevelopmentPreview && import.meta.env.DEV)

  return canAccess ? children : <Navigate to="/auth" replace />
}
