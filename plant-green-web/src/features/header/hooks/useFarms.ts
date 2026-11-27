import { useCallback, useEffect, useState } from 'react'
import { getFarms } from '../../../services/farms'
import type { Farm } from '../types'

export function useFarms() {
  const [farms, setFarms] = useState<Farm[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<unknown>(null)
  const [retryCount, setRetryCount] = useState(0)

  const retry = useCallback(() => {
    setLoading(true)
    setError(null)
    setRetryCount((count) => count + 1)
  }, [])

  useEffect(() => {
    let active = true
    getFarms()
      .then((result) => {
        if (active) setFarms(result)
      })
      .catch((cause: unknown) => {
        if (active) setError(cause)
      })
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => {
      active = false
    }
  }, [retryCount])

  return { farms, loading, error, retry }
}
