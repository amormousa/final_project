import type { LucideIcon } from 'lucide-react'
import './CollapseButton.css'

interface CollapseButtonProps {
  icon: LucideIcon
  collapsed: boolean
  label: string
  onClick: () => void
}

export function CollapseButton({ icon: Icon, collapsed, label, onClick }: CollapseButtonProps) {
  return (
    <button
      type="button"
      className="pg-toggle"
      aria-expanded={!collapsed}
      aria-controls="plant-green-sidebar-nav"
      aria-label={label}
      onClick={onClick}
    >
      <Icon size={16} aria-hidden="true" />
    </button>
  )
}
