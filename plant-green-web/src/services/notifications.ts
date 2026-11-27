import { MOCK_NOTIFICATIONS } from '../data/mock/notifications'
import type { AppNotification } from '../features/header/types'
import { mockDelay } from './mockDelay'

let notifications = MOCK_NOTIFICATIONS.map((notification) => ({ ...notification }))

export function getNotifications(): Promise<AppNotification[]> {
  return mockDelay(notifications.map((notification) => ({ ...notification })))
}

export function markNotificationRead(notificationId: string): Promise<AppNotification[]> {
  notifications = notifications.map((notification) => notification.id === notificationId
    ? { ...notification, read: true }
    : notification)
  return getNotifications()
}

export function markAllNotificationsRead(): Promise<AppNotification[]> {
  notifications = notifications.map((notification) => ({ ...notification, read: true }))
  return getNotifications()
}
