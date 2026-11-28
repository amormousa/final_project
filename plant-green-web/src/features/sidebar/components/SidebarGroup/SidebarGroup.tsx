import { memo, type MouseEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { HighlightedText } from '../HighlightedText'
import { SidebarItem } from '../SidebarItem'
import type { NavItem, SidebarNavigationContext } from '../../types'
import './SidebarGroup.css'

interface SidebarGroupProps {
  item: NavItem
  context: SidebarNavigationContext
}

export const SidebarGroup = memo(function SidebarGroup({ item, context }: SidebarGroupProps) {
  const { t } = useTranslation()
  const {
    collapsed, activePath, query, highlightedIndex, results, railPopover,
    register, getRailHandlers, isExpanded, toggleGroup, onNavigate, onOpenResult,
  } = context
  const children = item.children?.length ? item.children : undefined
  const hasActive = children?.some((child) => activePath === child.path || activePath.startsWith(`${child.path}/`)) ?? false
  const expanded = isExpanded(item)
  const itemSelected = railPopover?.itemId === item.id && collapsed
  const itemMenuOpen = itemSelected && railPopover?.kind === 'menu'
  const handlers = getRailHandlers(item.id, t(item.label), children)
  const resultIndex = item.path ? results.findIndex((result) => result.path === item.path) : -1

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    if (children) {
      if (collapsed) handlers.onClick(event)
      else toggleGroup(item)
      return
    }
    if (item.path) {
      if (query) onOpenResult(item.path)
      else onNavigate(item.path)
    }
    if (collapsed) handlers.onClick(event)
  }

  return (
    <div>
      <SidebarItem
        id={item.id}
        buttonRef={register(item.id)}
        icon={item.icon}
        label={<HighlightedText label={t(item.label)} query={query} />}
        labelText={t(item.label)}
        collapsed={collapsed}
        current={!children && !!item.path && (activePath === item.path || activePath.startsWith(`${item.path}/`))}
        hasActive={hasActive}
        expanded={children ? (collapsed ? itemMenuOpen : expanded) : undefined}
        selected={itemSelected}
        searchSelected={highlightedIndex === resultIndex}
        menuButton={!!children && collapsed}
        onMouseEnter={handlers.onMouseEnter}
        onMouseLeave={handlers.onMouseLeave}
        onFocus={handlers.onFocus}
        onBlur={handlers.onBlur}
        onClick={handleClick}
      />
      {children && (
        <div className="pg-sub-wrap" data-open={expanded}>
          <div className="pg-sub-in">
            <div className="pg-sub">
              {children.map((screen) => {
                const screenResultIndex = results.findIndex((result) => result.path === screen.path)
                return (
                  <SidebarItem
                    key={screen.id}
                    id={screen.id}
                    buttonRef={register(screen.id)}
                    icon={screen.icon}
                    iconSize={18}
                    iconStrokeWidth={2}
                    label={<HighlightedText label={t(screen.label)} query={query} />}
                    labelText={t(screen.label)}
                    collapsed={collapsed}
                    current={activePath === screen.path || activePath.startsWith(`${screen.path}/`)}
                    searchSelected={highlightedIndex === screenResultIndex}
                    onClick={() => query ? onOpenResult(screen.path) : onNavigate(screen.path)}
                  />
                )
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  )
})
