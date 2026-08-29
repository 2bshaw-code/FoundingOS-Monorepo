/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import type { Request } from 'express'

const foundItApiUrl = () => (process.env.FOUNDIT_API_URL || 'http://127.0.0.1:4003/api/v1').replace(/\/+$/, '')

export const fetchFoundThisFeed = async (request: Request) => {
  const authorization = request.get('authorization')
  if (!authorization) throw new Error('Authorization header required')
  const response = await fetch(`${foundItApiUrl()}/scraped-links`, { headers: { Authorization: authorization }, signal: AbortSignal.timeout(8_000) })
  const body = await response.json().catch(() => ({ success: false, message: 'Invalid FoundThis response' }))
  if (!response.ok) throw new Error(body.message || `FoundThis returned HTTP ${response.status}`)
  return body.data || []
}