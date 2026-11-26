import { Outlet } from 'react-router-dom'
import { RoleRoute } from '../../routes/RoleRoute'

export default function SupplierLayout() {
  return (
    <RoleRoute allowedRoles={['supplier']}>
      <main className="layout layout--supplier">
        <Outlet />
      </main>
    </RoleRoute>
  )
}
