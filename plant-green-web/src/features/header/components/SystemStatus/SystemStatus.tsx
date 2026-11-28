import { CircleHelp, Wifi, WifiOff } from 'lucide-react'
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
  const { devices, summary, loading, error, retry, updatedAt } = useSystemStatus(selectedFarm?.id ?? null)
  const state = error !== null ? 'unknown' : loading ? 'unknown' : summary.state
  const StatusIcon = error !== null ? WifiOff : state === 'unknown' ? CircleHelp : state === 'offline' ? WifiOff : Wifi
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
          <StatusIcon className="system-status__icon" size={16} aria-hidden="true" />
          <span className="system-status__count">{error !== null ? statusLabel : count}</span>
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
            updatedAt={updatedAt}
            onRetry={retry}
          />
        </>
      )}
    </Dropdown>
  )
}
