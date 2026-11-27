import { useCallback, useState } from 'react'

export function useSidebarGroups() {
  const [open, setOpen] = useState<Record<string, boolean>>({})

  const isExpanded = useCallback((id: string, hasActive: boolean, forceOpen = false) => (
    forceOpen || (id in open ? open[id] : hasActive || id === 'overview')
  ), [open])

  const toggle = useCallback((id: string, expanded: boolean) => {
    setOpen((state) => ({ ...state, [id]: !expanded }))
  }, [])

  return { open, isExpanded, toggle }
}
