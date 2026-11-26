import { getAccessToken } from '../auth/session'
import type { ApiErrorDetails } from './apiClient'

export function applyAuthHeader(headers: Headers) {
  const token = getAccessToken()
  if (token) headers.set('Authorization', `Bearer ${token}`)
}

export function toApiError(
  status: number,
  payload: ApiErrorDetails | null,
): Error & ApiErrorDetails {
  const error = new Error(payload?.message ?? 'Request failed') as Error & ApiErrorDetails
  error.status = status
  error.code = payload?.code
  error.details = payload?.details
  return error
}
