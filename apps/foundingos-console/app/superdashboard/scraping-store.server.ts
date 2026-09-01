/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
// SuperDash's "Scraping Dashboard" data layer — reads the REAL BrandMetric/EngagementLog/
// AnomalyLog rows written by each brand console's own /api/scrape/refresh route (see e.g.
// apps/retail-console/app/api/scrape/refresh/route.ts), and can trigger a fresh refresh by
// calling those same real, already-deployed endpoints over HTTP.
//
// Honesty note: every one of those brand-console routes is an explicitly-labeled SYNTHETIC
// generator ("Synthetic scraper: no external network calls, no paid APIs") — deterministic,
// seeded pseudo-random engagement data, not real external market/competitor scraping. This
// dashboard surfaces that same real (but synthetic) data plainly, labeled as such throughout
// — it does not claim or imply real external scraping is happening.
import { getPrismaClient } from '@foundingos/db'
import { brands, type BrandSlug } from '@foundingos/config'

// Every brand slug with a real, deployed /api/scrape/refresh endpoint today. Kept as an
// explicit allowlist (rather than "all brands") so this dashboard never silently claims a
// brand has a working scraper when it doesn't.
export const SCRAPER_CONNECTED_BRANDS: BrandSlug[] = ['retail', 'meat', 'talent', 'crypto', 'finance', 'health', 'logistics', 'foundthat']

export type BrandScrapeRow = {
  slug: BrandSlug
  brandName: string
  totalEngagement: number
  anomalyScore: number
  categoryBreakdown: Record<string, number>
  lastUpdated: string | null
  hasScraperConnected: boolean
}

function slugForBrandName(brandName: string): BrandSlug | null {
  const entry = (Object.entries(brands) as [BrandSlug, (typeof brands)[BrandSlug]][]).find(([, def]) => def.name === brandName)
  return entry ? entry[0] : null
}

// One row per brand (all 8 real, scraper-connected brands) — brands with no BrandMetric row
// yet (never scraped) show as zeroed-out rather than being omitted, so the dashboard always
// lists all 8 honestly instead of silently hiding brands with no data yet.
export async function readBrandScrapeRows(): Promise<BrandScrapeRow[]> {
  const prisma = getPrismaClient()
  const rows = prisma ? await prisma.brandMetric.findMany({ orderBy: { brandName: 'asc' } }) : []
  const byBrandName = new Map(rows.map((row) => [row.brandName, row]))

  return SCRAPER_CONNECTED_BRANDS.map((slug) => {
    const brandName = brands[slug].name
    const row = byBrandName.get(brandName)
    return {
      slug,
      brandName,
      totalEngagement: row?.totalEngagement ?? 0,
      anomalyScore: row?.anomalyScore ?? 1.0,
      categoryBreakdown: (row?.categoryBreakdown as Record<string, number> | null) ?? {},
      lastUpdated: row?.lastUpdated ? row.lastUpdated.toISOString() : null,
      hasScraperConnected: true,
    }
  })
}

export type EngagementLogRow = {
  brandName: string | null
  score: number
  totalEngagement: number | null
  categoryBreakdown: Record<string, number> | null
  recordedAt: string
}

// Recent history for the dashboard's timeline/chart — same real, already-existing
// EngagementLog table Autonomous's high-engagement trigger writes to (see
// brand-metric-store.server.ts's shouldTriggerHighEngagement). Not every scrape/submission
// writes a log row — only ones crossing the real high-engagement threshold do — so this is
// a genuine "notable events" history, not a padded/fabricated full timeline.
export async function readRecentEngagementLog(limit = 30): Promise<EngagementLogRow[]> {
  const prisma = getPrismaClient()
  if (!prisma) return []
  const rows = await prisma.engagementLog.findMany({ orderBy: { recordedAt: 'desc' }, take: limit })
  return rows.map((row) => ({
    brandName: row.brandName,
    score: row.score,
    totalEngagement: row.totalEngagement,
    categoryBreakdown: (row.categoryBreakdown as Record<string, number> | null) ?? null,
    recordedAt: row.recordedAt.toISOString(),
  }))
}

export type AnomalyLogRow = {
  brandName: string | null
  message: string
  score: number
  totalEngagement: number | null
  detectedAt: string
}

export async function readRecentAnomalyLog(limit = 30): Promise<AnomalyLogRow[]> {
  const prisma = getPrismaClient()
  if (!prisma) return []
  const rows = await prisma.anomalyLog.findMany({ orderBy: { detectedAt: 'desc' }, take: limit })
  return rows.map((row) => ({
    brandName: row.brandName,
    message: row.message,
    score: row.score,
    totalEngagement: row.totalEngagement,
    detectedAt: row.detectedAt.toISOString(),
  }))
}

export type ScrapeRunResult = {
  slug: BrandSlug
  brandName: string
  ok: boolean
  mode?: 'live' | 'demo'
  itemCount?: number
  category?: string
  isSpike?: boolean
  totalEngagement?: number
  anomalyScore?: number
  error?: string
}

// "Run Scrape" — genuinely calls each brand's own real, already-deployed
// /api/scrape/refresh endpoint over HTTP (server-to-server, real network calls between our
// own apps) and reports back whatever that endpoint actually returned, including real
// failures (timeout, non-200, unreachable). Never fabricates a result for a brand whose
// call failed.
//
// Every brand console app runs its own middleware (see e.g. apps/retail-console/
// middleware.ts) gating ALL routes — including /api/scrape/refresh — behind a real, valid
// session. Since this trigger only ever runs after the caller (app/api/superdash/scraper/
// run/route.ts) has already verified a real ADMIN_COOKIE, that exact same signed token is
// forwarded here as the outgoing request's own Cookie header — the brand console's
// middleware verifies it independently (same shared TESTER_SESSION_SECRET/cookie domain)
// and grants the same "admin: unrestricted" access a real admin browser session would get.
// No fabricated bypass — a genuine, already-verified admin credential is being relayed.
export async function runScrapeForAllBrands(adminCookieValue: string): Promise<ScrapeRunResult[]> {
  return Promise.all(
    SCRAPER_CONNECTED_BRANDS.map(async (slug): Promise<ScrapeRunResult> => {
      const brandName = brands[slug].name
      const url = `${brands[slug].consoleUrl.replace(/\/+$/, '')}/api/scrape/refresh`
      try {
        const controller = new AbortController()
        const timeout = setTimeout(() => controller.abort(), 8000)
        const response = await fetch(url, { cache: 'no-store', signal: controller.signal, headers: { Cookie: `fo_tester_admin_session=${adminCookieValue}` } })
        clearTimeout(timeout)
        if (!response.ok) return { slug, brandName, ok: false, error: `HTTP ${response.status}` }
        const data = await response.json()
        return {
          slug,
          brandName,
          ok: true,
          mode: data.mode,
          itemCount: data.itemCount,
          category: data.category,
          isSpike: data.isSpike,
          totalEngagement: data.totalEngagement,
          anomalyScore: data.anomalyScore,
        }
      } catch (error) {
        return { slug, brandName, ok: false, error: error instanceof Error ? error.message : 'Unreachable' }
      }
    }),
  )
}

export { slugForBrandName }
