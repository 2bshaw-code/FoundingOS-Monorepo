import { createHmac, scryptSync, timingSafeEqual } from 'node:crypto'

export const SITE_ACCESS_COOKIE = 'foundingos_site_access'
export const SITE_ACCESS_MAX_AGE = 60 * 60 * 24 * 7

const requiredSecret = () => {
  const secret = process.env.SITE_ACCESS_SECRET?.trim()
  if (!secret || secret.length < 32) throw new Error('SITE_ACCESS_SECRET must contain at least 32 characters')
  return secret
}

const encode = (value: string) => Buffer.from(value).toString('base64url')

export function normalizeAccessEmail(candidate: string) {
  const email = candidate.trim().toLowerCase()
  return email.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? email : null
}

export function signSiteAccess(email: string, now = Date.now()) {
  const normalized = normalizeAccessEmail(email)
  if (!normalized) throw new Error('A valid email address is required')
  const payload = encode(JSON.stringify({ email: normalized, expiresAt: now + SITE_ACCESS_MAX_AGE * 1000 }))
  const signature = createHmac('sha256', requiredSecret()).update(payload).digest('base64url')
  return `${payload}.${signature}`
}

export function readSiteAccess(token: string | undefined, now = Date.now()) {
  if (!token) return null
  const [payload, provided, extra] = token.split('.')
  if (!payload || !provided || extra) return null
  const expected = createHmac('sha256', requiredSecret()).update(payload).digest()
  let actual: Buffer
  try {
    actual = Buffer.from(provided, 'base64url')
  } catch {
    return null
  }
  if (expected.length !== actual.length || !timingSafeEqual(expected, actual)) return null
  try {
    const parsed = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8')) as { email?: unknown; expiresAt?: unknown }
    const email = typeof parsed.email === 'string' ? normalizeAccessEmail(parsed.email) : null
    return email && typeof parsed.expiresAt === 'number' && parsed.expiresAt > now
      ? { email, expiresAt: parsed.expiresAt }
      : null
  } catch {
    return null
  }
}

export function verifySitePassword(candidate: string) {
  const configured = process.env.SITE_ACCESS_PASSWORD_HASH?.trim()
  if (!configured) throw new Error('SITE_ACCESS_PASSWORD_HASH is required')
  const [algorithm, saltHex, hashHex] = configured.split('$')
  if (algorithm !== 'scrypt' || !/^[0-9a-f]+$/i.test(saltHex) || !/^[0-9a-f]+$/i.test(hashHex)) throw new Error('SITE_ACCESS_PASSWORD_HASH is invalid')
  const expected = Buffer.from(hashHex, 'hex')
  const actual = scryptSync(candidate, Buffer.from(saltHex, 'hex'), expected.length)
  return expected.length === actual.length && timingSafeEqual(expected, actual)
}

export function safeReturnPath(value: FormDataEntryValue | null) {
  const path = String(value ?? '/')
  return path.startsWith('/') && !path.startsWith('//') ? path : '/'
}
