/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import cors from 'cors'
import express from 'express'
import { createCorsOptions, createRateLimit, malformedJsonHandler, requestContext, securityHeaders, structuredErrorHandler } from '@founder-os/auth'
import { authRouter } from './auth.js'
import { apiRouter } from './routes.js'
import { prisma } from './auth.js'
import { scraperStatus, startScrapeScheduler } from './scrapeScheduler.js'

const app = express()
const port = Number(process.env.PORT || 4003)
const defaultOrigins = 'http://foundit.frontend.local,http://founder-os.frontend.local,http://foundretail.frontend.local,http://foundcrypto.frontend.local,http://foundmeat.frontend.local,http://foundtalent.frontend.local,http://localhost:3000,http://127.0.0.1:3000,http://localhost:3001,http://127.0.0.1:3001,http://localhost:3002,http://127.0.0.1:3002,http://localhost:3003,http://127.0.0.1:3003,http://localhost:3004,http://127.0.0.1:3004,http://localhost:3005,http://127.0.0.1:3005'
if (process.env.NODE_ENV === 'production' && !process.env.CORS_ORIGINS) throw new Error('CORS_ORIGINS is required in production')
const allowedOrigins = (process.env.CORS_ORIGINS || defaultOrigins).split(',').map((value) => value.trim()).filter(Boolean)
if (process.env.NODE_ENV === 'production') app.set('trust proxy', 1)
app.use(requestContext)
app.use(securityHeaders)
app.options('/{*path}', cors(createCorsOptions(allowedOrigins)))
app.use(cors(createCorsOptions(allowedOrigins)))
app.use(express.json())
app.use(malformedJsonHandler)
app.get('/health', async (_req, res) => {
	let database = false
	let foundretail = false
	try { await prisma.$queryRaw`SELECT 1`; database = true } catch { database = false }
	try { const response = await fetch(`${(process.env.FOUNDRETAIL_API_URL || 'http://127.0.0.1:4001/api/v1').replace(/\/api\/v1\/?$/, '')}/health`, { signal: AbortSignal.timeout(3_000) }); foundretail = response.ok } catch { foundretail = false }
	const scraping = await scraperStatus().catch(() => null)
	res.json({ app: 'foundit', status: database ? 'ok' : 'degraded', dependencies: { database, foundretail }, scraping: scraping ? { enabled: scraping.enabled, running: scraping.running, categories: scraping.categories, metrics: scraping.metrics } : null })
})
app.use('/api/v1/auth', createRateLimit({ windowMs: 15 * 60_000, max: 20 }))
app.use('/api/v1/it/auth', createRateLimit({ windowMs: 15 * 60_000, max: 20 }))
app.use('/api/v1', createRateLimit({ max: 240 }))
app.use('/api/v1/auth', authRouter)
app.use('/api/v1/it/auth', authRouter)
app.use('/api/v1', apiRouter)
app.use(structuredErrorHandler)
app.listen(port, async () => {
	console.log(`FoundThis API listening on ${port}`)
	try { console.log('[scraper] scheduler', await startScrapeScheduler()) } catch (error) { console.error('[scraper] scheduler failed', error instanceof Error ? error.message : error) }
})
