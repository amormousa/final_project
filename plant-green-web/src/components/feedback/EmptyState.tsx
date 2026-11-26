import { useTranslation } from 'react-i18next'

export function EmptyState({ message }: { message?: string }) {
  const { t } = useTranslation()
  return <p role="status">{message ?? t('common.empty')}</p>
}
