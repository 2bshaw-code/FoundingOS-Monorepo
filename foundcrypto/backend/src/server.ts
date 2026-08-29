/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import cors from 'cors'
import express from 'express'
import type { Request } from 'express'
import { createCorsOptions, createRateLimit, malformedJsonHandler, requestContext, securityHeaders, structuredErrorHandler } from '@founder-os/auth'
import { authRouter } from './auth.js'
import { apiRouter } from './routes.js'

const app = express()
const port = Number(process.env.PORT || 4002)
const defaultOrigins = 'http://foundcrypto.frontend.local,http://founder-os.frontend.local,http://foundretail.frontend.local,http://foundit.frontend.local,http://foundmeat.frontend.local,http://foundtalent.frontend.local,http://localhost:3000,http://127.0.0.1:3000,http://localhost:3001,http://127.0.0.1:3001,http://localhost:3002,http://127.0.0.1:3002,http://localhost:3003,http://127.0.0.1:3003,http://localhost:3004,http://127.0.0.1:3004,http://localhost:3005,http://127.0.0.1:3005'
if (process.env.NODE_ENV === 'production' && !process.env.CORS_ORIGINS) throw new Error('CORS_ORIGINS is required in production')
const allowedOrigins = (process.env.CORS_ORIGINS || defaultOrigins).split(',').map((value) => value.trim()).filter(Boolean)
if (process.env.NODE_ENV === 'production') app.set('trust proxy', 1)
app.use(requestContext)
app.use(securityHeaders)
app.options('/{*path}', cors(createCorsOptions(allowedOrigins)))
app.use(cors(createCorsOptions(allowedOrigins)))
app.use(express.json({ verify: (req, _res, buffer) => { (req as Request & { rawBody?: Buffer }).rawBody = Buffer.from(buffer) } }))
app.use(malformedJsonHandler)
app.get('/health', (_req, res) => res.json({ app: 'foundcrypto', status: 'ok' }))
app.use('/api/v1/auth', createRateLimit({ windowMs: 15 * 60_000, max: 20 }))
app.use('/api/v1/crypto/auth', createRateLimit({ windowMs: 15 * 60_000, max: 20 }))
app.use('/api/v1', createRateLimit({ max: 240 }))
app.use('/api/v1/auth', authRouter)
app.use('/api/v1/crypto/auth', authRouter)
app.use('/api/v1', apiRouter)
app.use(structuredErrorHandler)
app.listen(port, () => console.log(`FoundCrypto API listening on ${port}`))
