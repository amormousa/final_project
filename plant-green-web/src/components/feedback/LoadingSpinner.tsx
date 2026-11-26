import { useTranslation } from 'react-i18next'

export function LoadingSpinner() {
  const { t } = useTranslation()
  return <div role="status" aria-label={t('common.loading')} />
}
