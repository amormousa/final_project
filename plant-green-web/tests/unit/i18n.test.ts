import { afterEach, describe, expect, it, vi } from 'vitest'

describe('language direction', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('flips document lang and dir without reload', async () => {
    const documentStub = {
      documentElement: {
        lang: '',
        dir: '',
      },
    }
    vi.stubGlobal('document', documentStub)

    const { setLanguage } = await import('../../src/i18n')

    setLanguage('ar')
    expect(documentStub.documentElement.lang).toBe('ar')
    expect(documentStub.documentElement.dir).toBe('rtl')

    setLanguage('en')
    expect(documentStub.documentElement.lang).toBe('en')
    expect(documentStub.documentElement.dir).toBe('ltr')
  })
})
