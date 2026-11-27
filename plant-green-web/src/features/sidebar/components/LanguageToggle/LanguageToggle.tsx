import { Languages } from 'lucide-react'
import type { MouseEventHandler } from 'react'
import type { ReactNode } from 'react'
import type { RailHandlers } from '../../types'
import './LanguageToggle.css'

interface LanguageToggleProps {
  label: ReactNode
  ariaLabel: string
  collapsed: boolean
  selected: boolean
  handlers: RailHandlers
  onToggle: MouseEventHandler<HTMLButtonElement>
}

export function LanguageToggle({
  label,
  ariaLabel,
  collapsed,
  selected,
  handlers,
  onToggle,
}: LanguageToggleProps) {
  return (
    <button
      type="button"
      className="pg-item pg-language-toggle"
      aria-label={ariaLabel}
      title={collapsed ? ariaLabel : undefined}
      data-rail-selected={selected || undefined}
      onMouseEnter={handlers.onMouseEnter}
      onMouseLeave={handlers.onMouseLeave}
      onFocus={handlers.onFocus}
      onBlur={handlers.onBlur}
      onClick={onToggle}
    >
      <span className="pg-ico"><Languages size={20} strokeWidth={1.9} aria-hidden="true" /></span>
      <span className="pg-label">{label}</span>
    </button>
  )
}
