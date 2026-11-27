import type { AppNotification } from '../../features/header/types'

export const MOCK_NOTIFICATIONS: AppNotification[] = [
  { id: 'notification-device-1', type: 'devices', titleKey: 'header.notificationItems.deviceOffline', messageKey: 'header.notificationItems.deviceOfflineMessage', createdAt: '2026-11-28T00:40:00Z', read: false },
  { id: 'notification-irrigation-1', type: 'irrigation', titleKey: 'header.notificationItems.irrigationComplete', messageKey: 'header.notificationItems.irrigationCompleteMessage', createdAt: '2026-11-28T00:25:00Z', read: false },
  { id: 'notification-order-1', type: 'orders', titleKey: 'header.notificationItems.orderUpdate', messageKey: 'header.notificationItems.orderUpdateMessage', createdAt: '2026-11-27T23:55:00Z', read: false },
  { id: 'notification-device-2', type: 'devices', titleKey: 'header.notificationItems.sensorBattery', messageKey: 'header.notificationItems.sensorBatteryMessage', createdAt: '2026-11-27T22:15:00Z', read: false },
  { id: 'notification-irrigation-2', type: 'irrigation', titleKey: 'header.notificationItems.scheduleUpdated', messageKey: 'header.notificationItems.scheduleUpdatedMessage', createdAt: '2026-11-27T20:30:00Z', read: false },
  { id: 'notification-order-2', type: 'orders', titleKey: 'header.notificationItems.deliveryScheduled', messageKey: 'header.notificationItems.deliveryScheduledMessage', createdAt: '2026-11-27T18:45:00Z', read: false },
  { id: 'notification-device-3', type: 'devices', titleKey: 'header.notificationItems.deviceOnline', messageKey: 'header.notificationItems.deviceOnlineMessage', createdAt: '2026-11-27T16:30:00Z', read: false },
  { id: 'notification-irrigation-3', type: 'irrigation', titleKey: 'header.notificationItems.waterUsage', messageKey: 'header.notificationItems.waterUsageMessage', createdAt: '2026-11-27T14:00:00Z', read: false },
  { id: 'notification-order-3', type: 'orders', titleKey: 'header.notificationItems.invoiceReady', messageKey: 'header.notificationItems.invoiceReadyMessage', createdAt: '2026-11-27T12:15:00Z', read: false },
  { id: 'notification-device-4', type: 'devices', titleKey: 'header.notificationItems.maintenanceDue', messageKey: 'header.notificationItems.maintenanceDueMessage', createdAt: '2026-11-26T17:00:00Z', read: false },
  { id: 'notification-irrigation-read', type: 'irrigation', titleKey: 'header.notificationItems.irrigationComplete', messageKey: 'header.notificationItems.irrigationCompleteMessage', createdAt: '2026-11-25T10:00:00Z', read: true },
]
