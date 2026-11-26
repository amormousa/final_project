import { applyAuthHeader, toApiError } from './interceptors'
import { getAccessToken, setAccessToken } from '../auth/session'

export interface ApiErrorDetails {
  status: number
  code?: string
  message?: string
  details?: unknown
}

export type ApiError = Error & ApiErrorDetails

export interface ApiResponse<T> {
  data: T
  status: number
}

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api'

let refreshPromise: Promise<string> | null = null

async function refreshAccessToken(): Promise<string> {
  if (refreshPromise) return refreshPromise

  refreshPromise = (async () => {
    // PLACEHOLDER: Backend refresh contract is not defined.
    const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
    })

    if (!response.ok) {
      throw await createApiError(response)
    }

    const payload = await response.json() as { accessToken?: string }
    if (!payload.accessToken) {
      throw toApiError(response.status, {
        status: response.status,
        code: 'INVALID_REFRESH_RESPONSE',
        message: 'Refresh response did not include an access token',
      })
    }

    setAccessToken(payload.accessToken)
    return payload.accessToken
  })()

  try {
    return await refreshPromise
  } finally {
    refreshPromise = null
  }
}

async function createApiError(response: Response): Promise<ApiError> {
  let payload: ApiErrorDetails | null = null
  try {
    payload = await response.json() as ApiErrorDetails
  } catch {
    payload = null
  }
  return toApiError(response.status, payload)
}

export async function apiFetch<T>(
  path: string,
  init: RequestInit = {},
  retryAfterUnauthorized = true,
): Promise<ApiResponse<T>> {
  const url = path.startsWith('http') ? path : `${API_BASE_URL}${path}`
  const headers = new Headers(init.headers)
  applyAuthHeader(headers)

  const response = await fetch(url, { ...init, headers })
  if (response.status === 401 && retryAfterUnauthorized && getAccessToken()) {
    await refreshAccessToken()
    return apiFetch<T>(path, init, false)
  }

  if (!response.ok) throw await createApiError(response)

  if (response.status === 204) {
    return { data: undefined as T, status: response.status }
  }

  return {
    data: await response.json() as T,
    status: response.status,
  }
}

export const apiClient = {
  get<T>(path: string, init?: RequestInit) {
    return apiFetch<T>(path, init)
  },
  post<T>(path: string, body?: unknown, init?: RequestInit) {
    return apiFetch<T>(path, {
      ...init,
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...init?.headers },
      body: body === undefined ? undefined : JSON.stringify(body),
    })
  },
  put<T>(path: string, body?: unknown, init?: RequestInit) {
    return apiFetch<T>(path, {
      ...init,
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...init?.headers },
      body: body === undefined ? undefined : JSON.stringify(body),
    })
  },
  delete<T>(path: string, init?: RequestInit) {
    return apiFetch<T>(path, { ...init, method: 'DELETE' })
  },
}
