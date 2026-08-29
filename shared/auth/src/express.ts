/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import express, { type ErrorRequestHandler, type Request, type RequestHandler } from 'express'
import { randomUUID } from 'node:crypto'
import { canAccessFounderOs } from './index.js'
import type { AuthIdentity, Role } from './index.js'
import { AuthError, type AuthService } from './core.js'
import { authFailure, authSuccess, getDeviceFingerprint, refreshCookie } from './http.js'

interface AuthRouterOptions {
  service: AuthService
  production: boolean
  allowedRoles: Role[]
  deliverPasswordReset?: (email: string, resetToken: string) => Promise<void>
}

const readCookie = (req: Request, name: string) => req.headers.cookie
  ?.split(';')
  .map((part) => part.trim().split('='))
  .find(([cookieName]) => cookieName === name)?.[1]

const context = (req: Request) => ({
  deviceFingerprint: getDeviceFingerprint(req.headers),
  ipAddress: req.ip,
})

const bearerToken = (req: Request) => {
  const authorization = req.header('authorization') || ''
  return authorization.startsWith('Bearer ') ? authorization.slice(7) : ''
}

export const createAccessMiddleware = (service: AuthService, allowedRoles?: Role[]): RequestHandler => (req, res, next) => {
  try {
    const identity = service.verifyAccessToken(bearerToken(req))
    if (allowedRoles && identity.role !== 'founder_master' && !allowedRoles.includes(identity.role)) return res.status(403).json(authFailure('Access denied'))
    res.locals.auth = identity
    next()
  } catch (error) {
    const status = error instanceof AuthError ? error.status : 401
    res.status(status).json(authFailure('Authentication required'))
  }
}

export const createModuleAccessMiddleware = (module: string, founderApiUrl = process.env.FOUNDER_API_URL || 'http://127.0.0.1:3210/api/v1'): RequestHandler => async (req, res, next) => {
  const identity = res.locals.auth as AuthIdentity | undefined
  if (!identity) return res.status(401).json(authFailure('Authentication required'))
  if (canAccessFounderOs(identity)) return next()
  if (!identity.tenantId) return res.status(403).json(authFailure('Tenant context required'))
  try {
    const response = await fetch(`${founderApiUrl.replace(/\/+$/, '')}/module-access/${encodeURIComponent(identity.tenantId)}/${encodeURIComponent(module)}`, {
      headers: { Authorization: req.header('authorization') || '' },
      signal: AbortSignal.timeout(5_000),
    })
    const body = await response.json().catch(() => ({ allowed: false })) as { allowed?: boolean }
    if (!response.ok || !body.allowed) return res.status(403).json(authFailure(`${module} access is disabled for this company`))
    next()
  } catch {
    res.status(503).json(authFailure('Company access service unavailable'))
  }
}

export const createAuthRouter = ({ service, production, allowedRoles, deliverPasswordReset }: AuthRouterOptions) => {
  const router = express.Router()
  const cookieOptions = refreshCookie.options(production)
  const requireAccess = createAccessMiddleware(service, allowedRoles)
  const currentUser = (req: Request, res: express.Response) => {
    const identity = res.locals.auth as AuthIdentity
    return res.json({ success: true, valid: true, user: identity, session: { user: identity } })
  }

  router.post('/lookup', async (req, res) => res.json({ success: true, local: await service.hasActiveIdentity(req.body?.email) }))

  router.get('/me', requireAccess, currentUser)
  router.get('/user', requireAccess, currentUser)
  router.get('/session', requireAccess, currentUser)
  router.get('/validate', requireAccess, currentUser)

  router.post('/login', async (req, res) => {
    try {
      const result = await service.login(req.body || {}, context(req))
      if (!allowedRoles.includes(result.user.role)) {
        await service.logout(result.refreshToken)
        return res.status(403).json(authFailure('Access denied'))
      }
      res.cookie(refreshCookie.name, result.refreshToken, cookieOptions)
      return res.json(authSuccess(result))
    } catch (error) {
      const status = error instanceof AuthError ? error.status : 500
      if (status === 500) console.error('[auth] LOGIN FAILED', error instanceof Error ? error.message : 'Unknown authentication error')
      return res.status(status).json(authFailure(status === 500 ? 'Authentication unavailable' : (error as Error).message))
    }
  })

  router.post('/refresh', async (req, res) => {
    try {
      const token = readCookie(req, refreshCookie.name) || req.header('x-refresh-token') || req.body?.refreshToken
      const result = await service.refresh(token, context(req))
      if (!allowedRoles.includes(result.user.role)) throw new AuthError('Access denied', 403)
      res.cookie(refreshCookie.name, result.refreshToken, cookieOptions)
      return res.json(authSuccess(result))
    } catch (error) {
      res.clearCookie(refreshCookie.name, cookieOptions)
      const status = error instanceof AuthError ? error.status : 500
      return res.status(status).json(authFailure(status === 500 ? 'Authentication unavailable' : (error as Error).message))
    }
  })

  router.post('/logout', async (req, res) => {
    await service.logout(readCookie(req, refreshCookie.name) || req.header('x-refresh-token'))
    res.clearCookie(refreshCookie.name, cookieOptions)
    return res.json({ success: true })
  })

  router.post('/password/forgot', async (req, res) => {
    try {
      const result = await service.createPasswordReset(req.body?.email)
      if (result.resetToken && deliverPasswordReset) await deliverPasswordReset(String(req.body.email), result.resetToken)
      return res.json({ success: true, message: 'If the account exists, reset instructions have been sent' })
    } catch (error) {
      const status = error instanceof AuthError ? error.status : 500
      return res.status(status).json(authFailure(status === 500 ? 'Reset unavailable' : (error as Error).message))
    }
  })

  router.post('/password/reset', async (req, res) => {
    try {
      await service.resetPassword(String(req.body?.resetToken || ''), req.body?.newPassword)
      return res.json({ success: true })
    } catch (error) {
      const status = error instanceof AuthError ? error.status : 500
      return res.status(status).json(authFailure(status === 500 ? 'Reset unavailable' : (error as Error).message))
    }
  })

  router.post('/password/change', requireAccess, async (req, res) => {
    try {
      const identity = res.locals.auth as AuthIdentity
      await service.changeOwnPassword(identity.id, req.body?.currentPassword, req.body?.newPassword)
      res.clearCookie(refreshCookie.name, cookieOptions)
      return res.json({ success: true })
    } catch (error) {
      const status = error instanceof AuthError ? error.status : 500
      return res.status(status).json(authFailure(status === 500 ? 'Password change unavailable' : (error as Error).message))
    }
  })

  return router
}

export const createCorsOptions = (allowedOrigins: string[]) => ({
  origin(origin: string | undefined, callback: (error: Error | null, allow?: boolean) => void) {
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true)
    callback(new Error('Origin not allowed'))
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Device-Fingerprint', 'X-Refresh-Token', 'X-Tenant-Id'],
  optionsSuccessStatus: 204,
})

export const malformedJsonHandler: ErrorRequestHandler = (error, _req, res, next) => {
  if (error instanceof SyntaxError && 'body' in error) return res.status(400).json(authFailure('Malformed JSON body'))
  next(error)
}

export const requestContext: RequestHandler = (req, res, next) => {
  const requestId = req.header('x-request-id') || randomUUID()
  res.locals.requestId = requestId
  res.setHeader('X-Request-Id', requestId)
  next()
}

export const securityHeaders: RequestHandler = (_req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff')
  res.setHeader('X-Frame-Options', 'DENY')
  res.setHeader('Referrer-Policy', 'no-referrer')
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=(self)')
  res.setHeader('Content-Security-Policy', "default-src 'none'; frame-ancestors 'none'; base-uri 'none'; form-action 'self'")
  if (process.env.NODE_ENV === 'production') res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains')
  next()
}

type RateLimitOptions = { windowMs?: number; max?: number }
export const createRateLimit = ({ windowMs = 60_000, max = 120 }: RateLimitOptions = {}): RequestHandler => {
  const hits = new Map<string, { count: number; resetAt: number }>()
  return (req, res, next) => {
    const now = Date.now()
    const key = `${req.ip || 'unknown'}:${req.path.startsWith('/api/v1/auth') ? 'auth' : 'api'}`
    const current = hits.get(key)
    const entry = !current || current.resetAt <= now ? { count: 0, resetAt: now + windowMs } : current
    entry.count += 1
    hits.set(key, entry)
    res.setHeader('RateLimit-Limit', String(max))
    res.setHeader('RateLimit-Remaining', String(Math.max(0, max - entry.count)))
    res.setHeader('RateLimit-Reset', String(Math.ceil(entry.resetAt / 1000)))
    if (hits.size > 10_000) for (const [itemKey, value] of hits) if (value.resetAt <= now) hits.delete(itemKey)
    if (entry.count > max) return res.status(429).json(authFailure('Too many requests'))
    next()
  }
}

export const structuredErrorHandler: ErrorRequestHandler = (error, req, res, _next) => {
  const candidate = error as { status?: number; statusCode?: number; message?: string; code?: string }
  const status = Number(candidate.status || candidate.statusCode || (candidate.code === 'P2025' ? 404 : 500))
  const safeStatus = status >= 400 && status < 600 ? status : 500
  console.error(JSON.stringify({ timestamp: new Date().toISOString(), requestId: res.locals.requestId, method: req.method, path: req.originalUrl, userId: res.locals.auth?.id, tenantId: res.locals.auth?.tenantId, status: safeStatus, error: candidate.message || 'Unknown error' }))
  if (res.headersSent) return
  res.status(safeStatus).json({ success: false, message: safeStatus === 500 ? 'Internal server error' : candidate.message || 'Request failed', requestId: res.locals.requestId })
}

export const createPasswordResetWebhook = (url: string, app: string) => async (email: string, resetToken: string) => {
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ app, email, resetToken }),
  })
  if (!response.ok) throw new Error('Password reset delivery failed')
}

export const createAuthenticatedServiceProxy = (targetBaseUrl: string): RequestHandler => async (req, res, next) => {
  try {
    const target = `${targetBaseUrl.replace(/\/+$/, '')}${req.url}`
    const method = req.method.toUpperCase()
    const response = await fetch(target, {
      method,
      headers: { Authorization: req.header('authorization') || '', ...(req.header('x-tenant-id') ? { 'X-Tenant-Id': req.header('x-tenant-id')! } : {}), ...(method !== 'GET' && method !== 'HEAD' ? { 'Content-Type': 'application/json' } : {}) },
      body: method === 'GET' || method === 'HEAD' ? undefined : JSON.stringify(req.body || {}),
      signal: AbortSignal.timeout(10_000),
    })
    const contentType = response.headers.get('content-type') || 'application/json'
    const body = Buffer.from(await response.arrayBuffer())
    res.status(response.status).type(contentType).send(body)
  } catch (error) { next(error) }
}