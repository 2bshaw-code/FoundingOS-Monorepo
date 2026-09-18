import { createHmac, scryptSync, timingSafeEqual } from 'node:crypto'

export const SITE_ACCESS_COOKIE = 'foundingos_site_access'
export const SITE_ACCESS_MAX_AGE = 60 * 60 * 24 * 7
export const SITE_ACCESS_VALUE = 'granted'

const requiredSecret = () => {
  const secret = process.env.SITE_ACCESS_SECRET?.trim()
  if (!secret || secret.length < 32) throw new Error('SITE_ACCESS_SECRET must contain at least 32 characters')
  return secret
}

export const signSiteAccess = () => createHmac('sha256', requiredSecret()).update(SITE_ACCESS_VALUE).digest('hex')

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
