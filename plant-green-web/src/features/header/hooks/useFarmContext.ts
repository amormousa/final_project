import { useContext } from 'react'
import { FarmContext } from '../context/FarmContextValue'
import type { FarmContextValue } from '../context/FarmContextValue'

export function useFarmContext(): FarmContextValue {
  const context = useContext(FarmContext)
  if (!context) throw new Error('useFarmContext must be used within FarmProvider')
  return context
}
