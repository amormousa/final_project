import type { FocusEventHandler, MouseEventHandler, ReactNode, Ref } from 'react'
import type { LucideIcon } from 'lucide-react'

export interface NavScreen {
  id: string
  path: string
  label: string
  icon?: LucideIcon
  keywords?: string[]
}

export interface NavItem {
  id: string
  label: string
  icon: LucideIcon
  path?: string
  children?: NavScreen[]
  keywords?: string[]
  forceOpen?: boolean
}

export interface NavSection {
  id: string
  label: string
  items: NavItem[]
}

export interface SearchResult extends NavScreen {
  parentId?: string
  parentLabel?: string
}

export interface NavigationFilterResult {
  sections: NavSection[]
  results: SearchResult[]
}

export interface RailPopover {
  itemId: string
  label: string
  kind: 'tooltip' | 'menu'
  trigger: 'hover' | 'focus' | 'click'
  top: number
  screens?: NavScreen[]
}

export interface RailHandlers {
  onMouseEnter: MouseEventHandler<HTMLButtonElement>
  onMouseLeave: MouseEventHandler<HTMLButtonElement>
  onFocus: FocusEventHandler<HTMLButtonElement>
  onBlur: FocusEventHandler<HTMLButtonElement>
  onClick: MouseEventHandler<HTMLButtonElement>
}

export interface SidebarNavigationContext {
  collapsed: boolean
  activePath: string
  query: string
  highlightedIndex: number | null
  results: SearchResult[]
  railPopover: RailPopover | null
  register: (id: string) => (element: HTMLButtonElement | null) => void
  getRailHandlers: (id: string, label: string, screens?: NavScreen[]) => RailHandlers
  isExpanded: (item: NavItem) => boolean
  toggleGroup: (item: NavItem) => void
  onNavigate: (path: string) => void
  onOpenResult: (path: string) => void
}

export interface SidebarItemProps {
  id: string
  icon?: LucideIcon
  iconSize?: number
  iconStrokeWidth?: number
  label: ReactNode
  labelText: string
  collapsed: boolean
  current?: boolean
  hasActive?: boolean
  expanded?: boolean
  selected?: boolean
  searchSelected?: boolean
  menuButton?: boolean
  buttonRef?: Ref<HTMLButtonElement>
  onClick: MouseEventHandler<HTMLButtonElement>
  onMouseEnter?: MouseEventHandler<HTMLButtonElement>
  onMouseLeave?: MouseEventHandler<HTMLButtonElement>
  onFocus?: FocusEventHandler<HTMLButtonElement>
  onBlur?: FocusEventHandler<HTMLButtonElement>
}
