import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'

const AuthLayout = lazy(() => import('../app/layouts/AuthLayout'))
const AppLayout = lazy(() => import('../app/layouts/AppLayout'))
const SupplierLayout = lazy(() => import('../app/layouts/SupplierLayout'))
const AdminLayout = lazy(() => import('../app/layouts/AdminLayout'))
const RoutePlaceholder = lazy(() => import('../components/layout/RoutePlaceholder'))

export function AppRoutes() {
  return (
    <Suspense fallback={<div role="status" aria-busy="true" />}>
      <Routes>
        <Route path="/auth" element={<AuthLayout />}>
          <Route index element={<Navigate to="/auth/welcome" replace />} />
          <Route path="*" element={<RoutePlaceholder />} />
        </Route>
        <Route path="/app" element={<AppLayout />}>
          <Route index element={<Navigate to="/auth" replace />} />
          <Route path="support" element={<RoutePlaceholder />} />
          <Route path="*" element={<RoutePlaceholder />} />
        </Route>
        <Route path="/supplier" element={<SupplierLayout />}>
          <Route index element={<Navigate to="/auth" replace />} />
          <Route path="*" element={<RoutePlaceholder />} />
        </Route>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="/auth" replace />} />
          <Route path="support" element={<RoutePlaceholder />} />
          <Route path="*" element={<RoutePlaceholder />} />
        </Route>
        <Route path="/" element={<Navigate to="/auth" replace />} />
        <Route path="*" element={<RoutePlaceholder />} />
      </Routes>
    </Suspense>
  )
}
