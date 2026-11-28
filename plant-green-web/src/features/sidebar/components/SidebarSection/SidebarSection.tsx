import { memo } from 'react'
import { useTranslation } from 'react-i18next'
import type { NavSection, SidebarNavigationContext } from '../../types'
import { HighlightedText } from '../HighlightedText'
import { SidebarGroup } from '../SidebarGroup'
import './SidebarSection.css'

interface SidebarSectionProps {
  section: NavSection
  context: SidebarNavigationContext
}

export const SidebarSection = memo(function SidebarSection({ section, context }: SidebarSectionProps) {
  const { t } = useTranslation()

  return (
    <div role="group" aria-label={t(section.label)}>
      <div className="pg-sec-title" aria-hidden="true">
        <HighlightedText label={t(section.label)} query={context.query} />
      </div>
      {section.items.map((item) => (
        <SidebarGroup key={item.id} item={item} context={context} />
      ))}
    </div>
  )
})
