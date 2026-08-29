/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { Router, type RequestHandler } from 'express'
import { createBobRouter } from '@founder-os/bob'
import { createAuthenticatedServiceProxy, createModuleAccessMiddleware } from '@founder-os/auth'
import { requireFoundMeatAccount, requireMeatOwnerAccess, requireTraderAccess } from './auth.js'
import { prisma } from './auth.js'

const requireTenant: RequestHandler = (_req, res, next) => {
  if (res.locals.auth?.role === 'founder_master') return next()
  if (!res.locals.auth?.tenantId) return res.status(403).json({ success: false, message: 'Tenant context required' })
  next()
}
const requireFoundMeatModule = createModuleAccessMiddleware('foundmeat')

export const apiRouter = Router()
apiRouter.use('/foundretail-operations', requireMeatOwnerAccess, requireTenant, requireFoundMeatModule, createAuthenticatedServiceProxy(process.env.FOUNDRETAIL_API_URL || 'http://127.0.0.1:4001/api/v1'))
apiRouter.use('/foundretail-merchant', requireTraderAccess, requireTenant, requireFoundMeatModule, createAuthenticatedServiceProxy(process.env.FOUNDRETAIL_API_URL || 'http://127.0.0.1:4001/api/v1'))
apiRouter.get('/status', (_req, res) => res.json({ app: 'foundmeat', status: 'operational' }))
apiRouter.use('/bob', requireFoundMeatAccount, requireFoundMeatModule, createBobRouter('foundmeat'))
apiRouter.get('/butchers', async (_req, res, next) => { try { res.json({ butchers: await prisma.meatTrader.findMany({ where: { type: 'butcher' }, include: { listings: true } }) }) } catch (error) { next(error) } })
apiRouter.get('/farms', async (_req, res, next) => { try { res.json({ farms: await prisma.meatTrader.findMany({ where: { type: 'farm' }, include: { listings: true } }) }) } catch (error) { next(error) } })
apiRouter.get('/merchants', async (_req, res, next) => { try { res.json({ merchants: await prisma.meatTrader.findMany({ include: { listings: true } }) }) } catch (error) { next(error) } })
apiRouter.get('/merchants/:id', (req, res) => res.json({ merchant: { id: req.params.id } }))
apiRouter.get('/stock', async (_req, res, next) => { try { res.json({ listings: await prisma.stockListing.findMany({ include: { trader: true } }) }) } catch (error) { next(error) } })
apiRouter.get('/stock/:id', (req, res) => res.json({ stock: { id: req.params.id } }))
apiRouter.get('/prices', async (_req, res, next) => { try { res.json({ prices: await prisma.stockListing.groupBy({ by: ['cut'], _avg: { pricePence: true }, _min: { pricePence: true }, _max: { pricePence: true }, _sum: { quantity: true } }) }) } catch (error) { next(error) } })
apiRouter.post('/orders/whatsapp', requireTraderAccess, requireTenant, requireFoundMeatModule, async (req, res, next) => {
  try { const response = await fetch(`${(process.env.FOUNDRETAIL_API_URL || 'http://127.0.0.1:4001/api/v1').replace(/\/+$/, '')}/whatsapp/messages`, { method: 'POST', headers: { Authorization: req.get('authorization') || '', 'Content-Type': 'application/json' }, body: JSON.stringify({ to: req.body?.to, text: req.body?.text }), signal: AbortSignal.timeout(10_000) }); const body = await response.json().catch(() => null); res.status(response.status).json(body) } catch (error) { next(error) }
})
apiRouter.get('/dashboard', requireTraderAccess, requireTenant, requireFoundMeatModule, async (_req, res, next) => { try { const stock = await prisma.stockListing.findMany({ include: { trader: true } }); res.json({ stock, orders: [], metrics: { traders: new Set(stock.map((item) => item.traderId)).size, listings: stock.length, quantity: stock.reduce((sum, item) => sum + item.quantity, 0) } }) } catch (error) { next(error) } })
apiRouter.get('/console', requireTraderAccess, requireTenant, requireFoundMeatModule, async (_req, res, next) => { try { res.json({ stock: await prisma.stockListing.findMany({ include: { trader: true } }), orders: [], customers: [] }) } catch (error) { next(error) } })
apiRouter.get('/owner', requireMeatOwnerAccess, requireTenant, requireFoundMeatModule, async (_req, res, next) => { try { const consoles = await prisma.meatTrader.findMany({ include: { listings: true } }); res.json({ consoles, metrics: { traders: consoles.length, listings: consoles.reduce((sum, item) => sum + item.listings.length, 0) }, staff: [] }) } catch (error) { next(error) } })
apiRouter.get('/console/overview', requireTraderAccess, requireTenant, requireFoundMeatModule, async (_req, res, next) => { try { res.json({ stock: await prisma.stockListing.findMany({ include: { trader: true } }), orders: [], customers: [] }) } catch (error) { next(error) } })
apiRouter.get('/owner/overview', requireMeatOwnerAccess, requireTenant, requireFoundMeatModule, async (_req, res, next) => { try { const consoles = await prisma.meatTrader.findMany({ include: { listings: true } }); res.json({ consoles, metrics: { traders: consoles.length, listings: consoles.reduce((sum, item) => sum + item.listings.length, 0) } }) } catch (error) { next(error) } })
apiRouter.post('/media', requireMeatOwnerAccess, requireTenant, requireFoundMeatModule, async (req, res, next) => {
  try { const tenantId = res.locals.auth?.role === 'founder_master' ? String(req.body?.tenantId || '') : res.locals.auth?.tenantId; if (!tenantId) return res.status(400).json({ success: false, message: 'Company scope is required' }); const response = await fetch(`${(process.env.FOUNDRETAIL_API_URL || 'http://127.0.0.1:4001/api/v1').replace(/\/+$/, '')}/media/generate`, { method: 'POST', headers: { Authorization: req.get('authorization') || '', 'Content-Type': 'application/json' }, body: JSON.stringify({ ...(req.body || {}), tenantId }), signal: AbortSignal.timeout(10_000) }); const body = await response.json().catch(() => null); res.status(response.status).json(body) } catch (error) { next(error) }
})
