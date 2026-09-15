/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
// Pure Web Crypto session tokens — no Node-only APIs, so this file is safe to import
// from both edge middleware and server route handlers/components.

export const SESSION_COOKIE = 'fo_tester_session'
export const ADMIN_COOKIE = 'fo_tester_admin_session'

const SESSION_SECRET = process.env.TESTER_SESSION_SECRET ?? 'founderos-tester-program-dev-secret'
const encoder = new TextEncoder()
const decoder = new TextDecoder()

function toBase64Url(bytes: Uint8Array): string {
  let binary = ''
  for (const byte of bytes) binary += String.fromCharCode(byte)
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

function fromBase64Url(value: string): Uint8Array {
  const normalized = value.replace(/-/g, '+').replace(/_/g, '/')
  const padded = normalized.padEnd(normalized.length + ((4 - (normalized.length % 4)) % 4), '=')
  const binary = atob(padded)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i)
  return bytes
}

async function getKey() {
  return crypto.subtle.importKey('raw', encoder.encode(SESSION_SECRET), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign', 'verify'])
}

// Tokens are scoped ("tester" vs "admin") so a tester session can never be replayed as an admin session.
export async function signToken(scope: 'tester' | 'admin', id: string): Promise<string> {
  const payload = `${scope}:${id}:${Date.now()}`
  const key = await getKey()
  const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(payload))
  return `${toBase64Url(encoder.encode(payload))}.${toBase64Url(new Uint8Array(signature))}`
}

export async function verifyToken(scope: 'tester' | 'admin', token: string): Promise<string | null> {
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
