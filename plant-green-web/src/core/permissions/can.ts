import type { Permission } from './permissions'
import type { ApplicationRole, StaffRole } from './roles'
import { rolePermissions, staffRolePermissions, STAFF_ROLES } from './policies'

export function can(role: ApplicationRole | null, permission: Permission) {
  if (!role) return false
  return rolePermissions(role).includes(permission)
}

export function canForRole(
  role: ApplicationRole | StaffRole | null,
  permission: Permission,
) {
  if (!role) return false
  if (STAFF_ROLES.includes(role as StaffRole)) {
    return staffRolePermissions(role as StaffRole).includes(permission)
  }
  return rolePermissions(role as ApplicationRole).includes(permission)
}
