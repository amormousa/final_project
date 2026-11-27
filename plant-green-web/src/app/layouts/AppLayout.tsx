import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { PlantGreenSidebar } from '../../components/layout/PlantGreenSidebar'
import { PrivateRoute } from '../../routes/PrivateRoute'

export default function AppLayout() {
  const [dark, setDark] = useState(false)

  return (
    <PrivateRoute allowDevelopmentPreview>
      <div className="app-shell" data-dark={dark}>
        <PlantGreenSidebar dark={dark} onDarkChange={setDark} />
        <main className="layout layout--app">
          <Outlet />
        </main>
      </div>
    </PrivateRoute>
  )
}
