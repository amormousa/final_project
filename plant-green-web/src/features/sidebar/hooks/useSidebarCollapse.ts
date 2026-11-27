import { useCallback, useEffect, useRef, useState } from 'react'

const STORAGE_KEY = 'plant-green-sidebar-collapsed'

function isMobileViewport() {
  return typeof window !== 'undefined' && window.matchMedia('(max-width: 1023px)').matches
}

function readStoredCollapsed() {
  if (
    typeof window === 'undefined'
    || (window.location.protocol !== 'http:' && window.location.protocol !== 'https:')
  ) return false
  return window.localStorage.getItem(STORAGE_KEY) === 'true'
}

export function useSidebarCollapse() {
  const [collapsed, setCollapsed] = useState(() => isMobileViewport() || readStoredCollapsed())
  const [isTransitioning, setIsTransitioning] = useState(false)
  const transitionTimer = useRef<number | null>(null)

  const setCollapsedWithTransition = useCallback((next: boolean) => {
    setCollapsed(next)
    setIsTransitioning(true)
    if (transitionTimer.current !== null) window.clearTimeout(transitionTimer.current)
    transitionTimer.current = window.setTimeout(() => {
      transitionTimer.current = null
      setIsTransitioning(false)
    }, 300)
  }, [])

  const setCollapsedForViewport = useCallback((isMobile: boolean) => {
    setCollapsed(isMobile || readStoredCollapsed())
  }, [])

  useEffect(() => {
    if (isMobileViewport()) return
    if (window.location.protocol === 'http:' || window.location.protocol === 'https:') {
      window.localStorage.setItem(STORAGE_KEY, String(collapsed))
    }
  }, [collapsed])

  useEffect(() => () => {
    if (transitionTimer.current !== null) window.clearTimeout(transitionTimer.current)
  }, [])

  return { collapsed, setCollapsed, isTransitioning, setCollapsedWithTransition, setCollapsedForViewport }
}
