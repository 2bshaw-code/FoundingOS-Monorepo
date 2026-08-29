/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { Router } from 'express'
import { createBobRouter } from '@founder-os/bob'
import { createAuthenticatedServiceProxy, createModuleAccessMiddleware } from '@founder-os/auth'
import { requireMarketplaceAccount, requireMarketplaceMerchant, requireMarketplaceOwner } from './auth.js'
import { listScrapedLinks, scrapeLink } from './scraping.js'
import { prisma } from './auth.js'
import { pushScrapedLeadToFoundRetail, pushScrapedLeadToFoundRetailWithAuthorization } from './foundretailLeadSync.js'
import { createScrapeSource, runDueScrapeSources, runScrapeSource, scraperStatus, updateScrapeSource } from './scrapeScheduler.js'

export const apiRouter = Router()
const requireFoundThisModule = createModuleAccessMiddleware('foundit')
apiRouter.use('/foundretail-operations', requireMarketplaceOwner, requireFoundThisModule, createAuthenticatedServiceProxy(process.env.FOUNDRETAIL_API_URL || 'http://127.0.0.1:4001/api/v1'))
apiRouter.use('/foundretail-merchant', requireMarketplaceMerchant, requireFoundThisModule, createAuthenticatedServiceProxy(process.env.FOUNDRETAIL_API_URL || 'http://127.0.0.1:4001/api/v1'))
apiRouter.get('/status', (_req, res) => res.json({ app: 'foundit', status: 'operational' }))
apiRouter.use('/bob', requireMarketplaceAccount, requireFoundThisModule, createBobRouter('foundit'))
apiRouter.get('/merchants', async (_req, res, next) => { try { const items = await prisma.scrapedLink.findMany({ where: { OR: [{ merchantName: { not: null } }, { companyName: { not: null } }] }, orderBy: { scrapedAt: 'desc' }, take: 100 }); res.json({ merchants: items }) } catch (error) { next(error) } })
apiRouter.get('/merchants/:id', (req, res) => res.json({ merchant: { id: req.params.id } }))
apiRouter.get('/products', async (_req, res, next) => { try { res.json({ products: await prisma.scrapedLink.findMany({ where: { status: { in: ['active', 'available', 'claimed'] } }, orderBy: { scrapedAt: 'desc' }, take: 100 }) }) } catch (error) { next(error) } })
apiRouter.get('/listings', async (_req, res, next) => { try { res.json({ listings: await prisma.scrapedLink.findMany({ orderBy: { scrapedAt: 'desc' }, take: 100 }) }) } catch (error) { next(error) } })
apiRouter.get('/listings/:id', (req, res) => res.json({ listing: { id: req.params.id } }))
apiRouter.get('/marketplace/items', async (_req, res, next) => {
	try { res.json({ success: true, data: await prisma.scrapedLink.findMany({ where: { status: { in: ['active', 'available', 'claimed'] } }, orderBy: [{ priority: 'desc' }, { scrapedAt: 'desc' }], take: 100 }) }) } catch (error) { next(error) }
})
apiRouter.get('/scraped-links', requireMarketplaceAccount, requireFoundThisModule, async (_req, res, next) => {
	try { res.json({ success: true, data: await listScrapedLinks(res.locals.auth?.role === 'founder_master' ? undefined : res.locals.auth?.tenantId) }) } catch (error) { next(error) }
})
apiRouter.post('/scraped-links', requireMarketplaceOwner, requireFoundThisModule, async (req, res, next) => {
	try {
		const item = await scrapeLink(req.body?.url, res.locals.auth?.role === 'founder_master' ? req.body?.tenantId : res.locals.auth?.tenantId, req.body || {})
		const lead = await pushScrapedLeadToFoundRetail(req, item)
		const data = lead ? await prisma.scrapedLink.update({ where: { id: item.id }, data: { foundRetailLeadId: lead.id } as any }) : item
		res.status(201).json({ success: true, data })
	} catch (error) { next(error) }
})
apiRouter.get('/scraping/status', requireMarketplaceOwner, requireFoundThisModule, async (_req, res, next) => {
	try { res.json({ success: true, data: await scraperStatus(res.locals.auth?.role === 'founder_master' ? undefined : res.locals.auth?.tenantId) }) } catch (error) { next(error) }
})
apiRouter.post('/scraping/sources', requireMarketplaceOwner, requireFoundThisModule, async (req, res, next) => {
	try { const tenantId = res.locals.auth?.role === 'founder_master' ? req.body?.tenantId : res.locals.auth?.tenantId; if (!tenantId) return res.status(400).json({ success: false, message: 'Company scope is required' }); res.status(201).json({ success: true, data: await createScrapeSource({ ...(req.body || {}), tenantId }) }) } catch (error) { next(error) }
})
apiRouter.patch('/scraping/sources/:id', requireMarketplaceOwner, requireFoundThisModule, async (req, res, next) => {
	try { const source = await prisma.scrapeSource.findUniqueOrThrow({ where: { id: String(req.params.id) } }); if (res.locals.auth?.role !== 'founder_master' && source.tenantId !== res.locals.auth?.tenantId) return res.status(403).json({ success: false, message: 'Source access denied' }); res.json({ success: true, data: await updateScrapeSource(source.id, { ...(req.body || {}), tenantId: source.tenantId }) }) } catch (error) { next(error) }
})
apiRouter.delete('/scraping/sources/:id', requireMarketplaceOwner, requireFoundThisModule, async (req, res, next) => {
	try { const source = await prisma.scrapeSource.findUniqueOrThrow({ where: { id: String(req.params.id) } }); if (res.locals.auth?.role !== 'founder_master' && source.tenantId !== res.locals.auth?.tenantId) return res.status(403).json({ success: false, message: 'Source access denied' }); await prisma.scrapeSource.delete({ where: { id: source.id } }); res.json({ success: true }) } catch (error) { next(error) }
})
apiRouter.post('/scraping/sources/:id/run', requireMarketplaceOwner, requireFoundThisModule, async (req, res, next) => {
	try { const source = await prisma.scrapeSource.findUniqueOrThrow({ where: { id: String(req.params.id) } }); if (res.locals.auth?.role !== 'founder_master' && source.tenantId !== res.locals.auth?.tenantId) return res.status(403).json({ success: false, message: 'Source access denied' }); res.json({ success: true, data: await runScrapeSource(source.id) }) } catch (error) { next(error) }
})
apiRouter.post('/scraping/run-due', requireMarketplaceOwner, requireFoundThisModule, async (_req, res, next) => {
	try { if (res.locals.auth?.role !== 'founder_master') return res.status(403).json({ success: false, message: 'Founder access required' }); res.json({ success: true, data: await runDueScrapeSources() }) } catch (error) { next(error) }
})
apiRouter.post('/marketplace/items/:id/claim', requireMarketplaceAccount, requireFoundThisModule, async (req, res, next) => {
	try { res.json({ success: true, data: await prisma.scrapedLink.update({ where: { id: String(req.params.id) }, data: { status: 'claimed', claimedBy: res.locals.auth?.id, claimedAt: new Date(), deliveryFeePence: Math.max(0, Number(req.body?.deliveryFeePence || 0)) } }) }) } catch (error) { next(error) }
})
apiRouter.post('/marketplace/items/:id/rehome', requireMarketplaceOwner, requireFoundThisModule, async (req, res, next) => {
	try { res.json({ success: true, data: await prisma.scrapedLink.update({ where: { id: String(req.params.id) }, data: { status: 'rehomed', rehomedAt: new Date() } }) }) } catch (error) { next(error) }
})
apiRouter.get('/marketplace/revenue', requireMarketplaceOwner, requireFoundThisModule, async (_req, res, next) => {
	try { const items = await listScrapedLinks(res.locals.auth?.role === 'founder_master' ? undefined : res.locals.auth?.tenantId); res.json({ success: true, data: { listingFeesPence: items.reduce((sum, item) => sum + item.listingFeePence, 0), placementFeesPence: items.reduce((sum, item) => sum + item.placementFeePence, 0), deliveryFeesPence: items.reduce((sum, item) => sum + item.deliveryFeePence, 0), premiumFeesPence: items.reduce((sum, item) => sum + item.premiumFeePence, 0) } }) } catch (error) { next(error) }
})
apiRouter.get('/dashboard', requireMarketplaceAccount, requireFoundThisModule, async (_req, res, next) => { try { const items = await listScrapedLinks(res.locals.auth?.role === 'founder_master' ? undefined : res.locals.auth?.tenantId); res.json({ merchants: items.filter((item) => item.merchantName || item.companyName), listings: items, metrics: { listings: items.length, claimed: items.filter((item) => item.status === 'claimed').length, rehomed: items.filter((item) => item.status === 'rehomed').length } }) } catch (error) { next(error) } })
apiRouter.get('/console', requireMarketplaceMerchant, requireFoundThisModule, async (_req, res, next) => { try { const listings = await listScrapedLinks(res.locals.auth?.tenantId); res.json({ listings, onboarding: listings.filter((item) => Boolean((item as any).foundRetailLeadId)) }) } catch (error) { next(error) } })
apiRouter.get('/owner', requireMarketplaceOwner, requireFoundThisModule, async (_req, res, next) => { try { const items = await listScrapedLinks(res.locals.auth?.role === 'founder_master' ? undefined : res.locals.auth?.tenantId); res.json({ consoles: [...new Set(items.map((item) => item.tenantId).filter(Boolean))], metrics: { listings: items.length, leads: items.filter((item) => Boolean((item as any).foundRetailLeadId)).length, claimed: items.filter((item) => item.status === 'claimed').length, rehomed: items.filter((item) => item.status === 'rehomed').length }, staff: [] }) } catch (error) { next(error) } })
apiRouter.get('/account', requireMarketplaceAccount, (_req, res) => res.json({ account: res.locals.auth }))
apiRouter.post('/onboarding/foundretail', requireMarketplaceOwner, requireFoundThisModule, async (req, res, next) => {
	try {
		const tenantId = res.locals.auth?.role === 'founder_master' ? String(req.body?.tenantId || '') : res.locals.auth?.tenantId
		const companyName = String(req.body?.companyName || req.body?.merchantName || '').trim()
		if (!tenantId || !companyName) return res.status(400).json({ success: false, message: 'Company scope and company name are required' })
		const lead = await pushScrapedLeadToFoundRetailWithAuthorization(req.get('authorization') || '', { id: String(req.body?.id || `onboarding-${Date.now()}`), url: String(req.body?.url || ''), title: String(req.body?.title || 'FoundThis merchant onboarding'), tenantId, merchantName: req.body?.merchantName ? String(req.body.merchantName) : null, companyName, contactEmail: req.body?.contactEmail ? String(req.body.contactEmail) : null, contactPhone: req.body?.contactPhone ? String(req.body.contactPhone) : null, listingFeePence: Math.max(0, Number(req.body?.listingFeePence || 0)), placementFeePence: Math.max(0, Number(req.body?.placementFeePence || 0)), deliveryFeePence: Math.max(0, Number(req.body?.deliveryFeePence || 0)), premiumFeePence: Math.max(0, Number(req.body?.premiumFeePence || 0)) })
		res.status(201).json({ success: true, data: lead })
	} catch (error) { next(error) }
})
apiRouter.post('/media', requireMarketplaceOwner, requireFoundThisModule, async (req, res, next) => {
	try { const tenantId = res.locals.auth?.role === 'founder_master' ? String(req.body?.tenantId || '') : res.locals.auth?.tenantId; if (!tenantId) return res.status(400).json({ success: false, message: 'Company scope is required' }); const response = await fetch(`${(process.env.FOUNDRETAIL_API_URL || 'http://127.0.0.1:4001/api/v1').replace(/\/+$/, '')}/media/generate`, { method: 'POST', headers: { Authorization: req.get('authorization') || '', 'Content-Type': 'application/json' }, body: JSON.stringify({ ...(req.body || {}), tenantId }), signal: AbortSignal.timeout(10_000) }); const body = await response.json().catch(() => null); res.status(response.status).json(body) } catch (error) { next(error) }
})
