/*
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import cors from 'cors'
import express from 'express'
import type { Request } from 'express'
import { createCorsOptions, createRateLimit, malformedJsonHandler, requestContext, securityHeaders, structuredErrorHandler } from '@founder-os/auth'
import { authRouter, prisma } from './auth.js'
import { apiRouter } from './routes.js'

export const app = express()
const defaultOrigins = 'http://core_intelligence.frontend.local,http://founder-os.frontend.local,http://core_operations.frontend.local,http://core_workforce.frontend.local,http://localhost:3000,http://127.0.0.1:3000,http://localhost:3002,http://127.0.0.1:3002,http://localhost:3003,http://127.0.0.1:3003,http://localhost:3005,http://127.0.0.1:3005'
if (process.env.NODE_ENV === 'production' && !process.env.CORS_ORIGINS) throw new Error('CORS_ORIGINS is required in production')
const allowedOrigins = (process.env.CORS_ORIGINS || defaultOrigins).split(',').map((value) => value.trim()).filter(Boolean)
if (process.env.NODE_ENV === 'production') app.set('trust proxy', 1)
app.use(requestContext)
app.use(securityHeaders)
app.options('/{*path}', cors(createCorsOptions(allowedOrigins)))
app.use(cors(createCorsOptions(allowedOrigins)))
app.use(express.json({ verify: (req, _res, buffer) => { (req as Request & { rawBody?: Buffer }).rawBody = Buffer.from(buffer) } }))
app.use(malformedJsonHandler)
app.get('/health', async (_req, res) => {
  let database = false
  let core_operations = false
  try { await prisma.$queryRaw`SELECT 1`; database = true } catch { database = false }
  try {
    const response = await fetch(`${(process.env.CORE_OPERATIONS_API_URL || 'http://127.0.0.1:4001/api/v1/ops').replace(/\/api\/v1\/ops\/?$/, '')}/health`, { signal: AbortSignal.timeout(3_000) })
    core_operations = response.ok
  } catch { core_operations = false }
  res.json({ app: 'core_intelligence', suite: 'intelligence', status: database ? 'ok' : 'degraded', dependencies: { database, core_operations } })
})
app.use('/api/v1/auth', createRateLimit({ windowMs: 15 * 60_000, max: 20 }))
app.use('/api/v1', createRateLimit({ max: 240 }))
app.use('/api/v1/auth', authRouter)
app.use('/api/v1/core', apiRouter)
app.use('/api/v1/int', apiRouter)
app.use(structuredErrorHandler)
