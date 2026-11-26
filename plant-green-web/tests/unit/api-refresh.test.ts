import { afterEach, describe, expect, it, vi } from 'vitest'
import { apiFetch } from '../../src/core/api/apiClient'
import { clearSession, setAccessToken } from '../../src/core/auth/session'

describe('single-flight token refresh', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
    clearSession()
  })

  it('uses one refresh call for concurrent 401 responses and retries every request', async () => {
    let refreshCalls = 0
    let retryCalls = 0

    const fetchMock = vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
      const url = String(input)

      if (url.endsWith('/auth/refresh')) {
        refreshCalls += 1
        return new Response(
          JSON.stringify({ accessToken: 'fresh-token' }),
          { status: 200, headers: { 'Content-Type': 'application/json' } },
        )
      }

      const authorization = new Headers(init?.headers).get('Authorization')
      if (authorization === 'Bearer fresh-token') {
        retryCalls += 1
        return new Response(
          JSON.stringify({ ok: true }),
          { status: 200, headers: { 'Content-Type': 'application/json' } },
        )
      }

      return new Response(JSON.stringify({ message: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      })
    })

    vi.stubGlobal('fetch', fetchMock)
    setAccessToken('expired-token')

    const responses = await Promise.all([
      apiFetch('/one'),
      apiFetch('/two'),
      apiFetch('/three'),
    ])

    expect(refreshCalls).toBe(1)
    expect(retryCalls).toBe(3)
    expect(responses).toHaveLength(3)
  })
})
