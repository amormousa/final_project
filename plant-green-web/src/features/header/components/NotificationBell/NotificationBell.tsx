import { Bell } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Dropdown } from '../Dropdown'
import './NotificationBell.css'

interface NotificationBellProps {
  unreadCount: number
  loading: boolean
  error: unknown
  children: (close: () => void) => React.ReactNode
}

export function NotificationBell({
  unreadCount,
  loading,
  error,
  children,
}: NotificationBellProps) {
  const { t } = useTranslation()
  const stateLabel = error !== null
    ? t('header.notifications.error')
    : loading
      ? t('header.notifications.loading')
      : t('header.notifications.unreadCount', { count: unreadCount })
  const badgeLabel = unreadCount > 9 ? '9+' : `${unreadCount}`

  return (
    <Dropdown
      triggerLabel={`${t('header.notifications.title')}: ${stateLabel}`}
      triggerContent={(
        <>
          <Bell size={20} aria-hidden="true" />
          {loading && <span className="notification-bell__loading" aria-hidden="true" />}
          {!loading && unreadCount > 0 && (
            <span className="notification-bell__badge" aria-hidden="true">{badgeLabel}</span>
          )}
          <span className="notification-bell__sr-only" aria-live="polite">
            {stateLabel}
          </span>
        </>
      )}
      triggerClassName="notification-bell__trigger"
      panelLabel={t('header.notifications.title')}
      panelRole="dialog"
      panelClassName="notification-bell__panel"
    >
      {children}
    </Dropdown>
  )
}
