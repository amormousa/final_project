import { useEffect, useRef, useState } from 'react'

export function useSidebarScroll() {
  const [scrollVisible, setScrollVisible] = useState(false)
  const scrollTimer = useRef<number | null>(null)

  const revealScrollbar = () => {
    setScrollVisible(true)
    if (scrollTimer.current !== null) window.clearTimeout(scrollTimer.current)
    scrollTimer.current = window.setTimeout(() => {
      scrollTimer.current = null
      setScrollVisible(false)
    }, 1000)
  }

  useEffect(() => () => {
    if (scrollTimer.current !== null) window.clearTimeout(scrollTimer.current)
  }, [])

  return { scrollVisible, revealScrollbar }
}
