/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import assert from 'node:assert/strict'
import test from 'node:test'
import bcrypt from 'bcrypt'
import { AuthError, AuthService, roles, type AuthRepository, type AuthUser, type PasswordResetRecord, type Role, type SessionRecord } from '../src/index.js'
import { createAuthClient } from '../src/client.js'

class MemoryRepository implements AuthRepository {
  users = new Map<string, AuthUser>()
  sessions = new Map<string, SessionRecord>()
  resets = new Map<string, PasswordResetRecord>()

  async findUserByEmail(email: string) { return [...this.users.values()].find((user) => user.email === email) || null }
  async findUserById(id: string) { return this.users.get(id) || null }
  async updatePassword(userId: string, passwordHash: string) { this.users.get(userId)!.passwordHash = passwordHash }
  async createSession(session: Omit<SessionRecord, 'id'>) { const record = { ...session, id: crypto.randomUUID() }; this.sessions.set(record.id, record); return record }
  async findSession(id: string) { return this.sessions.get(id) || null }
  async rotateSession(id: string, refreshTokenHash: string, refreshTokenId: string, expiresAt: Date) { Object.assign(this.sessions.get(id)!, { refreshTokenHash, refreshTokenId, expiresAt }) }
  async revokeSession(id: string) { this.sessions.get(id)!.revokedAt = new Date() }
  async revokeAllUserSessions(userId: string) { for (const session of this.sessions.values()) if (session.userId === userId) session.revokedAt = new Date() }
  async createPasswordReset(reset: Omit<PasswordResetRecord, 'id'>) { const record = { ...reset, id: crypto.randomUUID() }; this.resets.set(record.id, record); return record }
  async findPasswordResetByHash(tokenHash: string) { return [...this.resets.values()].find((reset) => reset.tokenHash === tokenHash) || null }
  async consumePasswordReset(id: string) { this.resets.get(id)!.usedAt = new Date() }
}

const createFixture = async (role: Role = roles.founderMaster) => {
  const repository = new MemoryRepository()
  repository.users.set('user-1', { id: 'user-1', email: 'bobby@founder.master', role, active: true, passwordHash: await bcrypt.hash('Valid!Password2026', 4) })
  const service = new AuthService(repository, {
    accessTokenSecret: 'a'.repeat(64),
    refreshTokenSecret: 'b'.repeat(64),
    issuer: 'test-app',
    audience: 'test-users',
    bcryptRounds: 4,
    founderEmail: 'bobby@founder.master',
  })
  return { repository, service }
}

const context = { deviceFingerprint: 'device-123', ipAddress: '192.168.10.24' }

test('login issues verifiable access and persistent refresh sessions', async () => {
  const { repository, service } = await createFixture()
  const result = await service.login({ email: 'BOBBY@FOUNDER.MASTER', password: 'Valid!Password2026' }, context)
  assert.equal(result.success, true)
  assert.equal(service.verifyAccessToken(result.token).email, 'bobby@founder.master')
  assert.equal(repository.sessions.size, 1)
  assert.equal('passwordHash' in result.user, false)
})

test('refresh rotates tokens and reuse revokes all sessions', async () => {
  const { repository, service } = await createFixture()
  const login = await service.login({ email: 'bobby@founder.master', password: 'Valid!Password2026' }, context)
  const refreshed = await service.refresh(login.refreshToken, context)
  assert.notEqual(refreshed.refreshToken, login.refreshToken)
  await assert.rejects(() => service.refresh(login.refreshToken, context), /reuse detected/)
  assert.equal([...repository.sessions.values()].every((session) => session.revokedAt instanceof Date), true)
})

test('logout revokes the server-side refresh session', async () => {
  const { repository, service } = await createFixture()
  const login = await service.login({ email: 'bobby@founder.master', password: 'Valid!Password2026' }, context)
  await service.logout(login.refreshToken)
  assert.equal([...repository.sessions.values()][0].revokedAt instanceof Date, true)
  await assert.rejects(() => service.refresh(login.refreshToken, context), /expired/)
})

test('password reset enforces strength and founder self-service', async () => {
  const { repository, service } = await createFixture()
  await assert.rejects(() => service.createPasswordReset('bobby@founder.master'), (error: AuthError) => error.status === 403)
  const reset = await service.createPasswordReset('bobby@founder.master', { id: 'user-1', email: 'bobby@founder.master', role: roles.founderMaster })
  await assert.rejects(() => service.resetPassword(reset.resetToken!, 'weak'), /between 14 and 128/)
  await service.resetPassword(reset.resetToken!, 'New!FounderPassword2026')
  assert.equal(await bcrypt.compare('New!FounderPassword2026', repository.users.get('user-1')!.passwordHash), true)
})

test('browser client stores access token, auto-refreshes once, and clears on logout', async () => {
  const storage = new Map<string, string>()
  const accessToken = (id: number) => `header.${Buffer.from(JSON.stringify({ type: 'access', exp: Math.floor(Date.now() / 1000) + 60, id })).toString('base64url')}.signature`
  const firstAccessToken = accessToken(1)
  const secondAccessToken = accessToken(2)
  Object.defineProperty(globalThis, 'localStorage', { configurable: true, value: { getItem: (key: string) => storage.get(key) || null, setItem: (key: string, value: string) => storage.set(key, value), removeItem: (key: string) => storage.delete(key) } })
  let resourceCalls = 0
  const calls: string[] = []
  const authorizationHeaders: Array<string | null> = []
  Object.defineProperty(globalThis, 'fetch', { configurable: true, value: async (input: string | URL | Request, init?: RequestInit) => {
    const url = String(input)
    calls.push(url)
    if (url.endsWith('/auth/login')) return Response.json({ success: true, user: { id: '1', email: 'manager@example.com', role: 'retail_manager' }, token: firstAccessToken, refreshToken: 'cookie-token' })
    if (url.endsWith('/auth/refresh')) return Response.json({ success: true, user: { id: '1', email: 'manager@example.com', role: 'retail_manager' }, token: secondAccessToken, refreshToken: 'rotated-cookie-token' })
    if (url.endsWith('/auth/logout')) return Response.json({ success: true })
    if (url.endsWith('/protected')) { authorizationHeaders.push(new Headers(init?.headers).get('Authorization')); resourceCalls += 1; return resourceCalls === 1 ? Response.json({ success: false, message: 'expired' }, { status: 401 }) : Response.json({ success: true, value: 42 }) }
    return Response.json({ success: false }, { status: 404 })
  } })
  const client = createAuthClient({ baseUrl: 'http://localhost:9999/api/v1', storageKey: 'test' })
  await client.login('manager@example.com', 'Valid!Password2026')
  assert.equal(client.getAccessToken(), firstAccessToken)
  assert.equal(client.getRefreshToken(), 'cookie-token')
  assert.deepEqual(await client.request('/protected'), { success: true, value: 42 })
  assert.equal(client.getAccessToken(), secondAccessToken)
  assert.equal(client.getRefreshToken(), 'rotated-cookie-token')
  assert.deepEqual(authorizationHeaders, [`Bearer ${firstAccessToken}`, `Bearer ${secondAccessToken}`])
  await client.logout()
  assert.equal(client.getAccessToken(), null)
  assert.equal(client.getRefreshToken(), null)
  assert.equal(calls.filter((url) => url.endsWith('/auth/refresh')).length, 1)
})

test('Founder login, refresh, and logout stay anchored to FoundingOS from product apps', async () => {
  const storage = new Map<string, string>()
  Object.defineProperty(globalThis, 'localStorage', { configurable: true, value: { getItem: (key: string) => storage.get(key) || null, setItem: (key: string, value: string) => storage.set(key, value), removeItem: (key: string) => storage.delete(key) } })
  const calls: string[] = []
  Object.defineProperty(globalThis, 'fetch', { configurable: true, value: async (input: string | URL | Request) => {
    const url = String(input)
    calls.push(url)
    return Response.json({ success: true, user: { id: 'founder-1', email: 'bobby@founder.master', role: 'founder_master' }, token: 'group-access', refreshToken: 'founder-refresh' })
  } })
  const client = createAuthClient({ baseUrl: 'http://localhost:3220/api/v1', founderAuthUrl: 'http://localhost:3210/api/v1', storageKey: 'foundretail-test' })
  await client.login('bobby@founder.master', 'Valid!Password2026')
  await client.refresh()
  await client.logout()
  assert.deepEqual(calls, [
    'http://localhost:3210/api/v1/auth/login',
    'http://localhost:3210/api/v1/auth/refresh',
    'http://localhost:3210/api/v1/auth/logout',
  ])
})

test('FoundingOS and product roles use the same login contract', async () => {
  for (const role of [roles.founderMaster, roles.retailManager, roles.retailStaff, roles.meatSupplier]) {
    const { service } = await createFixture(role)
    const result = await service.login({ email: 'bobby@founder.master', password: 'Valid!Password2026' }, context)
    assert.deepEqual(Object.keys(result).sort(), ['refreshToken', 'success', 'token', 'user'])
    assert.equal(result.user.role, role)
  }
})

test('group access tokens verify across apps while foreign contracts are rejected', async () => {
  const { service } = await createFixture(roles.founderMaster)
  const login = await service.login({ email: 'bobby@founder.master', password: 'Valid!Password2026' }, context)
  const productApp = new AuthService(new MemoryRepository(), {
    accessTokenSecret: 'a'.repeat(64),
    refreshTokenSecret: 'c'.repeat(64),
    issuer: 'test-app',
    audience: 'test-users',
    bcryptRounds: 4,
  })
  assert.equal(productApp.verifyAccessToken(login.token).role, roles.founderMaster)
  const otherApp = new AuthService(new MemoryRepository(), {
    accessTokenSecret: 'a'.repeat(64),
    refreshTokenSecret: 'b'.repeat(64),
    issuer: 'other-app',
    audience: 'other-users',
    bcryptRounds: 4,
  })
  assert.throws(() => otherApp.verifyAccessToken(login.token), /Invalid access token/)
})

test('device fingerprints are enforced while IP prefix changes are tolerated', async () => {
  const { service } = await createFixture()
  const login = await service.login({ email: 'bobby@founder.master', password: 'Valid!Password2026' }, context)
  await assert.rejects(() => service.refresh(login.refreshToken, { ...context, deviceFingerprint: 'different-device' }), /Device verification failed/)
  const refreshed = await service.refresh(login.refreshToken, { ...context, ipAddress: '10.40.8.12' })
  assert.equal(refreshed.success, true)
})
