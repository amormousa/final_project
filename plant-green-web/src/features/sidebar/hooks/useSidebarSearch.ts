import { useLayoutEffect, useMemo, useRef, useState } from 'react'
import { NAV } from '../data/navigation'
import { filterNavigation } from '../utils/filterNavigation'
import { normalizeText } from '../utils/normalizeText'

export function useSidebarSearch() {
  const [searchText, setSearchText] = useState('')
  const [highlightedIndex, setHighlightedIndex] = useState<number | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const navRef = useRef<HTMLElement>(null)
  const query = normalizeText(searchText)
  const { sections, results } = useMemo(() => filterNavigation(NAV, query), [query])

  useLayoutEffect(() => {
    if (navRef.current) navRef.current.scrollTop = 0
  }, [query])

  return {
    searchText,
    setSearchText,
    query,
    highlightedIndex,
    setHighlightedIndex,
    inputRef,
    sections,
    results,
    navRef,
  }
}
