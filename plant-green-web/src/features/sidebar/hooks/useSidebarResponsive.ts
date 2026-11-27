import { useEffect, useRef, useState } from 'react'

function isMobileViewport() {
  return typeof window !== 'undefined' && window.matchMedia('(max-width: 1023px)').matches
}

export function useSidebarResponsive(onViewportChange: (isMobile: boolean) => void) {
  const [isMobile, setIsMobile] = useState(isMobileViewport)
  const onViewportChangeRef = useRef(onViewportChange)

  useEffect(() => {
    onViewportChangeRef.current = onViewportChange
  }, [onViewportChange])

  useEffect(() => {
    const breakpoint = window.matchMedia('(max-width: 1023px)')
    const handleViewportChange = () => {
      setIsMobile(breakpoint.matches)
      onViewportChangeRef.current(breakpoint.matches)
    }

    breakpoint.addEventListener('change', handleViewportChange)
    return () => breakpoint.removeEventListener('change', handleViewportChange)
  }, [])

  return { isMobile }
}
