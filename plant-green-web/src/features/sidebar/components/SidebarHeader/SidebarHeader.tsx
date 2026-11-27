import { Sprout } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import './SidebarHeader.css'

export function SidebarHeader() {
  const { t } = useTranslation()

  return (
    <div className="pg-head">
      <span className="pg-logo">
        <Sprout size={20} strokeWidth={2} aria-hidden="true" />
      </span>
      <span className="pg-label">
        <span className="pg-title">{t('sidebar.brand')}</span>
        <span className="pg-sub-title">{t('sidebar.tagline')}</span>
      </span>
    </div>
  )
}
