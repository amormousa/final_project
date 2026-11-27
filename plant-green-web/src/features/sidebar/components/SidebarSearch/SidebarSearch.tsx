import { Search, X } from 'lucide-react'
import type { Dispatch, KeyboardEvent, SetStateAction } from 'react'
import { useTranslation } from 'react-i18next'
import { SidebarItem } from '../SidebarItem'
import type { RailHandlers, SearchResult } from '../../types'
import './SidebarSearch.css'

interface SidebarSearchProps {
  collapsed: boolean
  searchText: string
  query: string
  highlightedIndex: number | null
  results: SearchResult[]
  inputRef: { current: HTMLInputElement | null }
  setSearchText: (value: string) => void
  setHighlightedIndex: Dispatch<SetStateAction<number | null>>
  getRailHandlers: (id: string, label: string) => RailHandlers
  onFocusSearch: () => void
  onOpenResult: (path: string) => void
}

export function SidebarSearch({
  collapsed,
  searchText,
  query,
  highlightedIndex,
  results,
  inputRef,
  setSearchText,
  setHighlightedIndex,
  getRailHandlers,
  onFocusSearch,
  onOpenResult,
}: SidebarSearchProps) {
  const { t } = useTranslation()
  const label = t('sidebar.search')
  const shortcutLabel = typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.platform)
    ? '⌘ K'
    : 'Ctrl K'

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      event.preventDefault()
      if (searchText) {
        setSearchText('')
        setHighlightedIndex(null)
      } else {
        inputRef.current?.blur()
      }
      return
    }
    if ((event.key === 'ArrowDown' || event.key === 'ArrowUp') && results.length > 0) {
      event.preventDefault()
      const direction = event.key === 'ArrowDown' ? 1 : -1
      setHighlightedIndex((current) => {
        if (current === null) return direction > 0 ? 0 : results.length - 1
        return (current + direction + results.length) % results.length
      })
      return
    }
    if (event.key === 'Enter' && results.length > 0) {
      event.preventDefault()
      onOpenResult(results[highlightedIndex ?? 0].path)
    }
  }

  if (collapsed) {
    const handlers = getRailHandlers('search', label)
    return (
      <SidebarItem
        id="search"
        icon={Search}
        label={label}
        labelText={label}
        collapsed
        onMouseEnter={handlers.onMouseEnter}
        onMouseLeave={handlers.onMouseLeave}
        onFocus={handlers.onFocus}
        onBlur={handlers.onBlur}
        onClick={onFocusSearch}
      />
    )
  }

  return (
    <>
      <div className="pg-search">
        <Search size={18} aria-hidden="true" />
        <input
          ref={inputRef}
          value={searchText}
          placeholder={label}
          aria-label={label}
          onChange={(event) => {
            setSearchText(event.target.value)
            setHighlightedIndex(null)
          }}
          onKeyDown={handleKeyDown}
        />
        {searchText ? (
          <button
            type="button"
            className="pg-search-clear"
            aria-label={t('sidebar.clearSearch')}
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => {
              setSearchText('')
              setHighlightedIndex(null)
              inputRef.current?.focus()
            }}
          >
            <X size={16} aria-hidden="true" />
          </button>
        ) : (
          <span className="pg-kbd">{shortcutLabel}</span>
        )}
      </div>
      <span className="pg-sr-only" aria-live="polite">
        {query ? t('sidebar.searchResults', { count: results.length }) : ''}
      </span>
    </>
  )
}
