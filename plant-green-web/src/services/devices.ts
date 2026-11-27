import { MOCK_DEVICES } from '../data/mock/devices'
import type { Device } from '../features/header/types'
import { mockDelay } from './mockDelay'

export function getDevicesForFarm(farmId: string): Promise<Device[]> {
  return mockDelay(
    MOCK_DEVICES
      .filter((device) => device.farmId === farmId)
      .map((device) => ({ ...device, controlsKeys: [...device.controlsKeys] })),
  )
}
