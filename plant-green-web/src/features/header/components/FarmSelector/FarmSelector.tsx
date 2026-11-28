import { Check, ChevronDown, Plus } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Dropdown } from '../Dropdown'
import { useFarmContext } from '../../hooks/useFarmContext'
import './FarmSelector.css'

export function FarmSelector() {
  const { t } = useTranslation()
  const { farms, selectedFarm, cachedFarmNameKey, loading, error, selectFarm, retry } = useFarmContext()
  const hasError = error !== null
  const disabled = !hasError && (loading || farms.length <= 1)

  return (
    <Dropdown
      triggerLabel={t('header.farmSelector')}
      triggerContent={(
        <>
          <span className="farm-selector__name">
            {selectedFarm ? t(selectedFarm.nameKey) : cachedFarmNameKey ? t(cachedFarmNameKey) : t(loading ? 'header.farmLoading' : 'header.farmSelector')}
          </span>
          <ChevronDown size={16} aria-hidden="true" />
        </>
      )}
      triggerClassName="farm-selector__trigger"
      panelLabel={t('header.farmSelector')}
      panelRole="menu"
      panelClassName="farm-selector__panel"
      disabled={disabled}
    >
      {(close) => (
        <div className="farm-selector__content">
          {loading && <p role="status">{t('header.farmLoading')}</p>}
          {hasError && (
            <div className="farm-selector__error" role="alert">
              <span>{t('header.farmLoadError')}</span>
              <button type="button" role="menuitem" onClick={() => { retry(); close() }}>
                {t('header.retryFarms')}
              </button>
            </div>
          )}
          {farms.map((farm) => {
            const selected = selectedFarm?.id === farm.id
            return (
              <button
                key={farm.id}
                type="button"
                role="menuitemradio"
                aria-checked={selected}
                className="farm-selector__option"
                onClick={() => {
                  selectFarm(farm.id)
                  close()
                }}
              >
                <span>
                  <span className="farm-selector__option-name">{t(farm.nameKey)}</span>
                  <span className="farm-selector__option-location">{t(farm.locationKey)}</span>
                </span>
                {selected && <Check size={18} aria-hidden="true" />}
              </button>
            )
          })}
          <Link className="farm-selector__add" role="menuitem" to="/app/farms" onClick={close}>
            <Plus size={16} aria-hidden="true" />
            {t('header.addFarm')}
          </Link>
        </div>
      )}
    </Dropdown>
  )
}
