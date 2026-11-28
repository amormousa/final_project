import { describe, expect, it } from 'vitest'
import type { Device, DeviceStatus } from '../types'
import { summarizeDeviceStatus } from '../utils/summarizeDeviceStatus'
import { createFailedStatusResult, getCurrentDevices } from '../utils/systemStatusState'

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

describe('system status refresh failures', () => {
  it('clears the prior devices and preserves the last successful update time', () => {
    const previous = {
      farmId: 'farm-north', refreshCount: 0, devices: [device('online', 'a')], error: null,
      updatedAt: '2026-11-28T00:00:00.000Z',
    }
    const failed = createFailedStatusResult(previous, 'farm-north', 1, new Error('offline'))

    expect(failed.devices).toEqual([])
    expect(failed.error).toBeInstanceOf(Error)
    expect(failed.updatedAt).toBe(previous.updatedAt)
    expect(getCurrentDevices(failed, 'farm-north', 1)).toEqual([])
    expect(summarizeDeviceStatus(getCurrentDevices(failed, 'farm-north', 1)).state).toBe('unknown')
  })
})
