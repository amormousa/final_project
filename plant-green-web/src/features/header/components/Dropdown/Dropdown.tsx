import { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react'
import type { KeyboardEvent, ReactNode } from 'react'
import { useClickOutside } from '../../hooks/useClickOutside'
import { useDropdownKeyboard } from '../../hooks/useDropdownKeyboard'
import './Dropdown.css'

export type DropdownRole = 'menu' | 'listbox' | 'dialog'

interface DropdownProps {
  triggerLabel: string
  triggerContent: ReactNode
  panelLabel: string
  panelRole: DropdownRole
  triggerClassName?: string
  panelClassName?: string
  disabled?: boolean
  children: (close: () => void) => ReactNode
}

export function Dropdown({
  triggerLabel,
  triggerContent,
  panelLabel,
  panelRole,
  triggerClassName = '',
  panelClassName = '',
  disabled = false,
  children,
}: DropdownProps) {
  const [open, setOpen] = useState(false)
  const [shouldRestoreFocus, setShouldRestoreFocus] = useState(false)
  const id = useId()
  const rootRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const refs = useMemo(() => [rootRef], [])
  const close = useCallback(() => {
    setShouldRestoreFocus(true)
    setOpen(false)
  }, [])
  const dismiss = useCallback(() => setOpen(false), [])
  const toggle = useCallback(() => {
    if (!disabled) {
      setShouldRestoreFocus(false)
      setOpen((current) => !current)
    }
  }, [disabled])
  const onKeyDown = useDropdownKeyboard({
    enabled: open,
    panelRef,
    triggerRef,
    onClose: close,
  })

  useClickOutside({ enabled: open, refs, onOutside: dismiss })

  useEffect(() => {
    if (!open) return
    const firstItem = panelRef.current?.querySelector<HTMLElement>(
      '[role^="menuitem"]:not([aria-disabled="true"]), [role="option"]:not([aria-disabled="true"]), a[href], button:not(:disabled)',
    )
    const initialFocus = firstItem ?? panelRef.current
    initialFocus?.focus()
  }, [open])

  useEffect(() => {
    if (open || !shouldRestoreFocus) return
    triggerRef.current?.focus()
  }, [open, shouldRestoreFocus])

  return (
    <div className="app-dropdown" ref={rootRef}>
      <button
        ref={triggerRef}
        type="button"
        className={`app-dropdown-trigger ${triggerClassName}`.trim()}
        aria-label={triggerLabel}
        aria-expanded={open}
        aria-haspopup={panelRole}
        aria-controls={`${id}-panel`}
        disabled={disabled}
        onClick={toggle}
      >
        {triggerContent}
      </button>
      {open && (
        <div
          ref={panelRef}
          id={`${id}-panel`}
          className={`app-dropdown-panel ${panelClassName}`.trim()}
          role={panelRole}
          aria-label={panelLabel}
          tabIndex={-1}
          onKeyDown={(event: KeyboardEvent<HTMLDivElement>) => onKeyDown(event)}
        >
          {children(close)}
        </div>
      )}
    </div>
  )
}
