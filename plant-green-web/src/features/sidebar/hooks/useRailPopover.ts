import { useCallback, useEffect, useRef, useState } from 'react'
import type { CSSProperties, FocusEventHandler, MouseEventHandler } from 'react'
import type { NavScreen, RailPopover } from '../types'

interface RailPopoverOptions {
  collapsed: boolean
  asideRef: { current: HTMLElement | null }
}

interface RailHandlers {
  onMouseEnter: MouseEventHandler<HTMLButtonElement>
  onMouseLeave: MouseEventHandler<HTMLButtonElement>
  onFocus: FocusEventHandler<HTMLButtonElement>
  onBlur: FocusEventHandler<HTMLButtonElement>
  onClick: MouseEventHandler<HTMLButtonElement>
}

export function useRailPopover({ collapsed, asideRef }: RailPopoverOptions) {
  const [railPopover, setRailPopover] = useState<RailPopover | null>(null)
  const railPopoverRef = useRef<RailPopover | null>(null)
  const railTimerRef = useRef<number | null>(null)
  const firstMenuItemRef = useRef<HTMLButtonElement>(null)
  const popoverStyle: CSSProperties = {
    insetBlockStart: railPopover?.top ?? 0,
    insetInlineEnd: 'calc(100% + 10px)',
  }

  const clearRailTimer = useCallback(() => {
    if (railTimerRef.current !== null) {
      window.clearTimeout(railTimerRef.current)
      railTimerRef.current = null
    }
  }, [])

  const closeRailPopover = useCallback(() => {
    clearRailTimer()
    railPopoverRef.current = null
    setRailPopover(null)
  }, [clearRailTimer])

  const showRailPopover = useCallback((
    itemId: string,
    label: string,
    element: HTMLElement,
    trigger: RailPopover['trigger'],
    screens?: NavScreen[],
  ) => {
    if (!collapsed) return
    clearRailTimer()
    const rect = element.getBoundingClientRect()
    const sideRect = asideRef.current?.getBoundingClientRect()
    const kind = screens ? 'menu' : 'tooltip'
    const viewportTop = kind === 'menu'
      ? Math.max(8, Math.min(rect.top, window.innerHeight - 300))
      : Math.max(28, Math.min(rect.top + rect.height / 2, window.innerHeight - 28))
    const next: RailPopover = {
      itemId, label, kind, trigger,
      top: viewportTop - (sideRect?.top ?? 0),
      ...(screens ? { screens } : {}),
    }
    railPopoverRef.current = next
    setRailPopover(next)
    if (trigger === 'click' && kind === 'tooltip') {
      railTimerRef.current = window.setTimeout(() => {
        if (railPopoverRef.current?.itemId === itemId) closeRailPopover()
      }, 2000)
    }
    if (trigger === 'click' && kind === 'menu') {
      window.setTimeout(() => firstMenuItemRef.current?.focus(), 0)
    }
  }, [asideRef, clearRailTimer, closeRailPopover, collapsed])

  const getRailHandlers = useCallback((id: string, label: string, screens?: NavScreen[]): RailHandlers => ({
    onMouseEnter: (event) => {
      const current = railPopoverRef.current
      const menuForThisItem = current?.itemId === id && current.kind === 'menu' && current.trigger === 'click'
      if (collapsed && !menuForThisItem) showRailPopover(id, label, event.currentTarget, 'hover')
    },
    onMouseLeave: () => {
      if (railPopoverRef.current?.trigger === 'hover') closeRailPopover()
    },
    onFocus: (event) => {
      if (collapsed) showRailPopover(id, label, event.currentTarget, 'focus')
    },
    onBlur: () => {
      if (railPopoverRef.current?.trigger === 'focus') closeRailPopover()
    },
    onClick: (event) => {
      if (screens && collapsed) {
        if (railPopoverRef.current?.itemId === id && railPopoverRef.current.kind === 'menu') {
          closeRailPopover()
        } else {
          showRailPopover(id, label, event.currentTarget, 'click', screens)
        }
      } else if (collapsed) {
        showRailPopover(id, label, event.currentTarget, 'click')
      }
    },
  }), [closeRailPopover, collapsed, showRailPopover])

  useEffect(() => {
    const handleOutsidePointer = (event: PointerEvent) => {
      const target = event.target
      if (!(target instanceof Element)) return
      if (
        !asideRef.current?.contains(target)
        || (!target.closest('.pg-rail-popover') && !target.closest('[data-nav-id]'))
      ) closeRailPopover()
    }
    document.addEventListener('pointerdown', handleOutsidePointer)
    window.addEventListener('resize', closeRailPopover)
    return () => {
      document.removeEventListener('pointerdown', handleOutsidePointer)
      window.removeEventListener('resize', closeRailPopover)
      clearRailTimer()
    }
  }, [asideRef, clearRailTimer, closeRailPopover])

  return {
    railPopover,
    popoverStyle,
    firstMenuItemRef,
    closeRailPopover,
    showRailPopover,
    getRailHandlers,
  }
}
