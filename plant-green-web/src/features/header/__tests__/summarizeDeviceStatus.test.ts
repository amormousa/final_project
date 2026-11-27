import { describe, expect, it } from 'vitest'
import type { Device, DeviceStatus } from '../types'
import { summarizeDeviceStatus } from '../utils/summarizeDeviceStatus'

function device(status: DeviceStatus, id: string): Device {
  return {
    id,
    farmId: 'farm-north',
    nameKey: 'device.name',
    zoneKey: 'zone.name',
    controlsKeys: [],
    status,
    lastSeen: null,
  }
}

describe('summarizeDeviceStatus', () => {
  it('reports all devices online', () => {
    expect(summarizeDeviceStatus([device('online', 'a'), device('online', 'b')]))
      .toEqual({ connected: 2, total: 2, state: 'online' })
  })

  it('reports a partial outage', () => {
    expect(summarizeDeviceStatus([device('online', 'a'), device('offline', 'b')]))
      .toEqual({ connected: 1, total: 2, state: 'partial' })
  })

  it('reports all devices offline', () => {
    expect(summarizeDeviceStatus([device('offline', 'a'), device('offline', 'b')]))
      .toEqual({ connected: 0, total: 2, state: 'offline' })
  })

  it('treats an empty device list as unknown', () => {
    expect(summarizeDeviceStatus([])).toEqual({ connected: 0, total: 0, state: 'unknown' })
  })
})
