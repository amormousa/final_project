import { useEffect } from 'react'

interface SidebarShortcutsOptions {
  isMobile: boolean
  collapsed: boolean
  focusSearch: () => void
  closePopover: () => void
  collapseSidebar: () => void
}

export function useSidebarShortcuts({
  isMobile,
  collapsed,
  focusSearch,
  closePopover,
  collapseSidebar,
}: SidebarShortcutsOptions) {
  useEffect(() => {
    const handleShortcut = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isMobile && !collapsed) {
        event.preventDefault()
        closePopover()
        collapseSidebar()
        return
      }
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        focusSearch()
      }
    }

    window.addEventListener('keydown', handleShortcut)
    return () => window.removeEventListener('keydown', handleShortcut)
  }, [collapsed, collapseSidebar, closePopover, focusSearch, isMobile])
}
