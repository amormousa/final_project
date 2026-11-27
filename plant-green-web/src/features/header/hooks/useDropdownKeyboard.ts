import { useCallback } from 'react'
import type { KeyboardEvent, RefObject } from 'react'

interface DropdownKeyboardOptions {
  enabled: boolean
  panelRef: RefObject<HTMLElement | null>
  triggerRef: RefObject<HTMLButtonElement | null>
  onClose: () => void
}

export function useDropdownKeyboard({
  enabled,
  panelRef,
  triggerRef,
  onClose,
}: DropdownKeyboardOptions) {
  return useCallback((event: KeyboardEvent<HTMLElement>) => {
    if (!enabled) return
    if (event.key === 'Escape') {
      event.preventDefault()
      onClose()
      triggerRef.current?.focus()
      return
    }
    if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return

    const items = Array.from(
      panelRef.current?.querySelectorAll<HTMLElement>(
        '[role^="menuitem"]:not([aria-disabled="true"]), [role="option"]:not([aria-disabled="true"]), a[href], button:not(:disabled)',
      ) ?? [],
    )
    if (items.length === 0) return
    event.preventDefault()
    const activeElement = event.currentTarget.ownerDocument.activeElement
    const currentIndex = items.findIndex((item) => item === activeElement)
    const direction = event.key === 'ArrowDown' ? 1 : -1
    const nextIndex = currentIndex < 0
      ? (direction === 1 ? 0 : items.length - 1)
      : (currentIndex + direction + items.length) % items.length
    items[nextIndex]?.focus()
  }, [enabled, onClose, panelRef, triggerRef])
}
