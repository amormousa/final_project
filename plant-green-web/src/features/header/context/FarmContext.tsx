import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { PropsWithChildren } from 'react'
import { useFarms } from '../hooks/useFarms'
import { FarmContext } from './FarmContextValue'
import { persistFarm, persistFarmId, readPersistedFarmId, readPersistedFarmName, resolveSelectedFarmId } from './farmStorage'

function getBrowserStorage(): Storage | null {
  if (typeof window === 'undefined') return null
  try {
    return window.localStorage
  } catch (cause: unknown) {
    console.error('Farm selection storage is unavailable', cause)
    return null
  }
}

export function FarmProvider({ children }: PropsWithChildren) {
  const storage = getBrowserStorage()
  const farmsState = useFarms()
  const persistedDefault = useRef(false)
  const [storedFarmId, setStoredFarmId] = useState(() => {
    if (!storage) return null
    try {
      return readPersistedFarmId(storage)
    } catch (cause: unknown) {
      console.error('Could not read the selected farm', cause)
      return null
    }
  })
  const [cachedFarmNameKey, setCachedFarmNameKey] = useState(() => {
    if (!storage) return null
    try {
      return readPersistedFarmName(storage)
    } catch (cause: unknown) {
      console.error('Could not read the cached farm name', cause)
      return null
    }
  })
  const selectedFarmId = resolveSelectedFarmId(farmsState.farms, storedFarmId)
  const selectedFarm = farmsState.farms.find((farm) => farm.id === selectedFarmId) ?? null

  useEffect(() => {
    if (farmsState.loading || !selectedFarmId || selectedFarmId === storedFarmId || persistedDefault.current) return
    persistedDefault.current = true
    const defaultFarm = farmsState.farms.find((farm) => farm.id === selectedFarmId)
    if (defaultFarm) setCachedFarmNameKey(defaultFarm.nameKey)
    if (!storage) return
    try {
      if (defaultFarm) persistFarm(storage, selectedFarmId, defaultFarm.nameKey)
      else persistFarmId(storage, selectedFarmId)
      setStoredFarmId(selectedFarmId)
    } catch (cause: unknown) {
      console.error('Could not persist the selected farm', cause)
    }
  }, [farmsState.loading, selectedFarmId, storage, storedFarmId])

  const selectFarm = useCallback((farmId: string) => {
    const farm = farmsState.farms.find((candidate) => candidate.id === farmId)
    if (!farm) return
    setStoredFarmId(farmId)
    setCachedFarmNameKey(farm.nameKey)
    persistedDefault.current = true
    if (!storage) return
    try {
      persistFarm(storage, farmId, farm.nameKey)
    } catch (cause: unknown) {
      console.error('Could not persist the selected farm', cause)
    }
  }, [farmsState.farms, storage])

  const value = useMemo(() => ({
    farms: farmsState.farms,
    selectedFarm,
    cachedFarmNameKey: selectedFarm?.nameKey ?? cachedFarmNameKey,
    loading: farmsState.loading,
    error: farmsState.error,
    selectFarm,
    retry: farmsState.retry,
  }), [cachedFarmNameKey, farmsState.error, farmsState.farms, farmsState.loading, farmsState.retry, selectFarm, selectedFarm])

  return <FarmContext.Provider value={value}>{children}</FarmContext.Provider>
}
