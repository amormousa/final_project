import { useTranslation } from 'react-i18next'

export function PermissionRestricted() {
  const { t } = useTranslation()
  return <main role="alert">{t('common.permissionRestricted')}</main>
}
