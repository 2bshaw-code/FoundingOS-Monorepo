/*
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import cors from 'cors'
import express from 'express'
import type { Request } from 'express'
import { createCorsOptions, createRateLimit, malformedJsonHandler, requestContext, securityHeaders, structuredErrorHandler } from '@foundingos/service-auth'
import { authRouter, prisma } from './auth.js'
import { apiRouter } from './routes.js'

export const app = express()
const defaultOrigins = 'http://core_operations.frontend.local,http://founder-os.frontend.local,http://core_intelligence.frontend.local,http://core_workforce.frontend.local,http://localhost:3000,http://127.0.0.1:3000,http://localhost:3002,http://127.0.0.1:3002,http://localhost:3003,http://127.0.0.1:3003,http://localhost:3005,http://127.0.0.1:3005'
if (process.env.NODE_ENV === 'production' && !process.env.CORS_ORIGINS) throw new Error('CORS_ORIGINS is required in production')
const allowedOrigins = (process.env.CORS_ORIGINS || defaultOrigins).split(',').map((value) => value.trim()).filter(Boolean)
if (process.env.NODE_ENV === 'production') app.set('trust proxy', 1)
app.use(requestContext)
app.use(securityHeaders)
app.options('/{*path}', cors(createCorsOptions(allowedOrigins)))
app.use(cors(createCorsOptions(allowedOrigins)))
app.use(express.json({ verify: (req, _res, buffer) => { (req as Request & { rawBody?: Buffer }).rawBody = Buffer.from(buffer) } }))
app.use(malformedJsonHandler)
app.get('/health', (_req, res) => res.json({ app: 'core_operations', suite: 'ops', status: 'ok' }))
// Phase 31 — readiness check: unlike /health (always cheap/instant liveness),
// this actually pings the database so orchestrators can distinguish "process
// is up" from "process can actually serve real requests".
app.get('/ready', async (_req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`
    res.json({ app: 'core_operations', status: 'ready', dependencies: { database: true } })
  } catch {
    res.status(503).json({ app: 'core_operations', status: 'not_ready', dependencies: { database: false } })
  }
})
// TEMPORARY: manual admin account reactivation, gated by a secret env var, used
// once to unlock a founder account that has no self-service recovery flow yet.
// Remove this route (and the ADMIN_RESET_TOKEN env var) once done. Password is
// left untouched — this only flips `active` back on and optionally sets `role`.
app.post('/admin/reactivate-user', createRateLimit({ windowMs: 15 * 60_000, max: 5 }), async (req, res) => {
  const token = req.header('x-admin-reset-token')
  if (!process.env.ADMIN_RESET_TOKEN || !token || token !== process.env.ADMIN_RESET_TOKEN) {
    res.status(404).json({ error: 'not found' })
    return
  }
  const { email, role } = (req.body ?? {}) as { email?: string; role?: string }
  if (!email) {
    res.status(400).json({ error: 'email is required' })
    return
  }
  try {
    const existing = await prisma.authUser.findUnique({ where: { email } })
    if (!existing) {
      res.status(404).json({ error: 'user not found' })
      return
    }
    const updated = await prisma.authUser.update({ where: { email }, data: { active: true, ...(role ? { role } : {}) } })
    res.json({ ok: true, role: updated.role, active: updated.active })
  } catch {
    res.status(500).json({ error: 'reactivation failed' })
  }
})
app.use('/api/v1/auth', createRateLimit({ windowMs: 15 * 60_000, max: 20 }))
app.use('/api/v1', createRateLimit({ max: 240 }))
app.use('/api/v1/auth', authRouter)
app.use('/api/v1/ops', apiRouter)
app.use(structuredErrorHandler)
