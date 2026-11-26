import { useContext } from 'react'
import { AuthContext } from '../../app/providers/AuthContext'
import type { Permission } from './permissions'

export function usePermission(permission: Permission) {
  const { permissions } = useContext(AuthContext)
  return permissions.includes(permission)
}
