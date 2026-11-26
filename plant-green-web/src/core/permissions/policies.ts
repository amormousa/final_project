import type { ApplicationRole, StaffRole } from './roles'
import type { Permission } from './permissions'

export const STAFF_ROLES: readonly StaffRole[] = [
  'sales',
  'account_manager',
  'accounts',
]

export function staffPermissions(_role: StaffRole): readonly Permission[] {
  return []
}

export function rolePermissions(role: ApplicationRole): readonly Permission[] {
  switch (role) {
    case 'owner':
    case 'business':
      return ['irrigation.control', 'canopy.control', 'devices.command', 'farms.view']
    case 'supplier':
      return []
    case 'admin':
      return ['admin.view', 'farms.view']
    case 'insurance_officer':
      return []
  }
}
