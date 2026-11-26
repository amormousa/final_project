import type { PropsWithChildren } from 'react'
import { AuthContext } from './AuthContext'

export function AuthProvider({ children }: PropsWithChildren) {
  return (
    <AuthContext.Provider value={{ isAuthenticated: false }}>
      {children}
    </AuthContext.Provider>
  )
}
