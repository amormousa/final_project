import type { PropsWithChildren } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../app/providers/useAuth'

export function PrivateRoute({ children }: PropsWithChildren) {
  const { isAuthenticated } = useAuth()

  return isAuthenticated ? children : <Navigate to="/auth" replace />
}
