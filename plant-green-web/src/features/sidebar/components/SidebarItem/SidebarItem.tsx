import { ChevronDown } from 'lucide-react'
import type { SidebarItemProps } from '../../types'
import './SidebarItem.css'

export function SidebarItem({
  id,
  icon: Icon,
  iconSize = 20,
  iconStrokeWidth = 1.9,
  label,
  labelText,
  collapsed,
  current,
  hasActive,
  expanded,
  selected,
  searchSelected,
  menuButton,
  buttonRef,
  onClick,
  onMouseEnter,
  onMouseLeave,
  onFocus,
  onBlur,
}: SidebarItemProps) {
  return (
    <button
      ref={buttonRef}
      type="button"
      className="pg-item"
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onFocus={onFocus}
      onBlur={onBlur}
      title={collapsed ? labelText : undefined}
      aria-label={collapsed ? labelText : undefined}
      aria-current={current ? 'page' : undefined}
      aria-expanded={expanded}
      aria-haspopup={menuButton ? 'menu' : undefined}
      data-has-active={hasActive || undefined}
      data-rail-selected={selected || undefined}
      data-search-selected={searchSelected || undefined}
      data-nav-id={id}
    >
      {Icon && <span className="pg-ico"><Icon size={iconSize} strokeWidth={iconStrokeWidth} aria-hidden="true" /></span>}
      <span className="pg-label">{label}</span>
      {expanded !== undefined && <ChevronDown className="pg-chev" size={16} aria-hidden="true" />}
    </button>
  )
}
