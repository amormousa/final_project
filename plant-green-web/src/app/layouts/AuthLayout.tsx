import { Outlet } from 'react-router-dom'
import { GuestLanguageButton } from '../../features/header'

export default function AuthLayout() {
  return (
    <main className="layout layout--auth">
      <GuestLanguageButton />
      <Outlet />
    </main>
  )
}
