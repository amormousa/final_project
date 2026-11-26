import type { PropsWithChildren } from 'react'

interface PermissionRouteProps extends PropsWithChildren {
  permission: string
}

export function PermissionRoute({ children, ...props }: PermissionRouteProps) {
  void props.permission
  return children
}
