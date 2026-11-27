import type { Ref } from 'react'
import { useTranslation } from 'react-i18next'
import type { NavSection, SidebarNavigationContext } from '../../types'
import { SelectionLens } from '../SelectionLens'
import { SidebarSection } from '../SidebarSection'
import './SidebarNav.css'

interface SidebarNavProps {
  sections: NavSection[]
  collapsed: boolean
  context: SidebarNavigationContext
  scrollVisible: boolean
  navRef: Ref<HTMLElement>
  navInRef: Ref<HTMLDivElement>
  lensRef: Ref<HTMLDivElement>
  onScrollActivity: () => void
  onClearSearch: () => void
}

export function SidebarNav({
  sections,
  collapsed,
  context,
  scrollVisible,
  navRef,
  navInRef,
  lensRef,
  onScrollActivity,
  onClearSearch,
}: SidebarNavProps) {
  const { t } = useTranslation()

  return (
    <nav
      id="plant-green-sidebar-nav"
      className="pg-nav"
      ref={navRef}
      aria-label={t('sidebar.navLabel')}
      data-scroll-visible={scrollVisible}
      onMouseEnter={onScrollActivity}
      onMouseLeave={onScrollActivity}
      onScroll={onScrollActivity}
    >
      <div className="pg-nav-in" ref={navInRef}>
        <SelectionLens lensRef={lensRef} />
        {sections.length === 0 && !collapsed ? (
          <div className="pg-empty">
            <p>{t('sidebar.empty')}</p>
            <button type="button" className="pg-clear-search" onClick={onClearSearch}>
              {t('sidebar.clearSearch')}
            </button>
          </div>
        ) : sections.map((section) => (
          <SidebarSection key={section.id} section={section} context={context} />
        ))}
      </div>
    </nav>
  )
}
