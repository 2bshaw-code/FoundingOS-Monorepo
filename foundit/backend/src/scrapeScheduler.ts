/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { authService, prisma } from './auth.js'
import { discoverItemLinks, fetchScrapePage, safeUrl, scrapeLink } from './scraping.js'
import { pushScrapedLeadToFoundRetailWithAuthorization } from './foundretailLeadSync.js'

export const scrapeSourceCategories = ['free-items', 'marketplace-free', 'community-free', 'merchant-free-offers', 'classifieds-free'] as const
const categorySet = new Set<string>(scrapeSourceCategories)
const schedulerEmail = 'scraper@foundit.internal'
let running = false
let timer: NodeJS.Timeout | undefined

export type ScrapeSourceInput = {
  name: string
  category: string
  url: string
  active?: boolean
  tenantId?: string | null
  intervalMinutes?: number
  maxItemsPerRun?: number
  itemSelector?: string | null
  linkSelector?: string | null
  merchantName?: string | null
  companyName?: string | null
  contactEmail?: string | null
  contactPhone?: string | null
  listingFeePence?: number
  placementFeePence?: number
  deliveryFeePence?: number
  premiumFeePence?: number
}

const bounded = (value: unknown, fallback: number, minimum: number, maximum: number) => Math.max(minimum, Math.min(maximum, Number(value || fallback)))
const optionalText = (value: unknown) => String(value || '').trim() || null

export const normalizeScrapeSource = async (input: Partial<ScrapeSourceInput>) => {
  const name = String(input.name || '').trim()
  const category = String(input.category || '').trim()
  if (!name) throw new Error('Source name is required')
  if (!categorySet.has(category)) throw new Error(`Source category must be one of: ${scrapeSourceCategories.join(', ')}`)
  const url = await safeUrl(input.url)
  return {
    name,
    category,
    url: url.toString(),
    active: input.active !== false,
    tenantId: optionalText(input.tenantId),
    intervalMinutes: bounded(input.intervalMinutes, 60, 5, 10_080),
    maxItemsPerRun: bounded(input.maxItemsPerRun, 20, 1, 100),
    itemSelector: optionalText(input.itemSelector),
    linkSelector: optionalText(input.linkSelector),
    merchantName: optionalText(input.merchantName),
    companyName: optionalText(input.companyName),
    contactEmail: optionalText(input.contactEmail),
    contactPhone: optionalText(input.contactPhone),
    listingFeePence: bounded(input.listingFeePence, 0, 0, 10_000_000),
    placementFeePence: bounded(input.placementFeePence, 0, 0, 10_000_000),
    deliveryFeePence: bounded(input.deliveryFeePence, 0, 0, 10_000_000),
    premiumFeePence: bounded(input.premiumFeePence, 0, 0, 10_000_000),
  }
}

export const createScrapeSource = async (input: Partial<ScrapeSourceInput>) => {
  const normalized = await normalizeScrapeSource(input)
  await fetchScrapePage(normalized.url)
  return prisma.scrapeSource.create({ data: { ...normalized, nextRunAt: new Date() } })
}
export const updateScrapeSource = async (id: string, input: Partial<ScrapeSourceInput>) => {
  const current = await prisma.scrapeSource.findUniqueOrThrow({ where: { id } })
  const normalized = await normalizeScrapeSource({ ...current, ...input })
  if (normalized.url !== current.url) await fetchScrapePage(normalized.url)
  return prisma.scrapeSource.update({ where: { id }, data: { ...normalized, ...(input.active === true ? { nextRunAt: new Date() } : {}) } })
}

const serviceSession = async () => {
  await prisma.authUser.upsert({ where: { email: schedulerEmail }, create: { email: schedulerEmail, passwordHash: '!background-service-principal', role: 'founder_master', active: true }, update: { role: 'founder_master', active: true } })
  return authService.loginWithVerifiedIdentity(schedulerEmail, { deviceFingerprint: 'foundit-scrape-scheduler', ipAddress: '127.0.0.1' })
}

const sourceDetails = (source: Awaited<ReturnType<typeof prisma.scrapeSource.findUniqueOrThrow>>) => ({
  sourceId: source.id,
  merchantName: source.merchantName,
  companyName: source.companyName,
  contactEmail: source.contactEmail,
  contactPhone: source.contactPhone,
  listingFeePence: source.listingFeePence,
  placementFeePence: source.placementFeePence,
  deliveryFeePence: source.deliveryFeePence,
  premiumFeePence: source.premiumFeePence,
})

export const runScrapeSource = async (sourceId: string) => {
  const source = await prisma.scrapeSource.findUniqueOrThrow({ where: { id: sourceId } })
  const run = await prisma.scrapeRun.create({ data: { sourceId } })
  const errors: Array<{ url: string; message: string }> = []
  let discovered = 0
  let ingested = 0
  let leadsPushed = 0
  let refreshToken = ''
  try {
    const sourcePage = await fetchScrapePage(source.url)
    const discoveredLinks = discoverItemLinks(sourcePage.html, sourcePage.url, source.itemSelector, source.linkSelector, source.maxItemsPerRun)
    const links = discoveredLinks.length ? discoveredLinks : [source.url]
    discovered = links.length
    const session = await serviceSession()
    refreshToken = session.refreshToken
    for (const link of links) {
      try {
        const item = await scrapeLink(link, source.tenantId || undefined, sourceDetails(source))
        ingested += 1
        const lead = await pushScrapedLeadToFoundRetailWithAuthorization(`Bearer ${session.token}`, item)
        if (lead) {
          leadsPushed += 1
          await prisma.scrapedLink.update({ where: { id: item.id }, data: { foundRetailLeadId: lead.id } as any })
        }
      } catch (error) { errors.push({ url: link, message: error instanceof Error ? error.message : 'Unknown scrape error' }) }
    }
    const successful = ingested > 0 && errors.length === 0
    await prisma.scrapeRun.update({ where: { id: run.id }, data: { status: successful ? 'succeeded' : ingested ? 'partial' : 'failed', discovered, ingested, leadsPushed, errors, completedAt: new Date() } })
    await prisma.scrapeSource.update({ where: { id: source.id }, data: { lastRunAt: new Date(), ...(ingested ? { lastSuccessAt: new Date(), lastError: errors[0]?.message || null, consecutiveFailures: 0 } : { lastError: errors[0]?.message || 'No items ingested', consecutiveFailures: { increment: 1 } }), nextRunAt: new Date(Date.now() + source.intervalMinutes * 60_000) } })
    return { runId: run.id, status: successful ? 'succeeded' : ingested ? 'partial' : 'failed', discovered, ingested, leadsPushed, errors }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown source error'
    errors.push({ url: source.url, message })
    const backoffMinutes = Math.min(source.intervalMinutes * 2 ** Math.min(source.consecutiveFailures, 5), 10_080)
    await prisma.scrapeRun.update({ where: { id: run.id }, data: { status: 'failed', discovered, ingested, leadsPushed, errors, completedAt: new Date() } })
    await prisma.scrapeSource.update({ where: { id: source.id }, data: { lastRunAt: new Date(), lastError: message, consecutiveFailures: { increment: 1 }, nextRunAt: new Date(Date.now() + backoffMinutes * 60_000) } })
    return { runId: run.id, status: 'failed', discovered, ingested, leadsPushed, errors }
  } finally { if (refreshToken) await authService.logout(refreshToken) }
}

export const runDueScrapeSources = async () => {
  if (running) return []
  running = true
  try {
    const sources = await prisma.scrapeSource.findMany({ where: { active: true, nextRunAt: { lte: new Date() } }, orderBy: { nextRunAt: 'asc' }, take: bounded(process.env.SCRAPER_CONCURRENCY, 3, 1, 10) })
    return Promise.all(sources.map((source) => runScrapeSource(source.id)))
  } finally { running = false }
}

export const ensureConfiguredScrapeSources = async () => {
  const raw = process.env.SCRAPER_SOURCE_URLS?.trim()
  if (!raw) return []
  const configured = JSON.parse(raw) as Partial<ScrapeSourceInput>[]
  if (!Array.isArray(configured)) throw new Error('SCRAPER_SOURCE_URLS must be a JSON array')
  const sources = []
  for (const input of configured) {
    const normalized = await normalizeScrapeSource(input)
    sources.push(await prisma.scrapeSource.upsert({ where: { url: normalized.url }, create: { ...normalized, nextRunAt: new Date() }, update: normalized }))
  }
  return sources
}

export const startScrapeScheduler = async () => {
  if (process.env.SCRAPER_ENABLED === 'false') return { enabled: false, configuredSources: 0 }
  const sources = await ensureConfiguredScrapeSources()
  void runDueScrapeSources().catch((error) => {
    console.error('[scraper] runDueScrapeSources failed', error instanceof Error ? error.message : error)
  })
  const tickMs = bounded(process.env.SCRAPER_TICK_SECONDS, 60, 15, 3600) * 1000
  timer ||= setInterval(() => {
    void runDueScrapeSources().catch((error) => {
      console.error('[scraper] scheduled run failed', error instanceof Error ? error.message : error)
    })
  }, tickMs)
  timer.unref()
  return { enabled: true, configuredSources: sources.length, tickSeconds: tickMs / 1000 }
}

export const stopScrapeScheduler = () => { if (timer) clearInterval(timer); timer = undefined }

export const scraperStatus = async (tenantId?: string) => {
  const where = tenantId ? { tenantId } : {}
  const [sources, recentRuns, items, pendingLeads] = await Promise.all([
    prisma.scrapeSource.findMany({ where, include: { runs: { orderBy: { startedAt: 'desc' }, take: 5 } }, orderBy: [{ active: 'desc' }, { name: 'asc' }] }),
    prisma.scrapeRun.findMany({ where: tenantId ? { source: { tenantId } } : {}, include: { source: { select: { name: true, category: true, url: true } } }, orderBy: { startedAt: 'desc' }, take: 50 }),
    prisma.scrapedLink.count({ where }),
    prisma.scrapedLink.count({ where: { ...where, tenantId: { not: null }, OR: [{ companyName: { not: null } }, { merchantName: { not: null } }], foundRetailLeadId: null } as any }),
  ])
  return { enabled: process.env.SCRAPER_ENABLED !== 'false', running, categories: scrapeSourceCategories.map((category) => ({ category, configured: sources.filter((source) => source.category === category).length, active: sources.filter((source) => source.category === category && source.active).length })), sources, recentRuns, metrics: { sources: sources.length, activeSources: sources.filter((source) => source.active).length, items, failedRuns: recentRuns.filter((run) => run.status === 'failed').length, pendingLeads } }
}
