import { Menu } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Breadcrumb } from './components/Breadcrumb'
import { FarmSelector } from './components/FarmSelector'
import { NotificationBell } from './components/NotificationBell'
import { NotificationPanel } from './components/NotificationPanel'
import { SystemStatus } from './components/SystemStatus'
import { UserMenu } from './components/UserMenu'
import { useCurrentUser } from './hooks/useCurrentUser'
import { useNotifications } from './hooks/useNotifications'
import './AppHeader.css'

interface AppHeaderProps {
  dark: boolean
  onDarkChange: (dark: boolean) => void
  sidebarOpen: boolean
  onOpenNavigation: () => void
}

export function AppHeader({
  dark,
  onDarkChange,
  sidebarOpen,
  onOpenNavigation,
}: AppHeaderProps) {
  const { t } = useTranslation()
  const notifications = useNotifications()
  const user = useCurrentUser()

  return (
    <header className="app-header" data-dark={dark}>
      <button
        className="app-header__navigation"
        type="button"
        aria-label={t('header.openNavigation')}
        aria-expanded={sidebarOpen}
        aria-controls="plant-green-sidebar-nav"
        onClick={onOpenNavigation}
      >
        <Menu size={20} aria-hidden="true" />
      </button>
      <FarmSelector />
      <Breadcrumb />
      <div className="app-header__actions">
        <SystemStatus />
        <NotificationBell
          unreadCount={notifications.unreadCount}
          loading={notifications.loading}
          error={notifications.error}
        >
          {() => (
            <NotificationPanel
              notifications={notifications.notifications}
              loading={notifications.loading}
              error={notifications.error}
              onRetry={notifications.retry}
              onMarkRead={notifications.markRead}
              onMarkAllRead={notifications.markAllRead}
            />
          )}
        </NotificationBell>
        <UserMenu
          user={user.user}
          loading={user.loading}
          error={user.error}
          retry={user.retry}
          dark={dark}
          onDarkChange={onDarkChange}
        />
      </div>
    </header>
  )
}
