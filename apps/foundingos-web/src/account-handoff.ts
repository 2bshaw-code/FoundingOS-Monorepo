import { createCipheriv, createDecipheriv, createHash, randomBytes } from 'node:crypto'

export const ACCOUNT_HANDOFF_COOKIE = 'foundingos_account_handoff'
export const ACCOUNT_HANDOFF_MAX_AGE = 120

const key = () => {
  const secret = process.env.SITE_ACCESS_SECRET?.trim()
  if (!secret || secret.length < 32) throw new Error('SITE_ACCESS_SECRET must contain at least 32 characters')
  return createHash('sha256').update(`account-handoff:${secret}`).digest()
}

export function sealAccountHandoff(email: string, refreshToken: string, fingerprint: string, now = Date.now()) {
  const iv = randomBytes(12)
  const cipher = createCipheriv('aes-256-gcm', key(), iv)
  const payload = JSON.stringify({ email, refreshToken, fingerprint, expiresAt: now + ACCOUNT_HANDOFF_MAX_AGE * 1000 })
  const ciphertext = Buffer.concat([cipher.update(payload, 'utf8'), cipher.final()])
  return [iv, cipher.getAuthTag(), ciphertext].map((part) => part.toString('base64url')).join('.')
}

export function openAccountHandoff(token: string | undefined, email: string, fingerprint: string, now = Date.now()) {
  if (!token) return null
  const secret = key()
  try {
    const parts = token.split('.')
    if (parts.length !== 3) return null
    const [iv, tag, ciphertext] = parts.map((part) => Buffer.from(part, 'base64url'))
    const decipher = createDecipheriv('aes-256-gcm', secret, iv)
    decipher.setAuthTag(tag)
    const value = JSON.parse(Buffer.concat([decipher.update(ciphertext), decipher.final()]).toString('utf8'))
    if (value.email !== email || value.fingerprint !== fingerprint || typeof value.expiresAt !== 'number' || value.expiresAt <= now || typeof value.refreshToken !== 'string' || !value.refreshToken) return null
    return value.refreshToken as string
  } catch {
    return null
  }
}
