import { getSession } from '../auth/session'
import type { Permission } from './permissions'

export function usePermission(permission: Permission) {
  const { permissions } = getSession()
  return permissions.includes(permission)
}
