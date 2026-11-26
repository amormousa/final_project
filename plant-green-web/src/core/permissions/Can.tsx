import type { ReactNode } from 'react'
import { usePermission } from './usePermission'
import type { Permission } from './permissions'

export function Can({
  permission,
  children,
  fallback = null,
}: {
  permission: Permission
  children: ReactNode
  fallback?: ReactNode
}) {
  return usePermission(permission) ? children : fallback
}
