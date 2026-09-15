/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import type { Request } from 'express'

// CoreOperations and CoreOperations are deprecated brands (removed) — see
// /docs/deprecations.md. `core_operations` and `core_workforce` map to the
// Core.Operations and Core.Workforce suites respectively.
const services = {
  core_operations: `${process.env.CORE_OPERATIONS_API_URL || 'http://127.0.0.1:4001/api/v1'}/owner/overview`,
  core_workforce: `${process.env.CORE_WORKFORCE_API_URL || 'http://127.0.0.1:5050/api/v1'}/owner`,
} as const

const readService = async (url: string, authorization: string) => {
  try {
    const response = await fetch(url, { headers: { Authorization: authorization }, signal: AbortSignal.timeout(5_000) })
    const data = await response.json().catch(() => null)
    return { available: response.ok, status: response.status, data: response.ok ? data : null }
  } catch { return { available: false, status: 503, data: null } }
}

export const forwardCoreOperationsCommand = async (request: Request, path: string, method: 'PATCH' | 'POST', body?: unknown) => {
  const response = await fetch(`${(process.env.CORE_OPERATIONS_API_URL || 'http://127.0.0.1:4001/api/v1').replace(/\/+$/, '')}${path}`, {
    method,
    headers: { Authorization: request.get('authorization') || '', 'Content-Type': 'application/json' },
    body: body === undefined ? undefined : JSON.stringify(body),
    signal: AbortSignal.timeout(8_000),
  })
  const data = await response.json().catch(() => null)
  if (!response.ok) throw new Error(data?.message || `CoreOperations returned HTTP ${response.status}`)
  return data
}

export const fetchEcosystemFeed = async (request: Request) => {
  const authorization = request.get('authorization') || ''
  const [core_operations, core_workforce] = await Promise.all([readService(services.core_operations, authorization), readService(services.core_workforce, authorization)])
  return { core_operations, core_workforce, refreshedAt: new Date().toISOString() }
}