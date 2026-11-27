import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import type { CSSProperties, FocusEventHandler, MouseEventHandler, ReactNode, Ref } from 'react'
import {
  Activity,
  BrainCircuit,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Droplets,
  GraduationCap,
  Languages,
  LayoutDashboard,
  Moon,
  PackageCheck,
  Repeat,
  RotateCcw,
  Search,
  Settings,
  ShieldCheck,
  Sprout,
  Store,
  Sun,
  UserRound,
  Users,
  Wallet,
  X,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate } from 'react-router-dom'
import ar from '../../i18n/locales/ar'
import en from '../../i18n/locales/en'
import { setLanguage } from '../../i18n'
import type { Language } from '../../i18n'
import './PlantGreenSidebar.css'

interface NavScreen {
  id: string
  path: string
  label: string
  icon?: LucideIcon
}

interface NavItem {
  id: string
  label: string
  icon: LucideIcon
  path?: string
  children?: NavScreen[]
}

interface NavSection {
  id: string
  label: string
  items: NavItem[]
}

const NAV: NavSection[] = [
  {
    id: 'main',
    label: 'sidebar.main',
    items: [
      {
        id: 'overview',
        icon: LayoutDashboard,
        label: 'sidebar.overview',
        children: [
          { id: 'dashboard', path: 'dashboard', label: 'sidebar.dashboard' },
          { id: 'farms', path: 'farms', label: 'sidebar.farms' },
          { id: 'farm-details', path: 'farms/details', label: 'sidebar.farmDetails' },
          { id: 'farm-zones', path: 'farms/zones', label: 'sidebar.farmZones' },
        ],
      },
      {
        id: 'monitoring',
        icon: Activity,
        label: 'sidebar.monitoring',
        children: [
          { id: 'soil', path: 'soil', label: 'sidebar.soil', icon: Droplets },
          { id: 'weather', path: 'weather', label: 'sidebar.weather' },
          { id: 'devices', path: 'devices', label: 'sidebar.devices' },
          { id: 'canopy', path: 'canopy', label: 'sidebar.canopy' },
        ],
      },
    ],
  },
  {
    id: 'intelligence',
    label: 'sidebar.intelligence',
    items: [
      {
        id: 'ai',
        icon: BrainCircuit,
        label: 'sidebar.ai',
        children: [
          { id: 'ai-assistant', path: 'ai', label: 'sidebar.aiAssistant' },
          { id: 'irrigation', path: 'irrigation', label: 'sidebar.irrigation' },
        ],
      },
    ],
  },
  {
    id: 'market',
    label: 'sidebar.marketplace',
    items: [
      {
        id: 'store',
        icon: Store,
        label: 'sidebar.store',
        path: 'marketplace',
      },
      {
        id: 'orders',
        icon: PackageCheck,
        label: 'sidebar.orders',
        path: 'orders',
      },
      {
        id: 'returns',
        icon: RotateCcw,
        label: 'sidebar.returns',
        path: 'returns',
      },
    ],
  },
  {
    id: 'services',
    label: 'sidebar.services',
    items: [
      {
        id: 'financial',
        icon: Wallet,
        label: 'sidebar.financial',
        children: [
          { id: 'subscriptions', path: 'subscriptions', label: 'sidebar.subscriptions', icon: Repeat },
          { id: 'finance', path: 'finance', label: 'sidebar.finance' },
        ],
      },
      {
        id: 'insurance',
        icon: ShieldCheck,
        label: 'sidebar.insurance',
        path: 'account/policies',
      },
      {
        id: 'academy',
        icon: GraduationCap,
        label: 'sidebar.academy',
        path: 'academy',
      },
    ],
  },
  {
    id: 'account',
    label: 'sidebar.account',
    items: [
      {
        id: 'profile',
        icon: UserRound,
        label: 'sidebar.profile',
        path: 'account',
      },
      {
        id: 'team',
        icon: Users,
        label: 'sidebar.team',
        path: 'account/team',
      },
      {
        id: 'settings',
        icon: Settings,
        label: 'sidebar.settings',
        path: 'settings',
      },
    ],
  },
]

interface NavButtonProps {
  id: string
  icon: LucideIcon
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

function NavButton({
  id,
  icon: Icon,
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
}: NavButtonProps) {
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
      <span className="pg-ico">
        <Icon size={20} strokeWidth={1.9} aria-hidden="true" />
      </span>
      <span className="pg-label">{label}</span>
      {expanded !== undefined && <ChevronDown className="pg-chev" size={16} aria-hidden="true" />}
    </button>
  )
}

interface RailPopover {
  itemId: string
  label: string
  kind: 'tooltip' | 'menu'
  trigger: 'hover' | 'focus' | 'click'
  top: number
  screens?: NavScreen[]
}

const SQUISH = [
  { transform: 'scale(1,1)' },
  { transform: 'scale(1.025,1.32)', offset: 0.35 },
  { transform: 'scale(1,1)' },
]

const bilingualLabel = (labelKey: string) => {
  const key = labelKey.replace(/^sidebar\./, '') as keyof typeof en.sidebar
  return `${en.sidebar[key]} ${ar.sidebar[key]}`.toLocaleLowerCase()
}

function highlightMatch(label: string, query: string): ReactNode {
  if (!query) return label
  const parts = label.split(new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'giu'))
  const normalizedQuery = query.toLocaleLowerCase()

  return parts.map((part, index) => (
    part.toLocaleLowerCase() === normalizedQuery
      ? <mark key={`${part}-${index}`}>{part}</mark>
      : part
  ))
}

export function PlantGreenSidebar({ dark, onDarkChange }: { dark: boolean; onDarkChange: (dark: boolean) => void }) {
  const { t, i18n } = useTranslation()
  const location = useLocation()
  const navigate = useNavigate()
  const [collapsed, setCollapsed] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(max-width: 640px)').matches,
  )
  const [open, setOpen] = useState<Record<string, boolean>>({})
  const [searchText, setSearchText] = useState('')
  const [highlightedIndex, setHighlightedIndex] = useState<number | null>(null)
  const [railPopover, setRailPopover] = useState<RailPopover | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const asideRef = useRef<HTMLElement>(null)
  const navInRef = useRef<HTMLDivElement>(null)
  const lensRef = useRef<HTMLDivElement>(null)
  const refs = useRef<Record<string, HTMLButtonElement>>({})
  const railPopoverRef = useRef<RailPopover | null>(null)
  const railTimerRef = useRef<number | null>(null)
  const firstMenuItemRef = useRef<HTMLButtonElement>(null)
  const lastLensTarget = useRef<HTMLButtonElement | null>(null)
  const moveAt = useRef(0)
  const rtl = i18n.resolvedLanguage?.startsWith('ar') ?? i18n.language.startsWith('ar')
  const activePath = location.pathname.replace(/^\/app\/?/, '').replace(/\/$/, '')
  const query = searchText.trim()
  const shortcutLabel = typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.platform)
    ? '⌘ K'
    : 'Ctrl K'
  const searchDisplayLabel = (labelKey: string) => {
    const currentLabel = t(labelKey)
    if (!query || currentLabel.toLocaleLowerCase().includes(query.toLocaleLowerCase())) return currentLabel
    const key = labelKey.replace(/^sidebar\./, '') as keyof typeof en.sidebar
    if (en.sidebar[key].toLocaleLowerCase().includes(query.toLocaleLowerCase())) return en.sidebar[key]
    return ar.sidebar[key]
  }

  const clearRailTimer = () => {
    if (railTimerRef.current !== null) {
      window.clearTimeout(railTimerRef.current)
      railTimerRef.current = null
    }
  }

  const closeRailPopover = () => {
    clearRailTimer()
    railPopoverRef.current = null
    setRailPopover(null)
  }

  const showRailPopover = (
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
      itemId,
      label,
      kind,
      trigger,
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
  }

  const focusSearch = () => {
    closeRailPopover()
    setCollapsed(false)
    window.setTimeout(() => inputRef.current?.focus(), 0)
  }

  useEffect(() => {
    const handleShortcut = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        focusSearch()
      }
    }

    window.addEventListener('keydown', handleShortcut)
    return () => window.removeEventListener('keydown', handleShortcut)
  }, [])

  useEffect(() => {
    const handleOutsidePointer = (event: PointerEvent) => {
      const target = event.target as Element
      if (
        !asideRef.current?.contains(target)
        || (!target.closest('.pg-rail-popover') && !target.closest('[data-nav-id]'))
      ) {
        closeRailPopover()
      }
    }
    const handleResize = () => closeRailPopover()
    document.addEventListener('pointerdown', handleOutsidePointer)
    window.addEventListener('resize', handleResize)
    return () => {
      document.removeEventListener('pointerdown', handleOutsidePointer)
      window.removeEventListener('resize', handleResize)
      clearRailTimer()
    }
  }, [])

  const searchTerm = query.toLocaleLowerCase()
  const matches = (label: string) => bilingualLabel(label).includes(searchTerm)
  const sections = !query ? NAV : NAV.map((section) => ({
      ...section,
      items: section.items.map((item) => {
        if (item.children) {
          const itemMatches = matches(item.label)
          const children = itemMatches
            ? item.children
            : item.children.filter((screen) => matches(screen.label))
          return children.length ? { ...item, children, forceOpen: true } : null
        }
        if (matches(item.label) && item.path) {
          return item
        }
        return null
      }).filter((item): item is NavItem & { forceOpen?: boolean } => item !== null),
    })).filter((section) => section.items.length > 0)

  const results = !query ? [] : NAV.flatMap((section) => section.items.flatMap((item) => {
      if (item.children) {
        return matches(item.label)
          ? item.children
          : item.children.filter((screen) => matches(screen.label))
      }
      return matches(item.label) && item.path
        ? [{ id: item.id, path: item.path, label: item.label, icon: item.icon }]
        : []
    }))

  useLayoutEffect(() => {
    const findTarget = () => {
      const screen = NAV.flatMap((section) => section.items).flatMap((item) =>
        item.children ?? (item.path ? [{ id: item.id, path: item.path, label: item.label }] : []),
      ).find((entry) => entry.path === activePath)
      if (!screen) return null
      const direct = refs.current[screen.id]
      const group = NAV.flatMap((section) => section.items)
        .find((item) => item.children?.some((child) => child.path === activePath))
      if (collapsed || (direct && direct.closest('.pg-sub-wrap[data-open="false"]'))) {
        return group ? refs.current[group.id] ?? null : direct ?? null
      }
      return direct ?? (group ? refs.current[group.id] ?? null : null)
    }

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const nav = navInRef.current
    const place = () => {
      const lens = lensRef.current
      const host = navInRef.current
      if (!lens || !host) return
      const target = findTarget()
      if (!target) {
        lens.style.opacity = '0'
        lastLensTarget.current = null
        return
      }
      const hostRect = host.getBoundingClientRect()
      const targetRect = target.getBoundingClientRect()
      const changed = lastLensTarget.current !== target
      const first = lastLensTarget.current === null
      const now = performance.now()
      if (changed) {
        moveAt.current = now
        if (!first && !reduceMotion) lens.animate(SQUISH, { duration: 480, easing: 'ease-out' })
      }
      const sliding = !first && (changed || now - moveAt.current < 520)
      lens.dataset.follow = sliding ? 'false' : 'true'
      lens.style.opacity = '1'
      lens.style.width = `${targetRect.width}px`
      lens.style.height = `${targetRect.height}px`
      lens.style.left = `${targetRect.left - hostRect.left}px`
      lens.style.top = `${targetRect.top - hostRect.top}px`
      lens.style.borderRadius = collapsed ? '999px' : '14px'
      lastLensTarget.current = target
    }
    let animationFrame = 0
    const started = performance.now()
    const tick = () => {
      place()
      if (performance.now() - started < 700) animationFrame = requestAnimationFrame(tick)
    }
    tick()
    window.addEventListener('resize', place)
    nav?.addEventListener('scroll', place)
    return () => {
      cancelAnimationFrame(animationFrame)
      window.removeEventListener('resize', place)
      nav?.removeEventListener('scroll', place)
    }
  }, [activePath, collapsed, open, query, rtl, dark])

  const register = (id: string) => (element: HTMLButtonElement | null) => {
    if (element) refs.current[id] = element
    else delete refs.current[id]
  }
  const go = (path: string) => navigate(`/app/${path}`)
  const toggleLanguage = () => {
    const nextLanguage: Language = rtl ? 'en' : 'ar'
    setLanguage(nextLanguage)
  }
  const getRailHandlers = (id: string, label: string, screens?: NavScreen[]) => ({
    onMouseEnter: (event: React.MouseEvent<HTMLButtonElement>) => {
      const current = railPopoverRef.current
      const menuForThisItem = current?.itemId === id && current.kind === 'menu' && current.trigger === 'click'
      if (collapsed && !menuForThisItem) showRailPopover(id, label, event.currentTarget, 'hover')
    },
    onMouseLeave: () => {
      if (railPopoverRef.current?.trigger === 'hover') closeRailPopover()
    },
    onFocus: (event: React.FocusEvent<HTMLButtonElement>) => {
      if (collapsed) showRailPopover(id, label, event.currentTarget, 'focus')
    },
    onBlur: () => {
      if (railPopoverRef.current?.trigger === 'focus') closeRailPopover()
    },
    onClick: (event: React.MouseEvent<HTMLButtonElement>) => {
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
  })

  const BackIcon = rtl ? ChevronRight : ChevronLeft
  const menuPopoverStyle: CSSProperties = {
    top: railPopover?.top ?? 0,
    insetInlineEnd: 'calc(100% + 10px)',
  }

  return (
    <aside
      ref={asideRef}
      className="pg-side"
      dir={rtl ? 'rtl' : 'ltr'}
      data-collapsed={collapsed}
      data-dark={dark}
    >
      <div className="pg-glass" aria-hidden="true" />
      <button
        type="button"
        className="pg-toggle"
        aria-expanded={!collapsed}
        aria-label={collapsed ? t('sidebar.expand') : t('sidebar.collapse')}
        onClick={() => {
          closeRailPopover()
          setCollapsed((value) => !value)
        }}
      >
        <BackIcon size={16} aria-hidden="true" />
      </button>

      <div className="pg-inner">
        <div className="pg-head">
          <span className="pg-logo">
            <Sprout size={20} strokeWidth={2} aria-hidden="true" />
          </span>
          <span className="pg-label">
            <span className="pg-title">{t('sidebar.brand')}</span>
            <span className="pg-sub-title">{t('sidebar.tagline')}</span>
          </span>
        </div>

        {collapsed ? (
          <NavButton
            id="search"
            icon={Search}
            label={t('sidebar.search')}
            labelText={t('sidebar.search')}
            collapsed
            {...getRailHandlers('search', t('sidebar.search'))}
            onClick={focusSearch}
          />
        ) : (
          <div className="pg-search">
            <Search size={18} aria-hidden="true" />
            <input
              ref={inputRef}
              value={searchText}
              placeholder={t('sidebar.search')}
              aria-label={t('sidebar.search')}
              onChange={(event) => {
                setSearchText(event.target.value)
                setHighlightedIndex(null)
              }}
              onKeyDown={(event) => {
                if (event.key === 'Escape') {
                  event.preventDefault()
                  if (searchText) {
                    setSearchText('')
                    setHighlightedIndex(null)
                  } else {
                    inputRef.current?.blur()
                  }
                  return
                }
                if ((event.key === 'ArrowDown' || event.key === 'ArrowUp') && results.length > 0) {
                  event.preventDefault()
                  const direction = event.key === 'ArrowDown' ? 1 : -1
                  setHighlightedIndex((current) => {
                    if (current === null) return direction > 0 ? 0 : results.length - 1
                    return (current + direction + results.length) % results.length
                  })
                  return
                }
                if (event.key === 'Enter' && results.length > 0) {
                  event.preventDefault()
                  go(results[highlightedIndex ?? 0].path)
                }
              }}
            />
            {searchText ? (
              <button
                type="button"
                className="pg-search-clear"
                aria-label={t('sidebar.clearSearch')}
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => {
                  setSearchText('')
                  setHighlightedIndex(null)
                  inputRef.current?.focus()
                }}
              >
                <X size={16} aria-hidden="true" />
              </button>
            ) : (
              <span className="pg-kbd">{shortcutLabel}</span>
            )}
          </div>
        )}

        {!collapsed && <span className="pg-sr-only" aria-live="polite">
          {query ? t('sidebar.searchResults', { count: results.length }) : ''}
        </span>}

        <nav className="pg-nav" aria-label={t('sidebar.navLabel')}>
          <div className="pg-nav-in" ref={navInRef}>
            <div className="pg-lens" ref={lensRef} aria-hidden="true" />
            {sections.length === 0 && !collapsed ? (
              <div className="pg-empty">
                <p>{t('sidebar.empty')}</p>
                <button
                  type="button"
                  className="pg-clear-search"
                  onClick={() => {
                    setSearchText('')
                    setHighlightedIndex(null)
                    inputRef.current?.focus()
                  }}
                >
                  {t('sidebar.clearSearch')}
                </button>
              </div>
            ) : sections.map((section) => (
              <div key={section.id} role="group" aria-label={t(section.label)}>
                <div className="pg-sec-title" aria-hidden="true">
                  {highlightMatch(searchDisplayLabel(section.label), query)}
                </div>
                {section.items.map((item) => {
                  const children = item.children
                  const hasActive = children?.some((child) => activePath === child.path) ?? false
                  const expandedByState = item.id in open ? open[item.id] : hasActive || item.id === 'overview'
                  const forceOpen = 'forceOpen' in item && item.forceOpen
                  const expanded = !!children && !collapsed && (!!forceOpen || expandedByState)
                  const itemHandlers = getRailHandlers(item.id, t(item.label), children)
                  const itemSelected = railPopover?.itemId === item.id && collapsed
                  const itemMenuOpen = itemSelected && railPopover?.kind === 'menu'
                  const itemResultIndex = item.path
                    ? results.findIndex((result) => result.path === item.path)
                    : -1

                  return (
                    <div key={item.id}>
                      <NavButton
                        id={item.id}
                        buttonRef={register(item.id)}
                        icon={item.icon}
                        label={highlightMatch(searchDisplayLabel(item.label), query)}
                        labelText={t(item.label)}
                        collapsed={collapsed}
                        current={!children && activePath === item.path}
                        hasActive={hasActive}
                        expanded={children ? (collapsed ? itemMenuOpen : expanded) : undefined}
                        selected={itemSelected}
                        searchSelected={highlightedIndex === itemResultIndex}
                        menuButton={!!children && collapsed}
                        onMouseEnter={itemHandlers.onMouseEnter}
                        onMouseLeave={itemHandlers.onMouseLeave}
                        onFocus={itemHandlers.onFocus}
                        onBlur={itemHandlers.onBlur}
                        onClick={(event) => {
                          if (children) {
                            if (collapsed) {
                              itemHandlers.onClick(event)
                              return
                            }
                            setOpen((state) => ({ ...state, [item.id]: !expanded }))
                            return
                          }
                          if (item.path) go(item.path)
                          if (collapsed) itemHandlers.onClick(event)
                        }}
                      />
                      {children && (
                        <div className="pg-sub-wrap" data-open={expanded}>
                          <div className="pg-sub-in">
                            <div className="pg-sub">
                              {children.map((screen) => {
                                const resultIndex = results.findIndex((result) => result.path === screen.path)
                                const ScreenIcon = screen.icon
                                return (
                                  <button
                                    key={screen.id}
                                    ref={register(screen.id)}
                                    type="button"
                                    className="pg-item"
                                    aria-current={activePath === screen.path ? 'page' : undefined}
                                    data-search-selected={highlightedIndex === resultIndex || undefined}
                                    onClick={() => go(screen.path)}
                                  >
                                    {ScreenIcon && <span className="pg-ico"><ScreenIcon size={18} aria-hidden="true" /></span>}
                                    <span className="pg-label">{highlightMatch(searchDisplayLabel(screen.label), query)}</span>
                                  </button>
                                )
                              })}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            ))}
          </div>
        </nav>

        <div className="pg-foot">
          {(() => {
            const label = t('sidebar.night')
            const handlers = getRailHandlers('night', label)
            const NightIcon = dark ? Sun : Moon
            return (
              <button
                type="button"
                className="pg-item"
                role="switch"
                aria-checked={dark}
                aria-label={label}
                title={collapsed ? label : undefined}
                data-rail-selected={railPopover?.itemId === 'night' && collapsed || undefined}
                onMouseEnter={handlers.onMouseEnter}
                onMouseLeave={handlers.onMouseLeave}
                onFocus={handlers.onFocus}
                onBlur={handlers.onBlur}
                onClick={(event) => {
                  onDarkChange(!dark)
                  if (collapsed) handlers.onClick(event)
                }}
              >
                <span className="pg-ico"><NightIcon size={20} strokeWidth={1.9} aria-hidden="true" /></span>
                <span className="pg-label">{label}</span>
                <span className="pg-switch" data-on={dark}><i /></span>
              </button>
            )
          })()}
          {(() => {
            const label = t(rtl ? 'sidebar.english' : 'sidebar.arabic')
            const handlers = getRailHandlers('language', label)
            return (
              <button
                type="button"
                className="pg-item"
                aria-label={label}
                title={collapsed ? label : undefined}
                data-rail-selected={railPopover?.itemId === 'language' && collapsed || undefined}
                onMouseEnter={handlers.onMouseEnter}
                onMouseLeave={handlers.onMouseLeave}
                onFocus={handlers.onFocus}
                onBlur={handlers.onBlur}
                onClick={(event) => {
                  toggleLanguage()
                  if (collapsed) handlers.onClick(event)
                }}
              >
                <span className="pg-ico"><Languages size={20} strokeWidth={1.9} aria-hidden="true" /></span>
                <span className="pg-label">{label}</span>
              </button>
            )
          })()}
        </div>
      </div>

      <div
        className="pg-rail-popover"
        data-visible={!!railPopover}
        data-kind={railPopover?.kind}
        style={menuPopoverStyle}
        dir={rtl ? 'rtl' : 'ltr'}
      >
        {railPopover && (
          railPopover.kind === 'menu' ? (
            <>
              <div className="pg-rail-popover-title">{railPopover.label}</div>
              <div className="pg-rail-popover-list" role="menu" aria-label={railPopover.label}>
                {railPopover.screens?.map((screen, index) => (
                  <button
                    key={screen.id}
                    ref={index === 0 ? firstMenuItemRef : undefined}
                    type="button"
                    role="menuitem"
                    className="pg-rail-popover-screen"
                    onClick={() => {
                      go(screen.path)
                      closeRailPopover()
                    }}
                  >
                    {screen.icon && <screen.icon size={17} aria-hidden="true" />}
                    <span>{t(screen.label)}</span>
                  </button>
                ))}
              </div>
            </>
          ) : (
            <span className="pg-rail-popover-title">{railPopover.label}</span>
          )
        )}
      </div>
    </aside>
  )
}
