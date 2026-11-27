import { useEffect } from 'react'
import type { RefObject } from 'react'

interface ClickOutsideOptions {
  enabled: boolean
  refs: RefObject<HTMLElement | null>[]
  onOutside: () => void
}

export function useClickOutside({ enabled, refs, onOutside }: ClickOutsideOptions) {
  useEffect(() => {
    if (!enabled) return

    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target
      if (!(target instanceof Node) || refs.some((ref) => ref.current?.contains(target))) return
      onOutside()
    }

    document.addEventListener('pointerdown', handlePointerDown)
    return () => document.removeEventListener('pointerdown', handlePointerDown)
  }, [enabled, onOutside, refs])
}
