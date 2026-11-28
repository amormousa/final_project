import { Languages } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { setLanguage } from '../../../../i18n'
import type { Language } from '../../../../i18n'
import './GuestLanguageButton.css'

export function GuestLanguageButton() {
  const { t, i18n } = useTranslation()
  const isArabic = i18n.resolvedLanguage?.startsWith('ar') ?? false
  const nextLanguage: Language = isArabic ? 'en' : 'ar'
  const nextLabel = t(isArabic ? 'sidebar.english' : 'sidebar.arabic')

  return (
    <button
      className="guest-language-button"
      type="button"
      aria-label={`${t('header.user.language')}: ${nextLabel}`}
      onClick={() => setLanguage(nextLanguage)}
    >
      <Languages size={18} aria-hidden="true" />
      <span>{nextLabel}</span>
    </button>
  )
}
