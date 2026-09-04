/* 
  © 2024–2026 FoundingOS API. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { NextRequest } from 'next/server'

const SESSION_COOKIE = 'fo_tester_session'
const ADMIN_COOKIE = 'fo_tester_admin_session'
const SESSION_SECRET = process.env.TESTER_SESSION_SECRET ?? 'founderos-tester-program-dev-secret'
const encoder = new TextEncoder()
const decoder = new TextDecoder()

function fromBase64Url(value: string): Uint8Array {
  const normalized = value.replace(/-/g, '+').replace(/_/g, '/')
  const padded = normalized.padEnd(normalized.length + ((4 - (normalized.length % 4)) % 4), '=')
  const binary = atob(padded)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i)
  return bytes
}

async function getKey() {
  return crypto.subtle.importKey('raw', encoder.encode(SESSION_SECRET), { name: 'HMAC', hash: 'SHA-256' }, false, ['verify'])
}

async function verifyToken(scope: 'tester' | 'admin', token: string): Promise<string | null> {
  const [payloadPart, signaturePart] = token.split('.')
  if (!payloadPart || !signaturePart) return null
  let payload: string
  try {
    payload = decoder.decode(fromBase64Url(payloadPart))
  } catch {
    return null
  }
  const key = await getKey()
  const valid = await crypto.subtle.verify('HMAC', key, fromBase64Url(signaturePart) as BufferSource, encoder.encode(payload))
  if (!valid) return null
  const [tokenScope, id] = payload.split(':')
  if (tokenScope !== scope || !id) return null
  return id
}

// Real native-app auth path: the mobile apps send the same session token issued by
// /api/tester/login as `Authorization: Bearer <token>` instead of a cookie (React Native has
// no shared browser cookie jar, and per explicit product direction the apps must never open a
// browser/WebView at all) — this checks the header first, falling back to the cookie for any
// browser-based caller (kept for the existing web consoles, unaffected either way).
export async function getSession(request: NextRequest): Promise<{ id: string; scope: 'tester' | 'admin' } | null> {
  const authHeader = request.headers.get('authorization')
  const headerToken = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null

  const adminToken = headerToken ?? request.cookies.get(ADMIN_COOKIE)?.value
  if (adminToken) {
    const adminId = await verifyToken('admin', adminToken)
    if (adminId) return { id: adminId, scope: 'admin' }
  }

  const testerToken = headerToken ?? request.cookies.get(SESSION_COOKIE)?.value
  if (testerToken) {
    const testerId = await verifyToken('tester', testerToken)
    if (testerId) return { id: testerId, scope: 'tester' }
  }

  return null
}
