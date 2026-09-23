/*
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { createCipheriv, createDecipheriv, randomBytes, timingSafeEqual } from 'node:crypto'
import { roles } from '@foundingos/service-auth'

export type EncryptedCredentials = {
  credentialsCiphertext: string
  credentialsIv: string
  credentialsTag: string
}

const encryptionKey = () => {
  const configured = process.env.INTEGRATION_ENCRYPTION_KEY
  if (!configured) throw Object.assign(new Error('INTEGRATION_ENCRYPTION_KEY is required to store provider credentials'), { status: 503 })
  const key = /^[0-9a-f]{64}$/i.test(configured) ? Buffer.from(configured, 'hex') : Buffer.from(configured, 'base64')
  if (key.length !== 32) throw Object.assign(new Error('INTEGRATION_ENCRYPTION_KEY must decode to exactly 32 bytes'), { status: 500 })
  return key
}

export function encryptIntegrationCredentials(credentials: Record<string, unknown>): EncryptedCredentials {
  const iv = randomBytes(12)
  const cipher = createCipheriv('aes-256-gcm', encryptionKey(), iv)
  const ciphertext = Buffer.concat([cipher.update(JSON.stringify(credentials), 'utf8'), cipher.final()])
  return {
    credentialsCiphertext: ciphertext.toString('base64'),
    credentialsIv: iv.toString('base64'),
    credentialsTag: cipher.getAuthTag().toString('base64'),
  }
}

export function decryptIntegrationCredentials(record: EncryptedCredentials) {
  const decipher = createDecipheriv('aes-256-gcm', encryptionKey(), Buffer.from(record.credentialsIv, 'base64'))
  decipher.setAuthTag(Buffer.from(record.credentialsTag, 'base64'))
  const plaintext = Buffer.concat([decipher.update(Buffer.from(record.credentialsCiphertext, 'base64')), decipher.final()]).toString('utf8')
  return JSON.parse(plaintext) as Record<string, unknown>
}

export function verifyBootstrapToken(candidate: string | undefined) {
  const configured = process.env.PLATFORM_BOOTSTRAP_TOKEN
  if (!configured || !candidate) return false
  const expected = Buffer.from(configured)
  const provided = Buffer.from(candidate)
  return expected.length === provided.length && timingSafeEqual(expected, provided)
}

export function roleCanAccessWorkspace(role: string, permissions: unknown, workspace: string) {
  const privilegedRoles = new Set<string>([roles.founderMaster, roles.businessOwner, roles.businessManager, roles.retailManager])
  if (privilegedRoles.has(role)) return true
  const permissionMap = permissions && typeof permissions === 'object' && !Array.isArray(permissions) ? permissions as Record<string, unknown> : {}
  const allowed = Array.isArray(permissionMap.workspaces) ? permissionMap.workspaces.map(String) : []
  return allowed.includes(workspace)
}

export function isActiveIdempotencyRecord(record: { expiresAt: Date } | null, now = new Date()) {
  return Boolean(record && record.expiresAt > now)
}

export function assertExpectedVersion(expected: unknown, current: number) {
  if (expected !== undefined && Number(expected) !== current) {
    throw Object.assign(new Error('Record changed since it was loaded'), { status: 409 })
  }
}
