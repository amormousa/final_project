import ar from '../../../i18n/locales/ar'
import en from '../../../i18n/locales/en'
import type { NavItem, NavSection, NavigationFilterResult, SearchResult } from '../types'
import { normalizeText } from './normalizeText'

function matchesLabel(label: string, query: string) {
  const key = label.replace(/^sidebar\./, '') as keyof typeof en.sidebar
  return normalizeText(`${en.sidebar[key]} ${ar.sidebar[key]}`).includes(normalizeText(query))
}

export function filterNavigation(navigation: NavSection[], rawQuery: string): NavigationFilterResult {
  const query = normalizeText(rawQuery)
  const matches = (label: string) => matchesLabel(label, query)
  const sections = !query ? navigation : navigation.map((section) => ({
    ...section,
    items: section.items.map((item): NavItem | null => {
      if (item.children) {
        const children = item.children.filter((screen) => matches(screen.label))
        if (!matches(item.label) && children.length === 0) return null
        return { ...item, children, forceOpen: children.length > 0 }
      }
      return matches(item.label) && item.path ? item : null
    }).filter((item): item is NavItem => item !== null),
  })).filter((section) => section.items.length > 0)
  const results: SearchResult[] = !query ? [] : navigation.flatMap((section) =>
    section.items.flatMap<SearchResult>((item) => {
      if (item.children) {
        return item.children
          .filter((screen) => matches(screen.label))
          .map((screen) => ({ ...screen, parentId: item.id, parentLabel: item.label }))
      }
      return matches(item.label) && item.path
        ? [{ id: item.id, path: item.path, label: item.label, icon: item.icon, keywords: item.keywords }]
        : []
    }),
  )

  return { sections, results }
}

export { matchesLabel }
