import { describe, expect, it } from 'vitest'
import { canForRole } from '../../src/core/permissions/can'
import type { Permission } from '../../src/core/permissions/permissions'
import type { ApplicationRole, StaffRole } from '../../src/core/permissions/roles'

const prohibitedPermissions: Permission[] = [
  'irrigation.control',
  'canopy.control',
  'devices.command',
]

describe('staff control permissions', () => {
  it.each([
    'admin',
    'sales',
    'account_manager',
    'accounts',
  ] as (ApplicationRole | StaffRole)[])(
    '%s cannot trigger irrigation, canopy or device commands',
    (role) => {
      for (const permission of prohibitedPermissions) {
        expect(canForRole(role, permission)).toBe(false)
      }
    },
  )
})
