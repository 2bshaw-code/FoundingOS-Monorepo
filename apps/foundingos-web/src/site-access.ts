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

// partner = trusted, full founder access; investor = view-only SuperDash.
export type SiteAccessRole = 'partner' | 'investor' | 'tester' | 'guest'
const ROLES: SiteAccessRole[] = ['partner', 'investor', 'tester', 'guest']
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
  // SITE_ACCESS_ROLE_PINS ("role:scrypt$salt$hash" entries) fixes a code to one role and overrides
  // every other list. It lets an issued code be narrowed (say, partner to tester) without editing
  // the secret lists it already appears in.
  let pinned: SiteAccessRole | null = null
  for (const entry of String(process.env.SITE_ACCESS_ROLE_PINS || '').split(';').map((value) => value.trim()).filter(Boolean)) {
    // A malformed pin is skipped rather than thrown: it must never lock every other code out.
    const separator = entry.indexOf(':')
    const role = separator > 0 ? entry.slice(0, separator) : ''
    if (!ROLES.includes(role as SiteAccessRole)) { console.error('[access] ignoring SITE_ACCESS_ROLE_PINS entry without a valid role'); continue }
    try {
      if (verifyAgainstHash(candidate, entry.slice(separator + 1))) pinned = role as SiteAccessRole
    } catch {
      console.error('[access] ignoring malformed SITE_ACCESS_ROLE_PINS entry')
    }
  }
  // Trusted partner codes (SITE_PARTNER_ACCESS_HASH, plain scrypt entries) win over any other match.
  for (const entry of String(process.env.SITE_PARTNER_ACCESS_HASH || '').split(';').map((value) => value.trim().replace(/^partner:/, '')).filter(Boolean)) {
    if (verifyAgainstHash(candidate, entry)) matched = 'partner'
  }
  for (const entry of entries) {
    const [prefix, rest] = entry.startsWith('scrypt$') ? ['guest', entry] : [entry.slice(0, entry.indexOf(':')), entry.slice(entry.indexOf(':') + 1)]
    if (verifyAgainstHash(candidate, rest) && !matched) matched = asRole(prefix)
  }
  return pinned ?? matched
}

export const verifySitePassword = (candidate: string) => siteAccessRole(candidate) !== null

export function safeReturnPath(value: FormDataEntryValue | null) {
  const path = String(value ?? '/')
  return path.startsWith('/') && !path.startsWith('//') ? path : '/'
}
