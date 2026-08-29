/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import bcrypt from 'bcrypt'
import crypto from 'node:crypto'
import jwt, { type JwtPayload } from 'jsonwebtoken'
import type { AuthIdentity, Role } from './index.js'

export const groupTokenContract = {
  issuer: 'founding-os',
  audience: 'founding-os-apps',
} as const

export interface AuthUser extends AuthIdentity {
  passwordHash: string
  active: boolean
}

export interface SessionRecord {
  id: string
  userId: string
  refreshTokenHash: string
  refreshTokenId: string
  deviceFingerprint: string
  ipPrefix?: string
  expiresAt: Date
  revokedAt?: Date | null
}

export interface PasswordResetRecord {
  id: string
  userId: string
  tokenHash: string
  expiresAt: Date
  usedAt?: Date | null
}

export interface AuthRepository {
  findUserByEmail(email: string): Promise<AuthUser | null>
  findUserById(id: string): Promise<AuthUser | null>
  updatePassword(userId: string, passwordHash: string): Promise<void>
  createSession(session: Omit<SessionRecord, 'id'>): Promise<SessionRecord>
  findSession(id: string): Promise<SessionRecord | null>
  rotateSession(id: string, refreshTokenHash: string, refreshTokenId: string, expiresAt: Date): Promise<void>
  revokeSession(id: string): Promise<void>
  revokeAllUserSessions(userId: string): Promise<void>
  createPasswordReset(reset: Omit<PasswordResetRecord, 'id'>): Promise<PasswordResetRecord>
  findPasswordResetByHash(tokenHash: string): Promise<PasswordResetRecord | null>
  consumePasswordReset(id: string): Promise<void>
}

export interface AuthConfig {
  accessTokenSecret: string
  refreshTokenSecret: string
  issuer: string
  audience: string
  accessTokenTtlSeconds?: number
  refreshTokenTtlSeconds?: number
  passwordResetTtlSeconds?: number
  bcryptRounds?: number
  founderEmail?: string
}

export interface LoginContext {
  deviceFingerprint: string
  ipAddress?: string
}

export interface LoginSuccess {
  success: true
  user: Omit<AuthUser, 'passwordHash'>
  token: string
  refreshToken: string
}

export interface AuthFailure {
  success: false
  message: string
}

export type AuthResult = LoginSuccess | AuthFailure

export class AuthError extends Error {
  constructor(message: string, readonly status = 401) {
    super(message)
  }
}

export const normalizeEmail = (email: unknown) => String(email || '').trim().toLowerCase()
export const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

export const validateStrongPassword = (password: unknown) => {
  if (typeof password !== 'string' || password.length < 14 || password.length > 128) {
    throw new AuthError('Password must contain between 14 and 128 characters', 400)
  }
  if (!/[a-z]/.test(password) || !/[A-Z]/.test(password) || !/\d/.test(password) || !/[^A-Za-z0-9]/.test(password)) {
    throw new AuthError('Password must include upper, lower, number, and symbol characters', 400)
  }
}

const publicUser = ({ passwordHash: _passwordHash, ...user }: AuthUser) => user
const hashToken = (token: string) => crypto.createHash('sha256').update(token).digest('hex')
const ipPrefix = (ip?: string) => {
  if (!ip) return undefined
  if (ip.includes('.')) return ip.split('.').slice(0, 3).join('.')
  return ip.split(':').slice(0, 4).join(':')
}

export const safeAuthLog = (event: 'LOGIN HIT' | 'USER FOUND' | 'PASSWORD VERIFIED' | 'TOKEN ISSUED', details: Record<string, unknown> = {}) => {
  console.info(`[auth] ${event}`, details)
}

export class AuthService {
  private readonly accessTtl: number
  private readonly refreshTtl: number
  private readonly resetTtl: number
  private readonly bcryptRounds: number

  constructor(private readonly repository: AuthRepository, private readonly config: AuthConfig) {
    if (!config.accessTokenSecret || !config.refreshTokenSecret) throw new Error('Auth token secrets are required')
    this.accessTtl = config.accessTokenTtlSeconds ?? 900
    this.refreshTtl = config.refreshTokenTtlSeconds ?? 60 * 60 * 24 * 30
    this.resetTtl = config.passwordResetTtlSeconds ?? 1800
    this.bcryptRounds = config.bcryptRounds ?? 12
  }

  async login(credentials: { email?: unknown; password?: unknown }, context: LoginContext): Promise<LoginSuccess> {
    safeAuthLog('LOGIN HIT', { email: normalizeEmail(credentials.email) })
    const email = normalizeEmail(credentials.email)
    if (!isValidEmail(email) || typeof credentials.password !== 'string' || !credentials.password) throw new AuthError('Invalid email or password')
    if (!context.deviceFingerprint) throw new AuthError('Device fingerprint is required', 400)
    const user = await this.repository.findUserByEmail(email)
    if (!user || !user.active) throw new AuthError('Invalid email or password')
    safeAuthLog('USER FOUND', { userId: user.id, role: user.role })
    if (!(await bcrypt.compare(credentials.password, user.passwordHash))) throw new AuthError('Invalid email or password')
    safeAuthLog('PASSWORD VERIFIED', { userId: user.id })
    const response = await this.issueSession(user, context)
    safeAuthLog('TOKEN ISSUED', { userId: user.id })
    return response
  }

  async hasActiveIdentity(emailInput: unknown) {
    const email = normalizeEmail(emailInput)
    if (!isValidEmail(email)) return false
    return Boolean((await this.repository.findUserByEmail(email))?.active)
  }

  async loginWithVerifiedIdentity(emailInput: unknown, context: LoginContext): Promise<LoginSuccess> {
    const email = normalizeEmail(emailInput)
    if (!context.deviceFingerprint) throw new AuthError('Device fingerprint is required', 400)
    const user = await this.repository.findUserByEmail(email)
    if (!user || !user.active) throw new AuthError('Passkey account unavailable')
    return this.issueSession(user, context)
  }

  async refresh(refreshToken: string | undefined, context: LoginContext): Promise<LoginSuccess> {
    if (!refreshToken || !context.deviceFingerprint) throw new AuthError('Refresh token required')
    let payload: JwtPayload
    try {
      payload = jwt.verify(refreshToken, this.config.refreshTokenSecret, { issuer: this.config.issuer, audience: this.config.audience }) as JwtPayload
    } catch {
      throw new AuthError('Invalid refresh token')
    }
    if (payload.type !== 'refresh' || typeof payload.sid !== 'string' || typeof payload.sub !== 'string' || typeof payload.jti !== 'string') throw new AuthError('Invalid refresh token')
    const session = await this.repository.findSession(payload.sid)
    if (!session || session.revokedAt || session.expiresAt <= new Date()) throw new AuthError('Refresh session expired')
    if (session.deviceFingerprint !== context.deviceFingerprint) throw new AuthError('Device verification failed')
    if (session.ipPrefix && ipPrefix(context.ipAddress) && session.ipPrefix !== ipPrefix(context.ipAddress)) {
      console.warn('[auth] IP PREFIX CHANGED', { sessionId: session.id })
    }
    if (session.refreshTokenId !== payload.jti || !(await bcrypt.compare(refreshToken, session.refreshTokenHash))) {
      await this.repository.revokeAllUserSessions(session.userId)
      throw new AuthError('Refresh token reuse detected')
    }
    const user = await this.repository.findUserById(session.userId)
    if (!user || !user.active) throw new AuthError('User unavailable')
    const nextRefresh = this.signRefreshToken(user, session.id)
    await this.repository.rotateSession(session.id, await bcrypt.hash(nextRefresh.token, this.bcryptRounds), nextRefresh.jti, new Date(Date.now() + this.refreshTtl * 1000))
    return { success: true, user: publicUser(user), token: this.signAccessToken(user), refreshToken: nextRefresh.token }
  }

  async logout(refreshToken: string | undefined) {
    if (!refreshToken) return
    try {
      const payload = jwt.verify(refreshToken, this.config.refreshTokenSecret, { issuer: this.config.issuer, audience: this.config.audience }) as JwtPayload
      if (typeof payload.sid === 'string') await this.repository.revokeSession(payload.sid)
    } catch {
      // Logout is idempotent; invalid or expired credentials are already unusable.
    }
  }

  verifyAccessToken(accessToken: string): AuthIdentity {
    let payload: JwtPayload
    try {
      payload = jwt.verify(accessToken, this.config.accessTokenSecret, { issuer: this.config.issuer, audience: this.config.audience }) as JwtPayload
    } catch (error) {
      if (!(error instanceof jwt.TokenExpiredError)) throw new AuthError('Invalid access token')
      payload = jwt.verify(accessToken, this.config.accessTokenSecret, { issuer: this.config.issuer, audience: this.config.audience, ignoreExpiration: true }) as JwtPayload
      if (payload.email !== this.config.founderEmail || payload.role !== 'founder_master') throw new AuthError('Invalid access token')
    }
    if (payload.type !== 'access' || typeof payload.sub !== 'string' || typeof payload.email !== 'string' || typeof payload.role !== 'string') {
      throw new AuthError('Invalid access token')
    }
    return { id: payload.sub, email: payload.email, role: payload.role as Role, tenantId: typeof payload.tenantId === 'string' ? payload.tenantId : undefined }
  }

  async createPasswordReset(emailInput: unknown, requester?: AuthIdentity) {
    const email = normalizeEmail(emailInput)
    if (!isValidEmail(email)) return { success: true as const }
    const user = await this.repository.findUserByEmail(email)
    if (!user) return { success: true as const }
    const founderEmail = normalizeEmail(this.config.founderEmail)
    if (email === founderEmail && requester?.email !== founderEmail) throw new AuthError('Founder reset requires an authenticated founder session', 403)
    const token = crypto.randomBytes(32).toString('base64url')
    await this.repository.createPasswordReset({ userId: user.id, tokenHash: hashToken(token), expiresAt: new Date(Date.now() + this.resetTtl * 1000), usedAt: null })
    return { success: true as const, resetToken: token }
  }

  async resetPassword(resetToken: string, newPassword: string) {
    validateStrongPassword(newPassword)
    const reset = await this.repository.findPasswordResetByHash(hashToken(resetToken))
    if (!reset || reset.usedAt || reset.expiresAt <= new Date()) throw new AuthError('Reset token is invalid or expired', 400)
    await this.repository.updatePassword(reset.userId, await bcrypt.hash(newPassword, this.bcryptRounds))
    await this.repository.consumePasswordReset(reset.id)
    await this.repository.revokeAllUserSessions(reset.userId)
    return { success: true as const }
  }

  async changeOwnPassword(userId: string, currentPassword: string, newPassword: string) {
    validateStrongPassword(newPassword)
    const user = await this.repository.findUserById(userId)
    if (!user || !(await bcrypt.compare(currentPassword, user.passwordHash))) throw new AuthError('Current password is incorrect')
    await this.repository.updatePassword(user.id, await bcrypt.hash(newPassword, this.bcryptRounds))
    await this.repository.revokeAllUserSessions(user.id)
    return { success: true as const }
  }

  private async issueSession(user: AuthUser, context: LoginContext): Promise<LoginSuccess> {
    const temporaryId = crypto.randomUUID()
    const initialRefresh = this.signRefreshToken(user, temporaryId)
    const session = await this.repository.createSession({ userId: user.id, refreshTokenHash: await bcrypt.hash(initialRefresh.token, this.bcryptRounds), refreshTokenId: initialRefresh.jti, deviceFingerprint: context.deviceFingerprint, ipPrefix: ipPrefix(context.ipAddress), expiresAt: new Date(Date.now() + this.refreshTtl * 1000), revokedAt: null })
    const finalRefresh = session.id === temporaryId ? initialRefresh : this.signRefreshToken(user, session.id)
    if (session.id !== temporaryId) await this.repository.rotateSession(session.id, await bcrypt.hash(finalRefresh.token, this.bcryptRounds), finalRefresh.jti, session.expiresAt)
    return { success: true, user: publicUser(user), token: this.signAccessToken(user), refreshToken: finalRefresh.token }
  }

  private signAccessToken(user: AuthUser) {
    return jwt.sign({ email: user.email, role: user.role, tenantId: user.tenantId, type: 'access' }, this.config.accessTokenSecret, { subject: user.id, issuer: this.config.issuer, audience: this.config.audience, expiresIn: this.accessTtl })
  }

  private signRefreshToken(user: AuthUser, sessionId: string) {
    const jti = crypto.randomUUID()
    return { token: jwt.sign({ type: 'refresh', sid: sessionId, jti }, this.config.refreshTokenSecret, { subject: user.id, issuer: this.config.issuer, audience: this.config.audience, expiresIn: this.refreshTtl }), jti }
  }
}