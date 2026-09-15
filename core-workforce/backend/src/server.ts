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
const defaultOrigins = 'http://core_workforce.frontend.local,http://founder-os.frontend.local,http://core_operations.frontend.local,http://core_intelligence.frontend.local,http://localhost:3000,http://127.0.0.1:3000,http://localhost:3002,http://127.0.0.1:3002,http://localhost:3003,http://127.0.0.1:3003,http://localhost:3005,http://127.0.0.1:3005'
const allowedOrigins = (process.env.CORS_ORIGINS || defaultOrigins).split(',').map((value) => value.trim()).filter(Boolean)

app.use(requestContext)
app.use(securityHeaders)
app.options('/{*path}', cors(createCorsOptions(allowedOrigins)))
app.use(cors(createCorsOptions(allowedOrigins)))
app.use(express.json())
app.use(malformedJsonHandler)
app.get('/health', (_req, res) => res.json({ app: 'core_workforce', status: 'ok' }))
app.use('/api/v1/work', apiRouter)
app.use(structuredErrorHandler)
app.listen(port, () => console.log(`CoreWorkforce API listening on ${port}`))
