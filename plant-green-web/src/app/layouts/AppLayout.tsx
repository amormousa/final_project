import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { PlantGreenSidebar } from '../../features/sidebar'
import { AppHeader, FarmProvider } from '../../features/header'
import { PrivateRoute } from '../../routes/PrivateRoute'
import './AppLayout.css'

export default function AppLayout() {
  const [dark, setDark] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <PrivateRoute allowDevelopmentPreview>
      <div className="app-shell" data-dark={dark}>
        <FarmProvider>
          <PlantGreenSidebar
            dark={dark}
            mobileOpen={sidebarOpen}
            onMobileOpenChange={setSidebarOpen}
          />
          <div className="app-content">
            <AppHeader
              dark={dark}
              onDarkChange={setDark}
              sidebarOpen={sidebarOpen}
              onOpenNavigation={() => setSidebarOpen(true)}
            />
            <main className="layout layout--app">
              <Outlet />
            </main>
          </div>
        </FarmProvider>
      </div>
    </PrivateRoute>
  )
}
