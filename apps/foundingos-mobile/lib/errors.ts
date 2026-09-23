/*
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
// Normalizes errors from the three independent backends (Core.Operations,
// Core.Workforce, Core.Intelligence) plus plain network failures into one
// shape the UI can reason about consistently, instead of each screen
// inspecting `err.status`/`err.message` its own way.

export type NormalizedError = {
  message: string
  // A 4xx from a real backend response — the server understood the request
  // and genuinely rejected it (validation, permission, conflict). Not
  // retryable via the outbox; the user needs to change something or it's a
  // real permission/state problem.
  kind: 'rejected'
  status: number
} | {
  message: string
  // No usable server response (offline, timeout, 5xx) — the action can be
  // queued and retried once connectivity/the backend recovers.
  kind: 'network'
  status?: number
}

const FRIENDLY_STATUS_MESSAGE: Record<number, string> = {
  400: 'That request was not valid.',
  401: 'Your session has expired — please sign in again.',
  403: 'You do not have permission to do that.',
  404: 'That item no longer exists.',
  409: 'This was already updated elsewhere — refresh and try again.',
  422: 'That request was not valid.',
}

export function normalizeError(err: unknown): NormalizedError {
  const anyErr = err as { status?: number; message?: string } | undefined
  const status = typeof anyErr?.status === 'number' ? anyErr.status : undefined

  if (status && status < 500) {
    return {
      kind: 'rejected',
      status,
      message: anyErr?.message || FRIENDLY_STATUS_MESSAGE[status] || 'That action could not be completed.',
    }
  }

  return {
    kind: 'network',
    status,
    message: 'Offline or the service is unavailable — queued to sync when possible.',
  }
}

export function isPermissionError(err: unknown): boolean {
  return normalizeError(err).status === 403
}
