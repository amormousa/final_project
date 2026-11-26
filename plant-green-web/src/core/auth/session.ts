import type { ApplicationRole } from '../../app/config/roles'
import type { Permission } from '../permissions/permissions'

let accessToken: string | null = null
let sessionRole: ApplicationRole | null = null
let sessionPermissions: Permission[] = []

export function setAccessToken(token: string | null) {
  accessToken = token
}

export function getAccessToken() {
  return accessToken
}

export function setSession(role: ApplicationRole, permissions: Permission[]) {
  sessionRole = role
  sessionPermissions = [...permissions]
}

export function clearSession() {
  accessToken = null
  sessionRole = null
  sessionPermissions = []
}

export function getSession() {
  return {
    role: sessionRole,
    permissions: sessionPermissions,
  }
}
