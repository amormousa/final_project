import { useTranslation } from 'react-i18next'

export function ErrorState({ message, onRetry }: { message?: string; onRetry?: () => void }) {
  const { t } = useTranslation()
  return (
    <div role="alert">
      <p>{message ?? t('common.error')}</p>
      {onRetry ? <button type="button" onClick={onRetry}>{t('common.retry')}</button> : null}
    </div>
  )
}
