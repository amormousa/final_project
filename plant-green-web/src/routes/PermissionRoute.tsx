import type { PropsWithChildren } from 'react'
import { PermissionRestricted } from '../components/feedback/PermissionRestricted'
import { usePermission } from '../core/permissions/usePermission'
import type { Permission } from '../core/permissions/permissions'

interface PermissionRouteProps extends PropsWithChildren {
  permission: Permission
}

export function PermissionRoute({ children, permission }: PermissionRouteProps) {
  return usePermission(permission) ? children : <PermissionRestricted />
}
