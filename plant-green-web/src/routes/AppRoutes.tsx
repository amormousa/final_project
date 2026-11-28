import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'

const AuthLayout = lazy(() => import('../app/layouts/AuthLayout'))
const AppLayout = lazy(() => import('../app/layouts/AppLayout'))
const SupplierLayout = lazy(() => import('../app/layouts/SupplierLayout'))
const AdminLayout = lazy(() => import('../app/layouts/AdminLayout'))
const RoutePlaceholder = lazy(() => import('../components/layout/RoutePlaceholder'))
const NotFound = lazy(() => import('../components/feedback/NotFound'))
const AcademyPage = lazy(() => import('../features/academy/AcademyPage'))

export function AppRoutes() {
  return (
    <Suspense fallback={<div role="status" aria-busy="true" />}>
      <Routes>
        <Route path="/auth" element={<AuthLayout />}>
          <Route index element={<Navigate to="/welcome" replace />} />
          <Route path="welcome" element={<Navigate to="/welcome" replace />} />
          <Route path="*" element={<NotFound />} />
        </Route>
        <Route path="/welcome" element={<AuthLayout />}>
          <Route index element={<RoutePlaceholder />} />
        </Route>
        <Route path="/app" element={<AppLayout />}>
          <Route index element={<Navigate to="/app/dashboard" replace />} />
          <Route path="dashboard" element={<RoutePlaceholder />} />
          <Route path="farms" element={<RoutePlaceholder />} />
          <Route path="farms/details" element={<RoutePlaceholder />} />
          <Route path="farms/zones" element={<RoutePlaceholder />} />
          <Route path="soil" element={<RoutePlaceholder />} />
          <Route path="weather" element={<RoutePlaceholder />} />
          <Route path="devices" element={<RoutePlaceholder />} />
          <Route path="canopy" element={<RoutePlaceholder />} />
          <Route path="ai" element={<RoutePlaceholder />} />
          <Route path="irrigation" element={<RoutePlaceholder />} />
          <Route path="marketplace" element={<RoutePlaceholder />} />
          <Route path="orders" element={<RoutePlaceholder />} />
          <Route path="returns" element={<RoutePlaceholder />} />
          <Route path="finance" element={<RoutePlaceholder />} />
          <Route path="subscriptions" element={<RoutePlaceholder />} />
          <Route path="services" element={<RoutePlaceholder />} />
          <Route path="academy/*" element={<AcademyPage />} />
          <Route path="account" element={<RoutePlaceholder />} />
          <Route path="account/profile" element={<RoutePlaceholder />} />
          <Route path="account/team" element={<RoutePlaceholder />} />
          <Route path="account/policies" element={<RoutePlaceholder />} />
          <Route path="settings" element={<RoutePlaceholder />} />
          <Route path="support" element={<RoutePlaceholder />} />
          <Route path="*" element={<NotFound />} />
        </Route>
        <Route path="/supplier" element={<SupplierLayout />}>
          <Route index element={<Navigate to="/welcome" replace />} />
          <Route path="*" element={<RoutePlaceholder />} />
        </Route>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="/welcome" replace />} />
          <Route path="support" element={<RoutePlaceholder />} />
          <Route path="*" element={<RoutePlaceholder />} />
        </Route>
        <Route path="/" element={<Navigate to="/welcome" replace />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  )
}
