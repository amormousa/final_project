import { useEffect, useMemo, useRef, useState } from 'react'
import {
  BookOpen,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Contact,
  CreditCard,
  Droplets,
  Languages,
  LayoutGrid,
  Moon,
  Search,
  Settings,
  ShieldCheck,
  ShoppingBag,
  Sprout,
  Users,
  Sparkles,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate } from 'react-router-dom'
import { setLanguage } from '../../i18n'
import type { Language } from '../../i18n'
import './PlantGreenSidebar.css'

interface NavScreen {
  id: string
  path: string
  label: string
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
        icon: LayoutGrid,
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
        icon: Droplets,
        label: 'sidebar.monitoring',
        children: [
          { id: 'soil', path: 'soil', label: 'sidebar.soil' },
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
        icon: Sparkles,
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
        icon: ShoppingBag,
        label: 'sidebar.store',
        children: [
          { id: 'marketplace', path: 'marketplace', label: 'sidebar.store' },
          { id: 'orders', path: 'orders', label: 'sidebar.orders' },
        ],
      },
    ],
  },
  {
    id: 'services',
    label: 'sidebar.services',
    items: [
      {
        id: 'financial',
        icon: CreditCard,
        label: 'sidebar.financial',
        children: [
          { id: 'finance', path: 'finance', label: 'sidebar.finance' },
          { id: 'insurance', path: 'services', label: 'sidebar.insurance' },
        ],
      },
      {
        id: 'academy',
        icon: BookOpen,
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
        icon: Contact,
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
        id: 'policies',
        icon: ShieldCheck,
        label: 'sidebar.policies',
        path: 'account/policies',
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
  icon?: LucideIcon
  label: string
  collapsed: boolean
  current?: boolean
  hasActive?: boolean
  expanded?: boolean
  onClick: () => void
}

function NavButton({
  icon: Icon,
  label,
  collapsed,
  current,
  hasActive,
  expanded,
  onClick,
}: NavButtonProps) {
  return (
    <button
      type="button"
      className="pg-item"
      onClick={onClick}
      title={collapsed ? label : undefined}
      aria-label={collapsed ? label : undefined}
      aria-current={current ? 'page' : undefined}
      aria-expanded={expanded}
      data-has-active={hasActive || undefined}
    >
      {Icon && (
        <span className="pg-ico">
          <Icon size={20} strokeWidth={1.9} aria-hidden="true" />
        </span>
      )}
      <span className="pg-label">{label}</span>
      {expanded !== undefined && <ChevronDown className="pg-chev" size={16} aria-hidden="true" />}
    </button>
  )
}

interface PlantGreenSidebarProps {
  dark: boolean
  onDarkChange: (dark: boolean) => void
}

export function PlantGreenSidebar({ dark, onDarkChange }: PlantGreenSidebarProps) {
  const { t, i18n } = useTranslation()
  const location = useLocation()
  const navigate = useNavigate()
  const [collapsed, setCollapsed] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(max-width: 640px)').matches,
  )
  const [open, setOpen] = useState<Record<string, boolean>>({})
  const [query, setQuery] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const rtl = i18n.resolvedLanguage?.startsWith('ar') ?? i18n.language.startsWith('ar')
  const activePath = location.pathname.replace(/^\/app\/?/, '')

  const focusSearch = () => {
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

  const sections = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase()
    if (!normalizedQuery) return NAV

    const matches = (label: string) => t(label).toLocaleLowerCase().includes(normalizedQuery)

    return NAV.map((section) => ({
      ...section,
      items: section.items
        .map((item) => {
          if (matches(item.label)) return item
          const children = item.children?.filter((child) => matches(child.label)) ?? []
          return children.length > 0 ? { ...item, children, forceOpen: true } : null
        })
        .filter((item): item is NavItem & { forceOpen?: boolean } => item !== null),
    })).filter((section) => section.items.length > 0)
  }, [query, t])

  const go = (path: string) => navigate(`/app/${path}`)
  const toggleLanguage = () => {
    const nextLanguage: Language = rtl ? 'en' : 'ar'
    setLanguage(nextLanguage)
  }
  const backIcon = rtl ? ChevronRight : ChevronLeft
  const BackIcon = backIcon

  return (
    <aside className="pg-side" dir={rtl ? 'rtl' : 'ltr'} data-collapsed={collapsed} data-dark={dark}>
      <div className="pg-glass" aria-hidden="true" />
      <button
        type="button"
        className="pg-toggle"
        aria-expanded={!collapsed}
        aria-label={collapsed ? t('sidebar.expand') : t('sidebar.collapse')}
        onClick={() => setCollapsed((value) => !value)}
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
            icon={Search}
            label={t('sidebar.search')}
            collapsed={collapsed}
            onClick={focusSearch}
          />
        ) : (
          <div className="pg-search">
            <Search size={18} aria-hidden="true" />
            <input
              ref={inputRef}
              value={query}
              placeholder={t('sidebar.search')}
              aria-label={t('sidebar.search')}
              onChange={(event) => setQuery(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Escape') setQuery('')
              }}
            />
            <span className="pg-kbd">Ctrl K</span>
          </div>
        )}

        <nav className="pg-nav" aria-label={t('sidebar.navLabel')}>
          <div className="pg-nav-in">
            {sections.length === 0 && !collapsed && <p className="pg-empty">{t('sidebar.empty')}</p>}
            {sections.map((section) => (
              <div key={section.id} role="group" aria-label={t(section.label)}>
                <div className="pg-sec-title" aria-hidden="true">{t(section.label)}</div>
                {section.items.map((item) => {
                  const children = item.children
                  const hasActive = children?.some((child) => activePath === child.path) ?? false
                  const isOpen = item.id in open
                    ? open[item.id]
                    : hasActive || item.id === 'overview'
                  const forceOpen = 'forceOpen' in item && item.forceOpen
                  const expanded = !!children && !collapsed && (!!forceOpen || isOpen)

                  return (
                    <div key={item.id}>
                      <NavButton
                        icon={item.icon}
                        label={t(item.label)}
                        collapsed={collapsed}
                        current={!children && activePath === item.path}
                        hasActive={hasActive}
                        expanded={children ? expanded : undefined}
                        onClick={() => {
                          if (!children) {
                            if (item.path) go(item.path)
                            return
                          }
                          if (collapsed) {
                            setCollapsed(false)
                            setOpen((state) => ({ ...state, [item.id]: true }))
                            return
                          }
                          setOpen((state) => ({ ...state, [item.id]: !expanded }))
                        }}
                      />
                      {children && (
                        <div className="pg-sub-wrap" data-open={expanded}>
                          <div className="pg-sub-in">
                            <div className="pg-sub">
                              {children.map((child) => (
                                <button
                                  key={child.id}
                                  type="button"
                                  className="pg-item"
                                  aria-current={activePath === child.path ? 'page' : undefined}
                                  onClick={() => go(child.path)}
                                >
                                  <span className="pg-label">{t(child.label)}</span>
                                </button>
                              ))}
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
          <button
            type="button"
            className="pg-item"
            role="switch"
            aria-checked={dark}
            aria-label={t('sidebar.night')}
            title={collapsed ? t('sidebar.night') : undefined}
            onClick={() => onDarkChange(!dark)}
          >
            <span className="pg-ico"><Moon size={20} strokeWidth={1.9} aria-hidden="true" /></span>
            <span className="pg-label">{t('sidebar.night')}</span>
            <span className="pg-switch" data-on={dark}><i /></span>
          </button>
          <button
            type="button"
            className="pg-item"
            onClick={toggleLanguage}
            title={collapsed ? t(rtl ? 'sidebar.english' : 'sidebar.arabic') : undefined}
            aria-label={t(rtl ? 'sidebar.english' : 'sidebar.arabic')}
          >
            <span className="pg-ico"><Languages size={20} strokeWidth={1.9} aria-hidden="true" /></span>
            <span className="pg-label">{t(rtl ? 'sidebar.english' : 'sidebar.arabic')}</span>
          </button>
        </div>
      </div>
    </aside>
  )
}
