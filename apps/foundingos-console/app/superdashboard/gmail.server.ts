import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { ADMIN_COOKIE, verifyToken } from '../tester/session'
import { object, seal, unseal } from './gmail-data'

export const GMAIL_COOKIE = 'fo_gmail_connection'
export const STATE_COOKIE = 'fo_gmail_state'
export const GMAIL_SCOPE = 'https://www.googleapis.com/auth/gmail.readonly'

export class GmailError extends Error {
  constructor(message: string, public status = 400) { super(message) }
}

export async function requireFounder() {
  const secret = process.env.TESTER_SESSION_SECRET
  if (!secret) throw new GmailError('The FoundingOS console cannot read TESTER_SESSION_SECRET at runtime. Check its Production environment setting and redeploy.', 503)
  if (secret === 'founderos-tester-program-dev-secret') throw new GmailError('TESTER_SESSION_SECRET is still using the development fallback. Set a secure shared production value before using private expenses.', 503)
  if (secret.length < 32) throw new GmailError('The shared TESTER_SESSION_SECRET must be at least 32 characters before private expenses can be used.', 503)
  const token = cookies().get(ADMIN_COOKIE)?.value
  let id: string | null = null
  if (token) {
    try { id = await verifyToken('admin', token) } catch { id = null }
  }
  if (!id) throw new GmailError('Sign in as the founder to use private expenses.', 401)
  return id
}

export function gmailConfig() {
  const clientId = process.env.GMAIL_CLIENT_ID
  const clientSecret = process.env.GMAIL_CLIENT_SECRET
  const redirectUri = process.env.GMAIL_REDIRECT_URI
  const tokenKey = process.env.GMAIL_TOKEN_KEY
  if (!clientId || !clientSecret || !redirectUri || !tokenKey) throw new GmailError('Gmail is not set up yet. Configure the Google OAuth client and token encryption key.', 503)
  let url: URL
  try { url = new URL(redirectUri) } catch { throw new GmailError('GMAIL_REDIRECT_URI must be an absolute console callback URL.', 503) }
  if (url.pathname !== '/api/gmail/callback' || url.search || url.hash || (url.protocol !== 'https:' && !(url.protocol === 'http:' && url.hostname === 'localhost'))) {
    throw new GmailError('Check GMAIL_REDIRECT_URI: use your console URL followed by /api/gmail/callback.', 503)
  }
  const key = Buffer.from(tokenKey, 'base64')
  if (key.length !== 32) throw new GmailError('GMAIL_TOKEN_KEY must be a base64-encoded 32-byte key.', 503)
  return { clientId, clientSecret, redirectUri, origin: url.origin, key, secure: url.protocol === 'https:' }
}

export function cookieOptions(maxAge: number) {
  return { httpOnly: true, secure: gmailConfig().secure, sameSite: 'lax' as const, path: '/api', maxAge }
}

export function checkOrigin(request: Request) {
  if (request.headers.get('origin') !== gmailConfig().origin) throw new GmailError('Please perform this action from your FoundingOS console.', 403)
}

export function saveConnection(ownerId: string, token: string, email: string, seconds: number) {
  const config = gmailConfig()
  const duration = Math.min(seconds, 3600)
  const value = seal({ ownerId, token, email, expiresAt: Date.now() + duration * 1000 }, config.key)
  if (value.length > 3800) throw new GmailError('Google returned a connection too large to store securely.', 502)
  cookies().set(GMAIL_COOKIE, value, cookieOptions(duration))
}

export function connection(ownerId: string) {
  const value = cookies().get(GMAIL_COOKIE)?.value
  if (!value) throw new GmailError('Connect Gmail to choose an invoice.', 401)
  let data: Record<string, unknown>
  try { data = object(unseal(value, gmailConfig().key)) } catch (error) {
    if (error instanceof GmailError) throw error
    throw new GmailError('Your Gmail connection is no longer valid. Please reconnect.', 401)
  }
  if (data.ownerId !== ownerId || typeof data.token !== 'string' || typeof data.email !== 'string' || typeof data.expiresAt !== 'number' || data.expiresAt <= Date.now()) {
    throw new GmailError('Your Gmail connection has expired. Please reconnect.', 401)
  }
  return { token: data.token, email: data.email }
}

export async function googleJson(url: string, init: RequestInit) {
  let response: Response
  try { response = await fetch(url, { ...init, cache: 'no-store', signal: AbortSignal.timeout(15000) }) } catch {
    throw new GmailError('Google could not be reached. Please try again.', 502)
  }
  if (!response.ok) throw new GmailError(
    response.status === 401 ? 'Your Gmail connection has expired. Please reconnect.' : 'Google could not complete the request. Check your Gmail permissions and try again.',
    response.status === 401 ? 401 : 502,
  )
  try { return object(await response.json()) } catch { throw new GmailError('Google returned an unreadable response.', 502) }
}

export function gmailGet(token: string, path: string) {
  return googleJson(`https://gmail.googleapis.com/gmail/v1/users/me/${path}`, { headers: { Authorization: `Bearer ${token}` } })
}

export function privateJson(body: unknown, status = 200) {
  return NextResponse.json(body, { status, headers: { 'Cache-Control': 'no-store' } })
}

export function failure(error: unknown) {
  if (error instanceof GmailError) return privateJson({ error: error.message }, error.status)
  console.error('[founder-expenses] Request failed', error instanceof Error ? error.name : 'Unknown error')
  return privateJson({ error: 'This request could not be completed. Please try again. If it continues, check the server configuration and database migration.' }, 500)
}
