import { SidebarBackdrop } from './components/SidebarBackdrop'
import { CollapseButton } from './components/CollapseButton'
import { SidebarHeader } from './components/SidebarHeader'
import { SidebarNav } from './components/SidebarNav'
import { SidebarPopover } from './components/SidebarPopover'
import { SidebarSearch } from './components/SidebarSearch'
import { useSidebarController } from './hooks/useSidebarController'
import './PlantGreenSidebar.css'

interface PlantGreenSidebarProps {
  dark: boolean
  mobileOpen: boolean
  onMobileOpenChange: (open: boolean) => void
}

export function PlantGreenSidebar(props: PlantGreenSidebarProps) {
  const sidebar = useSidebarController(props)

  return (
    <>
      {sidebar.showBackdrop && (
        <SidebarBackdrop label={sidebar.collapseLabel} onClick={sidebar.onBackdropClick} />
      )}
      <aside
        ref={sidebar.asideRef}
        className="pg-side"
        dir={sidebar.rtl ? 'rtl' : 'ltr'}
        data-collapsed={sidebar.collapsed}
        data-dark={props.dark}
        data-transitioning={sidebar.transitioning}
      >
        <div className="pg-glass" aria-hidden="true" />
        <CollapseButton
          icon={sidebar.BackIcon}
          collapsed={sidebar.collapsed}
          label={sidebar.collapseLabel}
          onClick={sidebar.onToggleCollapse}
        />
        <div className="pg-inner">
          <SidebarHeader />
          <SidebarSearch {...sidebar.searchProps} />
          <SidebarNav {...sidebar.navProps} />
        </div>
        <SidebarPopover {...sidebar.popoverProps} />
      </aside>
    </>
  )
}
