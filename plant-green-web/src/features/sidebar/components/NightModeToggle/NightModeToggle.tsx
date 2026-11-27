import { Moon, Sun } from 'lucide-react'
import type { MouseEventHandler } from 'react'
import type { ReactNode } from 'react'
import type { RailHandlers } from '../../types'
import './NightModeToggle.css'

interface NightModeToggleProps {
  label: ReactNode
  ariaLabel: string
  collapsed: boolean
  dark: boolean
  selected: boolean
  handlers: RailHandlers
  onChange: MouseEventHandler<HTMLButtonElement>
}

export function NightModeToggle({
  label,
  ariaLabel,
  collapsed,
  dark,
  selected,
  handlers,
  onChange,
}: NightModeToggleProps) {
  const Icon = dark ? Sun : Moon

  return (
    <button
      type="button"
      className="pg-item"
      role="switch"
      aria-checked={dark}
      aria-label={ariaLabel}
      title={collapsed ? ariaLabel : undefined}
      data-rail-selected={selected || undefined}
      onMouseEnter={handlers.onMouseEnter}
      onMouseLeave={handlers.onMouseLeave}
      onFocus={handlers.onFocus}
      onBlur={handlers.onBlur}
      onClick={onChange}
    >
      <span className="pg-ico"><Icon size={20} strokeWidth={1.9} aria-hidden="true" /></span>
      <span className="pg-label">{label}</span>
      <span className="pg-switch" data-on={dark}><i /></span>
    </button>
  )
}
