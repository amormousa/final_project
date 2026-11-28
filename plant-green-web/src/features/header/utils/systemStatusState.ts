import type { Device } from '../types'

export interface SystemStatusResult {
  farmId: string
  refreshCount: number
  devices: Device[]
  error: unknown
  updatedAt: string | null
}

export function createFailedStatusResult(
  previous: SystemStatusResult | null,
  farmId: string,
  refreshCount: number,
  error: unknown,
): SystemStatusResult {
  return {
    farmId,
    refreshCount,
    devices: [],
    error,
    updatedAt: previous?.farmId === farmId ? previous.updatedAt : null,
  }
}

export function getCurrentDevices(
  result: SystemStatusResult | null,
  farmId: string | null,
  refreshCount: number,
): Device[] {
  return result?.farmId === farmId && result.refreshCount === refreshCount && result.error === null
    ? result.devices
    : []
}
