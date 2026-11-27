import { useCallback, useRef } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { setLanguage } from '../../../i18n'
import type { Language } from '../../../i18n'
import { useActiveRoute } from './useActiveRoute'
import { useRailPopover } from './useRailPopover'
import { useSidebarCollapse } from './useSidebarCollapse'
import { useSidebarGroups } from './useSidebarGroups'
import { useSidebarNavigationContext } from './useSidebarNavigationContext'
import { useSidebarResponsive } from './useSidebarResponsive'
import { useSidebarSearch } from './useSidebarSearch'
import { useSidebarScroll } from './useSidebarScroll'
import { useSidebarShortcuts } from './useSidebarShortcuts'

interface SidebarControllerOptions {
  dark: boolean
  onDarkChange: (dark: boolean) => void
}

export function useSidebarController({ dark, onDarkChange }: SidebarControllerOptions) {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const rtl = i18n.resolvedLanguage?.startsWith('ar') ?? i18n.language.startsWith('ar')
  const asideRef = useRef<HTMLElement>(null)
  const collapse = useSidebarCollapse()
  const search = useSidebarSearch()
  const groups = useSidebarGroups()
  const rail = useRailPopover({ collapsed: collapse.collapsed, asideRef })
  const { setCollapsedForViewport, setCollapsedWithTransition } = collapse
  const { closeRailPopover } = rail
  const { open, isExpanded: isGroupExpanded, toggle: toggleGroupState } = groups
  const { inputRef, setSearchText, setHighlightedIndex } = search
  const handleViewportChange = useCallback((mobile: boolean) => {
    setCollapsedForViewport(mobile)
    closeRailPopover()
  }, [closeRailPopover, setCollapsedForViewport])
  const { isMobile } = useSidebarResponsive(handleViewportChange)
  const scroll = useSidebarScroll()
  const active = useActiveRoute({
    collapsed: collapse.collapsed,
    open,
    query: search.query,
    rtl,
    dark,
  })
  const go = useCallback((path: string) => navigate(`/app/${path}`), [navigate])
  const focusSearch = useCallback(() => {
    closeRailPopover()
    setCollapsedWithTransition(false)
    window.setTimeout(() => inputRef.current?.focus(), 0)
  }, [closeRailPopover, inputRef, setCollapsedWithTransition])
  const collapseForEscape = useCallback(() => setCollapsedWithTransition(true), [setCollapsedWithTransition])
  useSidebarShortcuts({
    isMobile,
    collapsed: collapse.collapsed,
    focusSearch,
    closePopover: rail.closeRailPopover,
    collapseSidebar: collapseForEscape,
  })
  const openResult = useCallback((path: string) => {
    go(path)
    setSearchText('')
    setHighlightedIndex(null)
  }, [go, setHighlightedIndex, setSearchText])
  const navigationContext = useSidebarNavigationContext({
    collapsed: collapse.collapsed,
    activePath: active.activePath,
    query: search.query,
    highlightedIndex: search.highlightedIndex,
    results: search.results,
    railPopover: rail.railPopover,
    register: active.register,
    getRailHandlers: rail.getRailHandlers,
    isGroupExpanded,
    toggleGroupState,
    onNavigate: go,
    onOpenResult: openResult,
  })
  const toggleLanguage = useCallback(() => {
    const nextLanguage: Language = rtl ? 'en' : 'ar'
    setLanguage(nextLanguage)
  }, [rtl])
  const BackIcon = rtl ? ChevronRight : ChevronLeft
  return {
    asideRef,
    rtl,
    isMobile,
    collapsed: collapse.collapsed,
    transitioning: collapse.isTransitioning,
    showBackdrop: isMobile && !collapse.collapsed,
    onBackdropClick: () => collapse.setCollapsedWithTransition(true),
    BackIcon,
    collapseLabel: t(collapse.collapsed ? 'sidebar.expand' : 'sidebar.collapse'),
    onToggleCollapse: () => {
      rail.closeRailPopover()
      collapse.setCollapsedWithTransition(!collapse.collapsed)
    },
    searchProps: {
      collapsed: collapse.collapsed,
      searchText: search.searchText,
      query: search.query,
      highlightedIndex: search.highlightedIndex,
      results: search.results,
      inputRef: search.inputRef,
      setSearchText: search.setSearchText,
      setHighlightedIndex: search.setHighlightedIndex,
      getRailHandlers: rail.getRailHandlers,
      onFocusSearch: focusSearch,
      onOpenResult: openResult,
    },
    navProps: {
      sections: search.sections,
      collapsed: collapse.collapsed,
      context: navigationContext,
      scrollVisible: scroll.scrollVisible,
      navRef: search.navRef,
      navInRef: active.navInRef,
      lensRef: active.lensRef,
      onScrollActivity: scroll.revealScrollbar,
      onClearSearch: () => {
        search.setSearchText('')
        search.setHighlightedIndex(null)
        search.inputRef.current?.focus()
      },
    },
    footerProps: {
      query: search.query,
      collapsed: collapse.collapsed,
      dark,
      rtl,
      railPopover: rail.railPopover,
      getRailHandlers: rail.getRailHandlers,
      onDarkChange,
      onLanguageToggle: toggleLanguage,
    },
    popoverProps: {
      popover: rail.railPopover,
      dir: rtl ? 'rtl' as const : 'ltr' as const,
      style: rail.popoverStyle,
      firstMenuItemRef: rail.firstMenuItemRef,
      onNavigate: (path: string) => {
        go(path)
        rail.closeRailPopover()
      },
    },
  }
}
