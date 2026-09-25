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
const defaultOrigins = 'http://core_workforce.frontend.local,http://founder-os.frontend.local,http://core_operations.frontend.local,http://core_intelligence.frontend.local,http://localhost:3000,http://127.0.0.1:3000,http://localhost:3003,http://127.0.0.1:3003,http://localhost:3004,http://127.0.0.1:3004,http://localhost:3005,http://127.0.0.1:3005'
if (process.env.NODE_ENV === 'production' && !process.env.CORS_ORIGINS) throw new Error('CORS_ORIGINS is required in production')
const allowedOrigins = (process.env.CORS_ORIGINS || defaultOrigins).split(',').map((value) => value.trim()).filter(Boolean)
if (process.env.NODE_ENV === 'production') app.set('trust proxy', 1)
app.use(requestContext)
app.use(securityHeaders)
app.options('/{*path}', cors(createCorsOptions(allowedOrigins)))
app.use(cors(createCorsOptions(allowedOrigins)))
app.use(express.json({ verify: (req, _res, buffer) => { (req as Request & { rawBody?: Buffer }).rawBody = Buffer.from(buffer) } }))
app.use(malformedJsonHandler)
app.get('/health', (_req, res) => res.json({ app: 'core_workforce', suite: 'workforce', status: 'ok' }))
// Phase 31 — readiness check, distinct from /health (see core-operations/app.ts
// for the same pattern).
app.get('/ready', async (_req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`
    res.json({ app: 'core_workforce', status: 'ready', dependencies: { database: true } })
  } catch {
    res.status(503).json({ app: 'core_workforce', status: 'not_ready', dependencies: { database: false } })
  }
})
app.use('/api/v1/auth', createRateLimit({ windowMs: 15 * 60_000, max: 20 }))
app.use('/api/v1', createRateLimit({ max: 240 }))
app.use('/api/v1/auth', authRouter)
app.use('/api/v1/workforce', apiRouter)
app.use(structuredErrorHandler)
