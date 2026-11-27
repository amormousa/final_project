import type { AppNotification } from '../types'

export function countUnreadNotifications(notifications: AppNotification[]): number {
  return notifications.filter((notification) => !notification.read).length
}

export function markNotificationReadLocally(
  notifications: AppNotification[],
  notificationId: string,
): AppNotification[] {
  return notifications.map((notification) => notification.id === notificationId
    ? { ...notification, read: true }
    : notification)
}

export function markAllNotificationsReadLocally(
  notifications: AppNotification[],
): AppNotification[] {
  return notifications.map((notification) => ({ ...notification, read: true }))
}
