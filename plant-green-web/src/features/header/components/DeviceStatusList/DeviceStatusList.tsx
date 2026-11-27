import { CircleHelp, Wifi, WifiOff } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import type { Device } from '../../types'
import { formatRelativeTime } from '../../utils/formatRelativeTime'
import './DeviceStatusList.css'

interface DeviceStatusListProps {
  devices: Device[]
  loading: boolean
  error: unknown
  onRetry: () => void
}

export function DeviceStatusList({ devices, loading, error, onRetry }: DeviceStatusListProps) {
  const { t, i18n } = useTranslation()

  if (loading) {
    return <p className="device-status-list__message" role="status">{t('header.status.loadingDevices')}</p>
  }

  if (error !== null) {
    return (
      <div className="device-status-list__error" role="alert">
        <p>{t('header.status.deviceError')}</p>
        <button type="button" onClick={onRetry}>{t('header.status.retry')}</button>
      </div>
    )
  }

  if (devices.length === 0) {
    return <p className="device-status-list__message">{t('header.status.noDevices')}</p>
  }

  return (
    <ul className="device-status-list">
      {devices.map((device) => {
        const StatusIcon = device.status === 'online'
          ? Wifi
          : device.status === 'offline'
            ? WifiOff
            : CircleHelp
        const statusLabel = device.status === 'unknown'
          ? t('header.status.unknownDevice')
          : t(`header.status.${device.status}`)
        const lastSeen = device.lastSeen
          ? t('header.status.lastSeen', {
            time: formatRelativeTime(device.lastSeen, new Date(), i18n.resolvedLanguage ?? 'en'),
          })
          : t('header.status.neverSeen')

        return (
          <li className="device-status-list__row" key={device.id}>
            <div className="device-status-list__details">
              <strong>{t(device.nameKey)}</strong>
              <span className="device-status-list__zone">{t(device.zoneKey)}</span>
              <span className="device-status-list__controls">
                {device.controlsKeys.map((key) => t(key)).join(', ')}
              </span>
              <span className="device-status-list__last-seen">{lastSeen}</span>
            </div>
            <span className="device-status-list__state" data-state={device.status}>
              <StatusIcon size={16} aria-hidden="true" />
              {statusLabel}
            </span>
          </li>
        )
      })}
    </ul>
  )
}
