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

export type SiteAccessRole = 'investor' | 'tester' | 'guest'
const ROLES: SiteAccessRole[] = ['investor', 'tester', 'guest']
const asRole = (value: unknown): SiteAccessRole => (ROLES.includes(value as SiteAccessRole) ? value as SiteAccessRole : 'guest')

export function signSiteAccess(email: string, now = Date.now(), role: SiteAccessRole = 'guest') {
  const normalized = normalizeAccessEmail(email)
  if (!normalized) throw new Error('A valid email address is required')
  const payload = encode(JSON.stringify({ email: normalized, role, expiresAt: now + SITE_ACCESS_MAX_AGE * 1000 }))
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
    const parsed = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8')) as { email?: unknown; role?: unknown; expiresAt?: unknown }
    const email = typeof parsed.email === 'string' ? normalizeAccessEmail(parsed.email) : null
    return email && typeof parsed.expiresAt === 'number' && parsed.expiresAt > now
      ? { email, role: asRole(parsed.role), expiresAt: parsed.expiresAt }
      : null
  } catch {
    return null
  }
}

// SITE_ACCESS_PASSWORD_HASH holds one or more "scrypt$salt$hash" entries
// separated by ";" so multiple distinct invitation passwords (e.g. one per
// investor/partner) can be issued without sharing a single password. An entry
// may start with "investor:" or "tester:" to say who the password is for.
function verifyAgainstHash(candidate: string, configured: string) {
  const [algorithm, saltHex, hashHex] = configured.split('$')
  if (algorithm !== 'scrypt' || !/^[0-9a-f]+$/i.test(saltHex) || !/^[0-9a-f]+$/i.test(hashHex)) throw new Error('SITE_ACCESS_PASSWORD_HASH is invalid')
  const expected = Buffer.from(hashHex, 'hex')
  const actual = scryptSync(candidate, Buffer.from(saltHex, 'hex'), expected.length)
  return expected.length === actual.length && timingSafeEqual(expected, actual)
}

// Returns the role of the matching password, or null when nothing matches.
export function siteAccessRole(candidate: string): SiteAccessRole | null {
  const configured = process.env.SITE_ACCESS_PASSWORD_HASH?.trim()
  if (!configured) throw new Error('SITE_ACCESS_PASSWORD_HASH is required')
  const entries = configured.split(';').map((entry) => entry.trim()).filter(Boolean)
  if (entries.length === 0) throw new Error('SITE_ACCESS_PASSWORD_HASH is invalid')
  // Check every entry (rather than short-circuiting) so response time does not
  // reveal which slot, if any, matched.
  let matched: SiteAccessRole | null = null
  for (const entry of entries) {
    const [prefix, rest] = entry.startsWith('scrypt$') ? ['guest', entry] : [entry.slice(0, entry.indexOf(':')), entry.slice(entry.indexOf(':') + 1)]
    if (verifyAgainstHash(candidate, rest) && !matched) matched = asRole(prefix)
  }
  return matched
}

export const verifySitePassword = (candidate: string) => siteAccessRole(candidate) !== null

export function safeReturnPath(value: FormDataEntryValue | null) {
  const path = String(value ?? '/')
  return path.startsWith('/') && !path.startsWith('//') ? path : '/'
}
