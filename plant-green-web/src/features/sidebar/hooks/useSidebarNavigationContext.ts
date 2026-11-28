import { useCallback, useMemo } from 'react'
import type { NavItem, RailHandlers, RailPopover, SearchResult, SidebarNavigationContext } from '../types'

interface SidebarNavigationOptions {
  collapsed: boolean
  activePath: string
  query: string
  highlightedIndex: number | null
  results: SearchResult[]
  railPopover: RailPopover | null
  register: SidebarNavigationContext['register']
  getRailHandlers: (id: string, label: string, screens?: NavItem['children']) => RailHandlers
  isGroupExpanded: (id: string, hasActive: boolean, forceOpen?: boolean) => boolean
  toggleGroupState: (id: string, expanded: boolean) => void
  onNavigate: (path: string) => void
  onOpenResult: (path: string) => void
}

export function useSidebarNavigationContext(options: SidebarNavigationOptions): SidebarNavigationContext {
  const { activePath, collapsed, isGroupExpanded, toggleGroupState } = options
  const isExpanded = useCallback((item: NavItem) => {
    const hasActive = item.children?.some((child) => activePath === child.path || activePath.startsWith(`${child.path}/`)) ?? false
    return !!item.children?.length && !collapsed
      && isGroupExpanded(item.id, hasActive, item.forceOpen)
  }, [activePath, collapsed, isGroupExpanded])
  const toggleGroup = useCallback((item: NavItem) => {
    toggleGroupState(item.id, isExpanded(item))
  }, [isExpanded, toggleGroupState])

  return useMemo(() => ({
    collapsed: options.collapsed,
    activePath: options.activePath,
    query: options.query,
    highlightedIndex: options.highlightedIndex,
    results: options.results,
    railPopover: options.railPopover,
    register: options.register,
    getRailHandlers: options.getRailHandlers,
    isExpanded,
    toggleGroup,
    onNavigate: options.onNavigate,
    onOpenResult: options.onOpenResult,
  }), [
    isExpanded, options.activePath, options.collapsed, options.getRailHandlers,
    options.highlightedIndex, options.onNavigate, options.onOpenResult,
    options.query, options.railPopover, options.register, options.results, toggleGroup,
  ])
}
