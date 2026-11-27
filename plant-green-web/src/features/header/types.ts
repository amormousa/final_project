export interface Farm {
  id: string
  nameKey: string
  locationKey: string
}

export type DeviceStatus = 'online' | 'offline' | 'unknown'

export interface Device {
  id: string
  farmId: string
  nameKey: string
  zoneKey: string
  controlsKeys: string[]
  status: DeviceStatus
  lastSeen: string | null
}

export type NotificationType = 'devices' | 'irrigation' | 'orders'

export interface AppNotification {
  id: string
  type: NotificationType
  titleKey: string
  messageKey: string
  createdAt: string
  read: boolean
}

export interface UserSummary {
  nameKey: string
  email: string
  initials: string
}

export type SystemStatusState = 'online' | 'partial' | 'offline' | 'unknown'

export interface DeviceStatusSummary {
  connected: number
  total: number
  state: SystemStatusState
}
