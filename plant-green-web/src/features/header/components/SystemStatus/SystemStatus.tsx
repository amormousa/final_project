import { useTranslation } from 'react-i18next'
import { Dropdown } from '../Dropdown'
import { DeviceStatusList } from '../DeviceStatusList'
import { useFarmContext } from '../../hooks/useFarmContext'
import { useSystemStatus } from '../../hooks/useSystemStatus'
import type { SystemStatusState } from '../../types'
import './SystemStatus.css'

const STATUS_LABEL_KEYS: Record<SystemStatusState, string> = {
  online: 'header.status.allOnline',
  partial: 'header.status.partial',
  offline: 'header.status.allOffline',
  unknown: 'header.status.unknown',
}

export function SystemStatus() {
  const { t } = useTranslation()
  const { selectedFarm } = useFarmContext()
  const { devices, summary, loading, error, retry } = useSystemStatus(selectedFarm?.id ?? null)
  const state = error !== null ? 'offline' : loading ? 'unknown' : summary.state
  const statusLabel = error !== null
    ? t('header.status.deviceError')
    : loading
      ? t('header.status.loadingDevices')
      : t(STATUS_LABEL_KEYS[summary.state])
  const count = loading || error !== null
    ? '—/—'
    : `${summary.connected}/${summary.total}`
  const accessibleLabel = loading || error !== null
    ? statusLabel
    : `${statusLabel}, ${t('header.status.connected', {
      connected: summary.connected,
      total: summary.total,
    })}`

  return (
    <Dropdown
      triggerLabel={`${t('header.status.title')}: ${accessibleLabel}`}
      triggerContent={(
        <>
          <span className="system-status__dot" data-state={state} aria-hidden="true" />
          <span className="system-status__count">{count}</span>
        </>
      )}
      triggerClassName="system-status__trigger"
      panelLabel={t('header.status.title')}
      panelRole="dialog"
      panelClassName="system-status__panel"
    >
      {() => (
        <>
          <h2 className="system-status__heading">{t('header.status.title')}</h2>
          <DeviceStatusList
            devices={devices}
            loading={loading}
            error={error}
            onRetry={retry}
          />
        </>
      )}
    </Dropdown>
  )
}
