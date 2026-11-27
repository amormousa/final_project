import { useTranslation } from 'react-i18next'
import type { AppNotification, NotificationType } from '../../types'
import { formatRelativeTime } from '../../utils/formatRelativeTime'
import './NotificationPanel.css'

interface NotificationPanelProps {
  notifications: AppNotification[]
  loading: boolean
  error: unknown
  onRetry: () => void
  onMarkRead: (notificationId: string) => void
  onMarkAllRead: () => void
}

const NOTIFICATION_TYPES: NotificationType[] = ['devices', 'irrigation', 'orders']

export function NotificationPanel({
  notifications,
  loading,
  error,
  onRetry,
  onMarkRead,
  onMarkAllRead,
}: NotificationPanelProps) {
  const { t, i18n } = useTranslation()

  if (loading) {
    return <p className="notification-panel__message" role="status">{t('header.notifications.loading')}</p>
  }

  if (error !== null) {
    return (
      <div className="notification-panel__error" role="alert">
        <p>{t('header.notifications.error')}</p>
        <button type="button" onClick={onRetry}>{t('header.notifications.retry')}</button>
      </div>
    )
  }

  if (notifications.length === 0) {
    return <p className="notification-panel__message">{t('header.notifications.empty')}</p>
  }

  return (
    <div className="notification-panel">
      <div className="notification-panel__toolbar">
        <h2>{t('header.notifications.title')}</h2>
        <button type="button" onClick={onMarkAllRead}>
          {t('header.notifications.markAllRead')}
        </button>
      </div>
      {NOTIFICATION_TYPES.map((type) => {
        const grouped = notifications.filter((notification) => notification.type === type)
        if (grouped.length === 0) return null
        return (
          <section className="notification-panel__group" key={type}>
            <h3>{t(`header.notificationTypes.${type}`)}</h3>
            <ul>
              {grouped.map((notification) => (
                <li key={notification.id}>
                  <button
                    type="button"
                    className="notification-panel__item"
                    data-unread={!notification.read || undefined}
                    aria-label={`${t(notification.titleKey)}. ${t(notification.messageKey)}`}
                    onClick={() => {
                      if (!notification.read) onMarkRead(notification.id)
                    }}
                  >
                    <span className="notification-panel__item-copy">
                      <strong>{t(notification.titleKey)}</strong>
                      <span>{t(notification.messageKey)}</span>
                      <time dateTime={notification.createdAt}>
                        {formatRelativeTime(
                          notification.createdAt,
                          new Date(),
                          i18n.resolvedLanguage ?? 'en',
                        )}
                      </time>
                    </span>
                    {!notification.read && <span className="notification-panel__unread-dot" aria-hidden="true" />}
                  </button>
                </li>
              ))}
            </ul>
          </section>
        )
      })}
    </div>
  )
}
