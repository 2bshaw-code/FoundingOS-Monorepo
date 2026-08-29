/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import cors from 'cors'
import express from 'express'
import { createCorsOptions, malformedJsonHandler, requestContext, securityHeaders, structuredErrorHandler } from '@founder-os/auth'
import { apiRouter } from './routes.js'

const app = express()
const port = Number(process.env.PORT || 5000)
const defaultOrigins = 'http://foundtalent.frontend.local,http://founder-os.frontend.local,http://foundretail.frontend.local,http://foundcrypto.frontend.local,http://foundit.frontend.local,http://foundmeat.frontend.local,http://localhost:3000,http://127.0.0.1:3000,http://localhost:3001,http://127.0.0.1:3001,http://localhost:3002,http://127.0.0.1:3002,http://localhost:3003,http://127.0.0.1:3003,http://localhost:3004,http://127.0.0.1:3004,http://localhost:3005,http://127.0.0.1:3005'
const allowedOrigins = (process.env.CORS_ORIGINS || defaultOrigins).split(',').map((value) => value.trim()).filter(Boolean)

app.use(requestContext)
app.use(securityHeaders)
app.options('/{*path}', cors(createCorsOptions(allowedOrigins)))
app.use(cors(createCorsOptions(allowedOrigins)))
app.use(express.json())
app.use(malformedJsonHandler)
app.get('/health', (_req, res) => res.json({ app: 'foundtalent', status: 'ok' }))
app.use('/api/v1', apiRouter)
app.use(structuredErrorHandler)
app.listen(port, () => console.log(`FoundTalent API listening on ${port}`))
