import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { highlightMatch } from '../utils/highlightMatch'

describe('highlightMatch', () => {
  it('highlights only the matching English substring', () => {
    const markup = renderToStaticMarkup(
      createElement('span', null, highlightMatch('Financial Services', 'FIN')),
    )

    expect(markup).toContain('<mark dir="auto" style="unicode-bidi:isolate">Fin</mark>')
  })

  it('isolates highlighted Arabic text for RTL rendering', () => {
    const markup = renderToStaticMarkup(
      createElement('span', null, highlightMatch('الخدمات المالية', 'المالية')),
    )

    expect(markup).toContain('<mark dir="auto" style="unicode-bidi:isolate">المالية</mark>')
  })
})
