import { useCallback, useEffect, useMemo, useState } from 'react'
import { getDevicesForFarm } from '../../../services/devices'
import type { Device } from '../types'
import { summarizeDeviceStatus } from '../utils/summarizeDeviceStatus'

const REFRESH_INTERVAL = 30_000
const EMPTY_DEVICES: Device[] = []

export function useSystemStatus(farmId: string | null) {
  const [result, setResult] = useState<{
    farmId: string
    refreshCount: number
    devices: Device[]
    error: unknown
  } | null>(null)
  const [refreshCount, setRefreshCount] = useState(0)
  const devices = result?.farmId === farmId ? result.devices : EMPTY_DEVICES
  const currentResult = result?.farmId === farmId && result.refreshCount === refreshCount
    ? result
    : null
  const loading = Boolean(farmId) && !currentResult
  const error = currentResult?.error ?? null
  const summary = useMemo(() => summarizeDeviceStatus(devices), [devices])

  const retry = useCallback(() => setRefreshCount((count) => count + 1), [])

  useEffect(() => {
    let active = true
    if (!farmId) return () => { active = false }
    getDevicesForFarm(farmId)
      .then((loadedDevices) => {
        if (active) setResult({ farmId, refreshCount, devices: loadedDevices, error: null })
      })
      .catch((cause: unknown) => {
        if (active) {
          setResult((previous) => ({
            farmId,
            refreshCount,
            devices: previous?.farmId === farmId ? previous.devices : [],
            error: cause,
          }))
        }
      })
    return () => {
      active = false
    }
  }, [farmId, refreshCount])

  useEffect(() => {
    if (!farmId) return
    const timer = window.setInterval(() => setRefreshCount((count) => count + 1), REFRESH_INTERVAL)
    return () => window.clearInterval(timer)
  }, [farmId])

  return { devices, summary, loading, error, retry }
}
