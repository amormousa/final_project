import { describe, expect, it } from 'vitest'
import type { AppNotification } from '../types'
import {
  countUnreadNotifications,
  markAllNotificationsReadLocally,
  markNotificationReadLocally,
} from '../utils/notifications'

const notifications: AppNotification[] = [
  { id: 'one', type: 'devices', titleKey: 'one.title', messageKey: 'one.message', createdAt: '2026-01-01T00:00:00Z', read: false },
  { id: 'two', type: 'orders', titleKey: 'two.title', messageKey: 'two.message', createdAt: '2026-01-01T00:00:00Z', read: false },
  { id: 'three', type: 'irrigation', titleKey: 'three.title', messageKey: 'three.message', createdAt: '2026-01-01T00:00:00Z', read: true },
]

describe('notification read helpers', () => {
  it('counts unread notifications and marks an item read', () => {
    const updated = markNotificationReadLocally(notifications, 'one')
    expect(countUnreadNotifications(notifications)).toBe(2)
    expect(countUnreadNotifications(updated)).toBe(1)
  })

  it('marks every notification read', () => {
    const updated = markAllNotificationsReadLocally(notifications)
    expect(countUnreadNotifications(updated)).toBe(0)
    expect(notifications[0].read).toBe(false)
  })
})
