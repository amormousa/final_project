import { Outlet } from 'react-router-dom'
import { RoleRoute } from '../../routes/RoleRoute'

export default function AdminLayout() {
  return (
    <RoleRoute allowedRoles={['admin']}>
      <main className="layout layout--admin">
        <Outlet />
      </main>
    </RoleRoute>
  )
}
