import { useTranslation } from 'react-i18next'

export function NotFound() {
  const { t } = useTranslation()
  return <main role="alert">{t('common.notFound')}</main>
}

export default NotFound
