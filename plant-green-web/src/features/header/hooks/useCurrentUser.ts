import { useCallback, useEffect, useState } from 'react'
import { getCurrentUser } from '../../../services/user'
import type { UserSummary } from '../types'

export function useCurrentUser() {
  const [user, setUser] = useState<UserSummary | null>(null)
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
    getCurrentUser()
      .then((result) => {
        if (active) setUser(result)
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

  return { user, loading, error, retry }
}
