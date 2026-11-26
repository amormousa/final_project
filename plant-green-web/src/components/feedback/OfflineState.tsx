import { useTranslation } from 'react-i18next'

export function OfflineState() {
  const { t } = useTranslation()
  return <p role="status">{t('common.offline')}</p>
}
