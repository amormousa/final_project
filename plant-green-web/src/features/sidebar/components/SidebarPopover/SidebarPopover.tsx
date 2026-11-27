import type { CSSProperties, Ref } from 'react'
import { useTranslation } from 'react-i18next'
import type { RailPopover } from '../../types'
import './SidebarPopover.css'

interface SidebarPopoverProps {
  popover: RailPopover | null
  dir: 'ltr' | 'rtl'
  style: CSSProperties
  firstMenuItemRef: Ref<HTMLButtonElement>
  onNavigate: (path: string) => void
}

export function SidebarPopover({
  popover,
  dir,
  style,
  firstMenuItemRef,
  onNavigate,
}: SidebarPopoverProps) {
  const { t } = useTranslation()

  return (
    <div
      className="pg-rail-popover"
      data-visible={!!popover}
      data-kind={popover?.kind}
      style={style}
      dir={dir}
    >
      {popover && (popover.kind === 'menu' ? (
        <>
          <div className="pg-rail-popover-title">{popover.label}</div>
          <div className="pg-rail-popover-list" role="menu" aria-label={popover.label}>
            {popover.screens?.map((screen, index) => {
              const Icon = screen.icon
              return (
                <button
                  key={screen.id}
                  ref={index === 0 ? firstMenuItemRef : undefined}
                  type="button"
                  role="menuitem"
                  className="pg-rail-popover-screen"
                  onClick={() => onNavigate(screen.path)}
                >
                  {Icon && <Icon size={17} aria-hidden="true" />}
                  <span>{t(screen.label)}</span>
                </button>
              )
            })}
          </div>
        </>
      ) : (
        <span className="pg-rail-popover-title">{popover.label}</span>
      ))}
    </div>
  )
}
