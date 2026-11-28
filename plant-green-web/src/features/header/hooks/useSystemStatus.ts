import { useCallback, useEffect, useMemo, useState } from 'react'
import { getDevicesForFarm } from '../../../services/devices'
import { summarizeDeviceStatus } from '../utils/summarizeDeviceStatus'
import { createFailedStatusResult, getCurrentDevices } from '../utils/systemStatusState'
import type { SystemStatusResult } from '../utils/systemStatusState'

const REFRESH_INTERVAL = 30_000
export function useSystemStatus(farmId: string | null) {
  const [result, setResult] = useState<SystemStatusResult | null>(null)
  const [refreshCount, setRefreshCount] = useState(0)
  const devices = getCurrentDevices(result, farmId, refreshCount)
  const updatedAt = result?.farmId === farmId ? result.updatedAt : null
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
        if (active) setResult({ farmId, refreshCount, devices: loadedDevices, error: null, updatedAt: new Date().toISOString() })
      })
      .catch((cause: unknown) => {
        if (active) {
          setResult((previous) => createFailedStatusResult(previous, farmId, refreshCount, cause))
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

  return { devices, summary, loading, error, retry, updatedAt }
}
