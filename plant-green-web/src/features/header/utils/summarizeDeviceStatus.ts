import type { Device, DeviceStatusSummary } from '../types'

export function summarizeDeviceStatus(devices: Device[]): DeviceStatusSummary {
  const connected = devices.filter((device) => device.status === 'online').length
  const unknown = devices.some((device) => device.status === 'unknown')
  const total = devices.length

  if (total === 0 || unknown) return { connected, total, state: 'unknown' }
  if (connected === total) return { connected, total, state: 'online' }
  if (connected === 0) return { connected, total, state: 'offline' }
  return { connected, total, state: 'partial' }
}
