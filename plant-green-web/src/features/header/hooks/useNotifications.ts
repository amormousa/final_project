import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  getNotifications,
  markAllNotificationsRead,
  markNotificationRead,
} from '../../../services/notifications'
import type { AppNotification } from '../types'
import { countUnreadNotifications } from '../utils/notifications'

export function useNotifications() {
  const [notifications, setNotifications] = useState<AppNotification[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<unknown>(null)
  const [retryCount, setRetryCount] = useState(0)
  const unreadCount = useMemo(() => countUnreadNotifications(notifications), [notifications])

  const retry = useCallback(() => {
    setLoading(true)
    setError(null)
    setRetryCount((count) => count + 1)
  }, [])
  const markRead = useCallback(async (id: string) => {
    try {
      setNotifications(await markNotificationRead(id))
      setError(null)
    } catch (cause: unknown) {
      setError(cause)
    }
  }, [])
  const markAllRead = useCallback(async () => {
    try {
      setNotifications(await markAllNotificationsRead())
      setError(null)
    } catch (cause: unknown) {
      setError(cause)
    }
  }, [])

  useEffect(() => {
    let active = true
    getNotifications()
      .then((result) => {
        if (active) setNotifications(result)
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

  return { notifications, unreadCount, loading, error, retry, markRead, markAllRead }
}
