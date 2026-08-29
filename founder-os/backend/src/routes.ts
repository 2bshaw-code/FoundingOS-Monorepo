/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { Router } from 'express'
import { createBobRouter } from '@founder-os/bob'
import { createAuthenticatedServiceProxy } from '@founder-os/auth'
import { prisma, requireEcosystemAccess, requireFounderAccess } from './auth.js'
import { fetchFoundThisFeed } from './founditFeed.js'
import { fetchEcosystemFeed, forwardFoundRetailCommand } from './ecosystemFeed.js'
import type { Prisma } from './generated/prisma/index.js'

export const apiRouter = Router()
const externalUrl = (value: unknown) => {
	const text = String(value || '').trim()
	if (!text) return null
	const url = new URL(text)
	if (!['http:', 'https:'].includes(url.protocol)) throw new Error('External URL must use HTTP or HTTPS')
	return url.toString()
}
export const companySettings = (slug: string, value: unknown): Prisma.InputJsonValue => {
	const settings = value && typeof value === 'object' && !Array.isArray(value) ? value as Record<string, unknown> : {}
	return (slug === 'foundretail' ? { ...settings, brandColor: '#25D366' } : slug === 'foundcrypto' ? { ...settings, brandColor: '#7C3AED' } : slug === 'foundit' ? { ...settings, brandColor: '#FFD600' } : slug === 'foundtalent' ? { ...settings, brandColor: '#F97316' } : settings) as Prisma.InputJsonValue
}
apiRouter.get('/public/companies', async (_req, res) => {
	const companies = await prisma.company.findMany({ where: { active: true }, select: { id: true, name: true, slug: true, publicWebsiteUrl: true, ownerConsoleUrl: true, merchantConsoleUrl: true, settings: true, modules: { where: { enabled: true }, select: { module: true } } }, orderBy: { name: 'asc' } })
	res.json({ success: true, data: companies })
})
apiRouter.get('/module-access/:companyId/:module', requireEcosystemAccess, async (req, res) => {
	const identity = res.locals.auth
	const companyId = String(req.params.companyId)
	const module = String(req.params.module)
	if (identity.role !== 'founder_master' && identity.tenantId !== companyId) return res.status(403).json({ success: false, allowed: false })
	const company = await prisma.company.findUnique({ where: { id: companyId }, include: { modules: { where: { module } } } })
	const settings = company?.settings && typeof company.settings === 'object' && !Array.isArray(company.settings) ? company.settings as Record<string, unknown> : {}
	const roleAllowed = identity.role === 'founder_master' || (identity.role === 'Owner' ? settings.ownerAccess !== false : settings.merchantAccess !== false)
	res.json({ success: true, allowed: Boolean(company?.active && company.modules[0]?.enabled && roleAllowed) })
})
apiRouter.post('/applications', requireEcosystemAccess, async (req, res, next) => {
	try {
		const app = String(req.body?.app || '').trim().toLowerCase()
		const plan = String(req.body?.plan || '').trim().toLowerCase()
		const businessName = String(req.body?.businessName || '').trim()
		const contactName = String(req.body?.contactName || '').trim()
		const email = String(req.body?.email || '').trim().toLowerCase()
		const requirements = String(req.body?.requirements || '').trim()
		if (!['foundretail', 'foundcrypto', 'foundit', 'foundmeat', 'foundtalent'].includes(app) || !['merchant', 'owner', 'large'].includes(plan)) return res.status(400).json({ success: false, message: 'Invalid application product or plan' })
		if (!businessName || businessName.length > 160 || !contactName || contactName.length > 160 || !/^\S+@\S+\.\S+$/.test(email) || !requirements || requirements.length > 4000) return res.status(400).json({ success: false, message: 'Complete all required application fields' })
		const identity = res.locals.auth
		const data = await prisma.packageApplication.create({ data: { app, plan, businessName, contactName, email, requirements, phone: req.body?.phone ? String(req.body.phone).replace(/[^\d+]/g, '').slice(0, 32) : undefined, location: req.body?.location ? String(req.body.location).trim().slice(0, 200) : undefined, businessType: req.body?.businessType ? String(req.body.businessType).trim().slice(0, 120) : undefined, submittedBy: identity.id, tenantId: identity.tenantId } })
		res.status(201).json({ success: true, data })
	} catch (error) { next(error) }
})
apiRouter.use(requireFounderAccess)
apiRouter.use('/bob', createBobRouter('founder-os'))
apiRouter.get('/status', (_req, res) => res.json({ app: 'founder-os', status: 'operational' }))
apiRouter.get('/dashboard', async (req, res, next) => {
	try { const [ecosystem, foundit, companies] = await Promise.all([fetchEcosystemFeed(req), fetchFoundThisFeed(req), prisma.company.findMany({ where: { active: true }, include: { modules: true } })]); res.json({ success: true, data: { ...ecosystem, foundit, companies } }) } catch (error) { next(error) }
})
apiRouter.get('/companies', async (_req, res) => res.json({ success: true, data: await prisma.company.findMany({ include: { modules: true }, orderBy: { name: 'asc' } }) }))
apiRouter.get('/applications', async (_req, res) => res.json({ success: true, data: await prisma.packageApplication.findMany({ orderBy: { createdAt: 'desc' }, take: 200 }) }))
apiRouter.post('/companies', async (req, res) => {
	const name = String(req.body?.name || '').trim()
	const slug = String(req.body?.slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-')).replace(/^-|-$/g, '')
	if (!name || !slug) return res.status(400).json({ success: false, message: 'Company name is required' })
	const company = await prisma.company.create({ data: { name, slug, publicWebsiteUrl: externalUrl(req.body?.publicWebsiteUrl), ownerConsoleUrl: externalUrl(req.body?.ownerConsoleUrl), merchantConsoleUrl: externalUrl(req.body?.merchantConsoleUrl), settings: companySettings(slug, req.body?.settings), modules: { create: ['foundretail', 'foundcrypto', 'foundit', 'foundmeat', 'foundtalent'].map((module) => ({ module, enabled: Boolean(req.body?.modules?.[module]) })) } }, include: { modules: true } })
	res.status(201).json({ success: true, data: company })
})
apiRouter.patch('/companies/:id', async (req, res) => {
	const existing = await prisma.company.findUniqueOrThrow({ where: { id: req.params.id } })
	const company = await prisma.company.update({ where: { id: req.params.id }, data: { ...(req.body?.name !== undefined ? { name: String(req.body.name).trim() } : {}), ...(req.body?.publicWebsiteUrl !== undefined ? { publicWebsiteUrl: externalUrl(req.body.publicWebsiteUrl) } : {}), ...(req.body?.ownerConsoleUrl !== undefined ? { ownerConsoleUrl: externalUrl(req.body.ownerConsoleUrl) } : {}), ...(req.body?.merchantConsoleUrl !== undefined ? { merchantConsoleUrl: externalUrl(req.body.merchantConsoleUrl) } : {}), ...(req.body?.active !== undefined ? { active: Boolean(req.body.active) } : {}), ...(req.body?.settings !== undefined ? { settings: companySettings(existing.slug, req.body.settings) } : {}) } })
	if (req.body?.modules) await Promise.all(Object.entries(req.body.modules).map(([module, enabled]) => prisma.companyModule.upsert({ where: { companyId_module: { companyId: company.id, module } }, create: { companyId: company.id, module, enabled: Boolean(enabled) }, update: { enabled: Boolean(enabled) } })))
	res.json({ success: true, data: await prisma.company.findUnique({ where: { id: company.id }, include: { modules: true } }) })
})
apiRouter.get('/foundcrypto', async (req, res, next) => { try { res.json({ success: true, data: (await fetchEcosystemFeed(req)).foundcrypto.data }) } catch (error) { next(error) } })
apiRouter.get('/foundcrypto/merchants', async (req, res, next) => { try { const data = (await fetchEcosystemFeed(req)).foundcrypto.data; res.json({ merchants: data?.customers || [] }) } catch (error) { next(error) } })
apiRouter.get('/foundcrypto/merchants/:id', (req, res) => res.json({ merchant: { id: req.params.id } }))
apiRouter.get('/foundcrypto/packages', (_req, res) => res.json({ packages: [] }))
apiRouter.get('/foundcrypto/packages/:id', (req, res) => res.json({ package: { id: req.params.id } }))
apiRouter.get('/foundcrypto/consoles', (_req, res) => res.json({ consoles: [] }))
apiRouter.get('/foundcrypto/consoles/:id', (req, res) => res.json({ console: { id: req.params.id } }))
apiRouter.get('/foundit', async (req, res, next) => { try { const listings = await fetchFoundThisFeed(req); res.json({ merchants: listings.filter((item: any) => item.merchantName || item.companyName), listings }) } catch (error) { next(error) } })
apiRouter.get('/foundit/merchants', async (req, res, next) => { try { const listings = await fetchFoundThisFeed(req); res.json({ merchants: listings.filter((item: any) => item.merchantName || item.companyName) }) } catch (error) { next(error) } })
apiRouter.get('/foundit/merchants/:id', (req, res) => res.json({ merchant: { id: req.params.id } }))
apiRouter.get('/foundit/listings', async (req, res, next) => { try { res.json({ listings: await fetchFoundThisFeed(req) }) } catch (error) { next(error) } })
apiRouter.get('/foundit/listings/:id', (req, res) => res.json({ listing: { id: req.params.id } }))
apiRouter.get('/insights/foundit', async (req, res, next) => {
	try { res.json({ success: true, data: await fetchFoundThisFeed(req), refreshedAt: new Date().toISOString() }) } catch (error) { next(error) }
})
apiRouter.get('/insights/ecosystem', async (req, res) => res.json({ success: true, data: await fetchEcosystemFeed(req) }))
apiRouter.use('/operations', createAuthenticatedServiceProxy(process.env.FOUNDRETAIL_API_URL || 'http://127.0.0.1:4001/api/v1'))
apiRouter.use('/scraping', createAuthenticatedServiceProxy(`${(process.env.FOUNDIT_API_URL || 'http://127.0.0.1:4003/api/v1').replace(/\/+$/, '')}/scraping`))
apiRouter.patch('/pipeline/leads/:id', async (req, res, next) => {
	try { res.json(await forwardFoundRetailCommand(req, `/leads/${String(req.params.id)}`, 'PATCH', req.body)) } catch (error) { next(error) }
})
apiRouter.post('/pipeline/leads/:id/convert', async (req, res, next) => {
	try { res.json(await forwardFoundRetailCommand(req, `/leads/${String(req.params.id)}/convert`, 'POST')) } catch (error) { next(error) }
})
apiRouter.get('/foundmeat', async (req, res, next) => { try { res.json({ success: true, data: (await fetchEcosystemFeed(req)).foundmeat.data }) } catch (error) { next(error) } })
apiRouter.get('/foundmeat/merchants', async (req, res, next) => { try { const data = (await fetchEcosystemFeed(req)).foundmeat.data; res.json({ merchants: data?.consoles || [] }) } catch (error) { next(error) } })
apiRouter.get('/foundmeat/merchants/:id', (req, res) => res.json({ merchant: { id: req.params.id } }))
apiRouter.get('/foundmeat/stock', (_req, res) => res.json({ stock: [] }))
apiRouter.get('/foundmeat/stock/:id', (req, res) => res.json({ stock: { id: req.params.id } }))
apiRouter.get('/system/health', (_req, res) => res.json({ services: [] }))
apiRouter.get('/system/logs', (_req, res) => res.json({ logs: [] }))
apiRouter.get('/system/routes', (_req, res) => res.json({ routes: [] }))
apiRouter.post('/media', async (req, res, next) => {
	try { res.status(201).json(await forwardFoundRetailCommand(req, '/media/generate', 'POST', req.body)) } catch (error) { next(error) }
})
