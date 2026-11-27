import { createElement } from 'react'
import type { ReactNode } from 'react'
import { normalizeText } from './normalizeText'

export function highlightMatch(label: string, query: string): ReactNode {
  if (!query) return label
  const normalizedQuery = normalizeText(query)
  const parts = label.split(new RegExp(`(${normalizedQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'giu'))

  return parts.map((part, index) => (
    part.toLocaleLowerCase() === normalizedQuery
      ? createElement('mark', {
          key: `${part}-${index}`,
          dir: 'auto',
          style: { unicodeBidi: 'isolate' },
        }, part)
      : part
  ))
}
