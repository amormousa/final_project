import { useTranslation } from 'react-i18next'
import { matchesLabel } from '../../utils/filterNavigation'
import { HighlightedText } from '../HighlightedText'
import { LanguageToggle } from '../LanguageToggle'
import { NightModeToggle } from '../NightModeToggle'
import type { RailHandlers, RailPopover } from '../../types'
import './SidebarFooter.css'

interface SidebarFooterProps {
  query: string
  collapsed: boolean
  dark: boolean
  rtl: boolean
  railPopover: RailPopover | null
  getRailHandlers: (id: string, label: string) => RailHandlers
  onDarkChange: (dark: boolean) => void
  onLanguageToggle: () => void
}

export function SidebarFooter({
  query,
  collapsed,
  dark,
  rtl,
  railPopover,
  getRailHandlers,
  onDarkChange,
  onLanguageToggle,
}: SidebarFooterProps) {
  const { t } = useTranslation()
  const languageLabelKey = rtl ? 'sidebar.english' : 'sidebar.arabic'
  const nightLabel = t('sidebar.night')
  const languageLabel = t(languageLabelKey)
  const nightHandlers = getRailHandlers('night', nightLabel)
  const languageHandlers = getRailHandlers('language', languageLabel)

  return (
    <div className="pg-foot">
      {(!query || matchesLabel('sidebar.night', query)) && (
        <NightModeToggle
          label={<HighlightedText label={nightLabel} query={query} />}
          ariaLabel={nightLabel}
          collapsed={collapsed}
          dark={dark}
          selected={railPopover?.itemId === 'night' && collapsed}
          handlers={nightHandlers}
          onChange={(event) => {
            onDarkChange(!dark)
            if (collapsed) nightHandlers.onClick(event)
          }}
        />
      )}
      {(!query || matchesLabel(languageLabelKey, query)) && (
        <LanguageToggle
          label={<HighlightedText label={languageLabel} query={query} />}
          ariaLabel={languageLabel}
          collapsed={collapsed}
          selected={railPopover?.itemId === 'language' && collapsed}
          handlers={languageHandlers}
          onToggle={(event) => {
            onLanguageToggle()
            if (collapsed) languageHandlers.onClick(event)
          }}
        />
      )}
    </div>
  )
}
