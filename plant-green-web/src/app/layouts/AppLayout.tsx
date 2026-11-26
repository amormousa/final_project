import { Outlet } from 'react-router-dom'
import { PrivateRoute } from '../../routes/PrivateRoute'

export default function AppLayout() {
  return (
    <PrivateRoute>
      <main className="layout layout--app">
        <Outlet />
      </main>
    </PrivateRoute>
  )
}
