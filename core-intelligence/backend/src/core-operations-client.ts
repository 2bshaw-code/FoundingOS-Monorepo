/*
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import type { Request } from 'express'

// Core.Intelligence never stores its own copy of governed actions, insights, or business
// numbers. It authenticates as the calling founder/operator and reads the real,
// already-governed data straight from Core.Operations, then reshapes it for the
// Intelligence surfaces (Command Centre, Signals, Risks, Recommendations, Outcomes).
// This keeps a single source of truth for the suggestion -> simulation -> approval ->
// execution -> outcome -> reversal chain instead of forking a second one.

const baseUrl = () => (process.env.CORE_OPERATIONS_API_URL || 'http://127.0.0.1:4001/api/v1/ops').replace(/\/+$/, '')

export class CoreOperationsError extends Error {
  status: number
  constructor(message: string, status: number) {
    super(message)
    this.status = status
  }
}

export async function opsRequest<T>(req: Request, path: string, init: { method?: string; body?: unknown } = {}): Promise<T> {
  const method = (init.method || 'GET').toUpperCase()
  const response = await fetch(`${baseUrl()}${path}`, {
    method,
    headers: {
      Authorization: req.header('authorization') || '',
      ...(req.header('x-tenant-id') ? { 'X-Tenant-Id': req.header('x-tenant-id')! } : {}),
      ...(method !== 'GET' && method !== 'HEAD' ? { 'Content-Type': 'application/json' } : {}),
    },
    body: method === 'GET' || method === 'HEAD' ? undefined : JSON.stringify(init.body ?? {}),
    signal: AbortSignal.timeout(10_000),
  })
  const payload = await response.json().catch(() => ({})) as { success?: boolean; data?: T; message?: string }
  if (!response.ok || payload.success === false) {
    throw new CoreOperationsError(payload.message || `Core.Operations request failed (${response.status})`, response.status)
  }
  return payload.data as T
}
