import { describe, expect, it } from 'vitest'
import { canForRole } from '../../src/core/permissions/can'
import {
  rolePermissions,
  staffPermissions,
} from '../../src/core/permissions/policies'
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

  it('owner and business are the only application roles that may control IoT', () => {
    expect(rolePermissions('owner')).toContain('irrigation.control')
    expect(rolePermissions('business')).toContain('canopy.control')
  })

  it('all staff sub-role permission bundles exclude control permissions', () => {
    for (const role of ['sales', 'account_manager', 'accounts'] as const) {
      for (const permission of prohibitedPermissions) {
        expect(staffPermissions(role)).not.toContain(permission)
      }
    }
  })
})
