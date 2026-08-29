/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import type { Request } from 'express'

const services = {
  foundretail: `${process.env.FOUNDRETAIL_API_URL || 'http://127.0.0.1:4001/api/v1'}/owner/overview`,
  foundcrypto: `${process.env.FOUNDCRYPTO_API_URL || 'http://127.0.0.1:4002/api/v1'}/crypto/overview`,
  foundmeat: `${process.env.FOUNDMEAT_API_URL || 'http://127.0.0.1:4004/api/v1'}/owner`,
  foundtalent: `${process.env.FOUNDTALENT_API_URL || 'http://127.0.0.1:5050/api/v1'}/owner`,
} as const

const readService = async (url: string, authorization: string) => {
  try {
    const response = await fetch(url, { headers: { Authorization: authorization }, signal: AbortSignal.timeout(5_000) })
    const data = await response.json().catch(() => null)
    return { available: response.ok, status: response.status, data: response.ok ? data : null }
  } catch { return { available: false, status: 503, data: null } }
}

export const forwardFoundRetailCommand = async (request: Request, path: string, method: 'PATCH' | 'POST', body?: unknown) => {
  const response = await fetch(`${(process.env.FOUNDRETAIL_API_URL || 'http://127.0.0.1:4001/api/v1').replace(/\/+$/, '')}${path}`, {
    method,
    headers: { Authorization: request.get('authorization') || '', 'Content-Type': 'application/json' },
    body: body === undefined ? undefined : JSON.stringify(body),
    signal: AbortSignal.timeout(8_000),
  })
  const data = await response.json().catch(() => null)
  if (!response.ok) throw new Error(data?.message || `FoundRetail returned HTTP ${response.status}`)
  return data
}

export const fetchEcosystemFeed = async (request: Request) => {
  const authorization = request.get('authorization') || ''
  const [foundretail, foundcrypto, foundmeat, foundtalent] = await Promise.all([readService(services.foundretail, authorization), readService(services.foundcrypto, authorization), readService(services.foundmeat, authorization), readService(services.foundtalent, authorization)])
  return { foundretail, foundcrypto, foundmeat, foundtalent, refreshedAt: new Date().toISOString() }
}