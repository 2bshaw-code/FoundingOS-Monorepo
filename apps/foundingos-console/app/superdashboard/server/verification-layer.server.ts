/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
// Autonomous Verification Layer (AVL) — internal-only, no UI, no outbound/external calls
// beyond this ecosystem's own 26 apps (the same "server-to-server, same-ecosystem" pattern
// already used by route-health.server.ts). Only ever invoked by /api/avl/verify, which is
// only ever invoked by Vercel Cron.
//
// HONESTY NOTE (read before extending this file): a deployed serverless function has no
// access to any other app's source code, no filesystem checkout of the monorepo, no
// devDependencies, and a strict execution time limit. That means several things the spec
// names ("missing imports", "dead buttons", "UI contamination", running tsc/next build)
// are NOT things a running instance of this function can actually do — those require a real
// source checkout + build toolchain (CI, or an agent session like this one), not a runtime
// check. Every function below is scoped to what a live serverless function genuinely CAN
// verify: real HTTP reachability of all 26 apps, real scraper/pipeline data health already
// persisted in Postgres, and real, already-existing Guardian anomaly state. Anywhere the
// spec asks for something runtime can't do, this file says so explicitly in its return
// value (`staticAnalysisUnavailable`) rather than fabricating a result.
import { getPrismaClient } from '@foundingos/db'
import { brands, type BrandSlug } from '@foundingos/config'
import { readBrandScrapeRows, readRecentAnomalyLog, runScrapeForAllBrands, type BrandScrapeRow } from '../scraping-store.server'
import { buildCustomerPipeline } from '../customer-pipeline-store.server'
import { readTesters } from '../../tester/store.server'

// The real 26 apps in this monorepo (8 brands × web/console/console-starter, plus
// foundingos-console + foundingos-web) — every one of them has a real, live base URL via
// packages/config's brand registry, which is exactly what makes "scan all 26 apps" a real,
// checkable HTTP-reachability sweep rather than a fabricated claim.
//
// BUGFIX (found by the first real AVL run, avl-1788291517554): deliberately read raw env
// vars here (not @foundingos/config's `brands`) for consoleUrl/starterConsoleUrl — matching
// route-health.server.ts's established pattern exactly. `brands` wraps every cross-app URL
// in a browser-safety Proxy that rewrites "localhost" URLs down to a bare "/" in production
// (correct for client-facing hrefs, wrong for a server-to-server fetch), which was silently
// turning every console/starter check into a false "unreachable" result. webUrl is left as
// `brands.<slug>.webUrl` — those already resolve to real custom domains and were verified
// correct in the same first run (all 8 brand-web checks returned real 200s).
type AppEntry = { app: string; url: string }

const CONSOLE_ENV_VARS: Record<BrandSlug, { console: string; starter: string; fallback: number }> = {
  foundingos: { console: 'NEXT_PUBLIC_FOUNDINGOS_CONSOLE_URL', starter: 'NEXT_PUBLIC_FOUNDINGOS_CONSOLE_URL', fallback: 8000 },
  retail: { console: 'NEXT_PUBLIC_RETAIL_CONSOLE_URL', starter: 'NEXT_PUBLIC_RETAIL_CONSOLE_STARTER_URL', fallback: 8017 },
  meat: { console: 'NEXT_PUBLIC_MEAT_CONSOLE_URL', starter: 'NEXT_PUBLIC_MEAT_CONSOLE_STARTER_URL', fallback: 8018 },
  talent: { console: 'NEXT_PUBLIC_TALENT_CONSOLE_URL', starter: 'NEXT_PUBLIC_TALENT_CONSOLE_STARTER_URL', fallback: 8020 },
  crypto: { console: 'NEXT_PUBLIC_CRYPTO_CONSOLE_URL', starter: 'NEXT_PUBLIC_CRYPTO_CONSOLE_STARTER_URL', fallback: 8021 },
  finance: { console: 'NEXT_PUBLIC_FINANCE_CONSOLE_URL', starter: 'NEXT_PUBLIC_FINANCE_CONSOLE_STARTER_URL', fallback: 8022 },
  health: { console: 'NEXT_PUBLIC_HEALTH_CONSOLE_URL', starter: 'NEXT_PUBLIC_HEALTH_CONSOLE_STARTER_URL', fallback: 8023 },
  logistics: { console: 'NEXT_PUBLIC_LOGISTICS_CONSOLE_URL', starter: 'NEXT_PUBLIC_LOGISTICS_CONSOLE_STARTER_URL', fallback: 8024 },
  foundthat: { console: 'NEXT_PUBLIC_FOUNDTHAT_CONSOLE_URL', starter: 'NEXT_PUBLIC_FOUNDTHAT_CONSOLE_STARTER_URL', fallback: 8019 },
}

function rawConsoleUrl(slug: BrandSlug): string {
  const cfg = CONSOLE_ENV_VARS[slug]
  return (process.env[cfg.console] || `http://localhost:${cfg.fallback}`).replace(/\/+$/, '')
}

function rawStarterConsoleUrl(slug: BrandSlug): string {
  const cfg = CONSOLE_ENV_VARS[slug]
  return (process.env[cfg.starter] || `http://localhost:${cfg.fallback}`).replace(/\/+$/, '')
}

function allAppEntries(): AppEntry[] {
  const entries: AppEntry[] = [
    { app: 'foundingos-web', url: brands.foundingos.webUrl },
    { app: 'foundingos-console', url: rawConsoleUrl('foundingos') },
  ]
  const brandSlugs: BrandSlug[] = ['retail', 'meat', 'talent', 'crypto', 'finance', 'health', 'logistics', 'foundthat']
  for (const slug of brandSlugs) {
    entries.push({ app: `${slug}-web`, url: brands[slug].webUrl })
    entries.push({ app: `${slug}-console`, url: rawConsoleUrl(slug) })
    entries.push({ app: `${slug}-console-starter`, url: rawStarterConsoleUrl(slug) })
  }
  return entries
}

export type RouteScanResult = { app: string; url: string; ok: boolean; status: number }

// Real HTTP reachability check for all 26 apps' real base URL — the honest, runtime-checkable
// version of "broken routes" (a live GET, not static route-map inspection).
async function scanRoutes(): Promise<RouteScanResult[]> {
  return Promise.all(
    allAppEntries().map(async ({ app, url }): Promise<RouteScanResult> => {
      try {
        const controller = new AbortController()
        const timeout = setTimeout(() => controller.abort(), 8000)
        const response = await fetch(url, { method: 'GET', cache: 'no-store', signal: controller.signal })
        clearTimeout(timeout)
        return { app, url, ok: response.ok, status: response.status }
      } catch {
        return { app, url, ok: false, status: 0 }
      }
    }),
  )
}

const STALE_SCRAPE_HOURS = 6

export type ScrapeHealthResult = { app: string; stale: boolean; lastUpdated: string | null }

// Real "failed scrapes" check — reuses the real BrandMetric rows already read by the
// Scraping Dashboard (scraping-store.server.ts); "stale" means no successful scrape in over
// STALE_SCRAPE_HOURS, a genuine, deterministic, fixable condition (see safeFix below).
function evaluateScrapeHealth(rows: BrandScrapeRow[]): ScrapeHealthResult[] {
  const cutoff = Date.now() - STALE_SCRAPE_HOURS * 60 * 60 * 1000
  return rows.map((row) => ({
    app: `${row.slug}-console`,
    stale: !row.lastUpdated || new Date(row.lastUpdated).getTime() < cutoff,
    lastUpdated: row.lastUpdated,
  }))
}

export type PipelineHealthResult = { ok: boolean; totalContacts: number; error: string | null }

// Real pipeline health — genuinely executes buildCustomerPipeline() (the same function the
// Scraping Dashboard's Customer Pipeline panel calls) and reports whether it actually threw.
async function evaluatePipelineHealth(): Promise<PipelineHealthResult> {
  try {
    const pipeline = await buildCustomerPipeline()
    return { ok: true, totalContacts: pipeline.totalContacts, error: null }
  } catch (error) {
    return { ok: false, totalContacts: 0, error: error instanceof Error ? error.message : 'Unknown pipeline error' }
  }
}

export type ModuleMismatch = { app: string; navHref: string; missingModuleId: string }

// This app's OWN moduleId/navigation cross-check — the one genuinely inspectable "static"
// signal available at runtime, because app/brand-config.ts is real code THIS running
// instance already has loaded. It cannot inspect any of the other 25 apps' brand-config.ts
// files — those live in separate deployed bundles this function has no access to.
//
// BUGFIX (found by the first real AVL run): /modules/marketing and /modules/foundai-demo
// have real, verified page.tsx files (app/modules/marketing/page.tsx,
// app/modules/foundai-demo/page.tsx) that explicitly override the moduleId/render a
// dedicated component instead of relying on the generic BrandModulePage fallback — the same
// pattern confirmed correct across all 8 brand consoles in the prior dead-tab audit. This
// nav-href-suffix-vs-module-id check has no way to know about a page's own explicit
// override, so these two are a real, confirmed false positive, not real drift — excluded by
// exact href match rather than by module id, so a genuinely new/broken /modules/* entry is
// still caught.
// /modules/sales added for the same reason: a real, dedicated SalesModule component (its own
// tabs: Pipeline/Quotes/Activities/Analytics) with no config.modules entry, since — unlike
// accounting/messaging/customer-service/marketing-suite, which DO have real config.modules
// entries left over from when they used the generic BrandModulePage fallback — Sales never
// had a page or a module entry anywhere in the ecosystem before now.
const KNOWN_EXPLICIT_OVERRIDE_HREFS = new Set(['/modules/marketing', '/modules/foundai-demo', '/modules/sales'])

async function scanOwnModuleMismatches(): Promise<ModuleMismatch[]> {
  const { brandConfig } = await import('../../brand-config')
  const moduleIds = new Set((brandConfig.modules ?? []).map((m: { id: string }) => m.id))
  const mismatches: ModuleMismatch[] = []
  for (const item of brandConfig.navigation ?? []) {
    if (!item.href.startsWith('/modules/')) continue
    if (KNOWN_EXPLICIT_OVERRIDE_HREFS.has(item.href)) continue
    const id = item.href.replace('/modules/', '')
    if (id === 'overview' || id === 'activity-log') continue // real, always-present fallback routes, not module ids.
    if (!moduleIds.has(id)) mismatches.push({ app: 'foundingos-console', navHref: item.href, missingModuleId: id })
  }
  return mismatches
}

export type ScanResult = {
  scannedAt: string
  routes: RouteScanResult[]
  scrapeHealth: ScrapeHealthResult[]
  pipelineHealth: PipelineHealthResult
  ownModuleMismatches: ModuleMismatch[]
  testerStoreReachable: boolean
  staticAnalysisUnavailable: string[]
}

// scanAll — every real, runtime-checkable signal across the ecosystem. See the file-level
// honesty note for what this deliberately does NOT claim to detect.
export async function scanAll(): Promise<ScanResult> {
  const [routes, scrapeRows, pipelineHealth, ownModuleMismatches, testers] = await Promise.all([
    scanRoutes(),
    readBrandScrapeRows(),
    evaluatePipelineHealth(),
    scanOwnModuleMismatches(),
    readTesters().then(() => true).catch(() => false),
  ])
  return {
    scannedAt: new Date().toISOString(),
    routes,
    scrapeHealth: evaluateScrapeHealth(scrapeRows),
    pipelineHealth,
    ownModuleMismatches,
    testerStoreReachable: testers,
    staticAnalysisUnavailable: [
      'missingImports (requires full source checkout — not available at runtime)',
      'deadButtons (requires static/UI analysis across 25 other apps\' source — not available at runtime)',
      'uiContamination (requires visual/DOM inspection — not available at runtime)',
    ],
  }
}

export type DriftItem = {
  kind: 'safeFix' | 'needsApproval'
  app: string
  path?: string
  message: string
  detail?: Record<string, unknown>
}

// detectDrift — compares this scan to the last-known-good snapshot (the most recent
// kind='snapshot' DriftLog row) and classifies every real difference found.
export async function detectDrift(scan: ScanResult): Promise<DriftItem[]> {
  const prisma = getPrismaClient()
  const items: DriftItem[] = []

  // Stale scrapes: real, deterministic, reversible — always a safeFix (re-run the scrape).
  for (const health of scan.scrapeHealth) {
    if (health.stale) {
      items.push({ kind: 'safeFix', app: health.app, message: `Synthetic scrape data is stale (last updated ${health.lastUpdated ?? 'never'}) — re-running scrape.` })
    }
  }

  // Own-app moduleId/navigation mismatches: deterministic, but changes what a real user
  // sees — routed to needsApproval rather than silently auto-editing navigation.
  for (const mismatch of scan.ownModuleMismatches) {
    items.push({ kind: 'needsApproval', app: mismatch.app, path: mismatch.navHref, message: `Navigation href "${mismatch.navHref}" has no matching module id "${mismatch.missingModuleId}" — will render a placeholder.`, detail: mismatch })
  }

  // Pipeline errors: a real thrown error from real code — never auto-fixable, always
  // needsApproval.
  if (!scan.pipelineHealth.ok) {
    items.push({ kind: 'needsApproval', app: 'foundingos-console', message: `Customer pipeline build failed: ${scan.pipelineHealth.error}` })
  }

  // Route regressions vs the last snapshot: an app that was reachable last run and isn't
  // now is a real regression a human should look at (could be a real outage or a real
  // deploy break) — never silently retried/hidden.
  if (prisma) {
    const lastSnapshot = await prisma.driftLog.findFirst({ where: { kind: 'snapshot' }, orderBy: { createdAt: 'desc' } })
    const previousRoutes = (lastSnapshot?.detail as { routes?: RouteScanResult[] } | null)?.routes ?? []
    for (const route of scan.routes) {
      const previous = previousRoutes.find((r) => r.app === route.app)
      if (previous?.ok && !route.ok) {
        items.push({ kind: 'needsApproval', app: route.app, path: route.url, message: `${route.app} was reachable last run and is not reachable now (HTTP ${route.status}).` })
      }
    }
  }

  return items
}

export type SafeFixResult = { app: string; message: string; applied: boolean }

// safeFix — applies ONLY the one category of fix that is genuinely deterministic, reversible,
// and actually executable from a running serverless function today: re-running the real,
// already-deployed synthetic scrape generator for brands whose data has gone stale. Every
// other category the spec names ("import corrections", "route map sync", "moduleId
// mismatches") requires editing real source code, which no runtime instance of this app can
// do — those are correctly routed to needsApproval above instead of being faked here.
export async function safeFix(drift: DriftItem[]): Promise<SafeFixResult[]> {
  const staleBrands = drift.filter((item) => item.kind === 'safeFix' && item.message.includes('stale')).map((item) => item.app.replace('-console', ''))
  if (staleBrands.length === 0) return []

  // The scraper paths are already exempted from auth in every brand console's middleware
  // (see apps/*/middleware.ts's SYNTHETIC_GENERATOR_PATHS) — no cookie is actually required.
  const results = await runScrapeForAllBrands('')
  return results
    .filter((result) => staleBrands.includes(result.slug))
    .map((result) => ({ app: `${result.slug}-console`, message: result.ok ? `Re-ran synthetic scrape (${result.mode}).` : `Re-run failed: ${result.error}`, applied: result.ok }))
}

// needsApproval — persists high-risk drift items to the GuardianQueue (DriftLog rows with
// kind='needsApproval', resolved=false); log() below performs the actual write.
export function needsApproval(drift: DriftItem[]): DriftItem[] {
  return drift.filter((item) => item.kind === 'needsApproval')
}

export type FreezePassResult = {
  ranAt: string
  scraperHealthy: boolean
  pipelineHealthy: boolean
  recentAnomalyCount: number
  staticBuildCheck: { ran: false; reason: string }
}

// freezePass — runs every check that is genuinely executable at runtime after a fix.
// staticBuildCheck is honestly reported as not-run rather than fabricated: tsc --noEmit and
// next build both require a full source checkout + devDependencies and take minutes, none
// of which a deployed serverless function has access to or time for.
export async function freezePass(): Promise<FreezePassResult> {
  const [rows, pipelineHealth, anomalies] = await Promise.all([readBrandScrapeRows(), evaluatePipelineHealth(), readRecentAnomalyLog(10)])
  const scraperHealthy = evaluateScrapeHealth(rows).every((h) => !h.stale)
  return {
    ranAt: new Date().toISOString(),
    scraperHealthy,
    pipelineHealthy: pipelineHealth.ok,
    recentAnomalyCount: anomalies.length,
    staticBuildCheck: { ran: false, reason: 'tsc --noEmit / next build require a full source checkout + devDependencies — not executable from a deployed serverless function.' },
  }
}

// log — the single write path into DriftLog. High-severity items (needsApproval) are
// additionally mirrored into the existing AnomalyLog table so they participate in the
// ecosystem's one existing Guardian/anomaly system too, not just a new isolated log.
export async function log(runId: string, kind: string, entries: Array<{ app?: string; path?: string; message: string; detail?: unknown; resolved?: boolean }>): Promise<void> {
  const prisma = getPrismaClient()
  if (!prisma || entries.length === 0) return
  await prisma.driftLog.createMany({
    data: entries.map((entry) => ({ runId, kind, app: entry.app ?? null, path: entry.path ?? null, message: entry.message, detail: (entry.detail ?? null) as never, resolved: entry.resolved ?? false })),
  })
  if (kind === 'needsApproval') {
    await prisma.anomalyLog.createMany({
      data: entries.map((entry) => ({ category: 'avl', message: `[AVL] ${entry.message}`, score: 1.2, brandName: entry.app ?? null })),
    })
  }
}

export type VerificationStatus = { lastRun: string | null; driftCount: number; safeFixCount: number; pendingGuardian: number }

// Read-only summary for the SuperDash footer micro-line — computed entirely from real
// DriftLog rows, never fabricated. Returns nulls/zeros (not fake data) before AVL's first
// real run.
export async function readVerificationStatus(): Promise<VerificationStatus> {
  const prisma = getPrismaClient()
  if (!prisma) return { lastRun: null, driftCount: 0, safeFixCount: 0, pendingGuardian: 0 }

  const [lastRun, driftCount, safeFixCount, pendingGuardian] = await Promise.all([
    prisma.driftLog.findFirst({ orderBy: { createdAt: 'desc' } }),
    prisma.driftLog.count({ where: { kind: { in: ['drift', 'needsApproval'] } } }),
    prisma.driftLog.count({ where: { kind: 'safeFix' } }),
    prisma.driftLog.count({ where: { kind: 'needsApproval', resolved: false } }),
  ])

  return {
    lastRun: lastRun ? lastRun.createdAt.toISOString() : null,
    driftCount,
    safeFixCount,
    pendingGuardian,
  }
}

const FREEZE_INTERVAL_MS = 20 * 60 * 60 * 1000 // ~nightly, tolerant of cron jitter.

// runVerificationLoop — the single entry point /api/avl/verify calls. Runs loop.verify every
// invocation; runs loop.freeze only when the last freezePass row is missing or old enough
// to count as "nightly" (an internal scheduler flag persisted in DriftLog itself, per the
// spec's "same route using internal scheduler flag" — no second cron needed).
export async function runVerificationLoop(): Promise<{ runId: string; scan: ScanResult; drift: DriftItem[]; safeFixResults: SafeFixResult[]; guardianQueued: number; freezePass: FreezePassResult | null }> {
  const runId = `avl-${Date.now()}`
  const scan = await scanAll()
  const drift = await detectDrift(scan)
  const safeFixResults = await safeFix(drift)
  const guardianItems = needsApproval(drift)

  await log(runId, 'snapshot', [{ message: 'scanAll snapshot', detail: scan as unknown }])
  if (drift.length > 0) await log(runId, 'drift', drift.map((d) => ({ app: d.app, path: d.path, message: d.message, detail: d.detail })))
  if (safeFixResults.length > 0) await log(runId, 'safeFix', safeFixResults.map((r) => ({ app: r.app, message: r.message, detail: r })))
  if (guardianItems.length > 0) await log(runId, 'needsApproval', guardianItems.map((d) => ({ app: d.app, path: d.path, message: d.message, detail: d.detail, resolved: false })))

  const prisma = getPrismaClient()
  let ranFreeze: FreezePassResult | null = null
  if (prisma) {
    const lastFreeze = await prisma.driftLog.findFirst({ where: { kind: 'freezePass' }, orderBy: { createdAt: 'desc' } })
    const dueForFreeze = !lastFreeze || Date.now() - lastFreeze.createdAt.getTime() > FREEZE_INTERVAL_MS
    if (dueForFreeze) {
      ranFreeze = await freezePass()
      await log(runId, 'freezePass', [{ message: 'nightly freezePass', detail: ranFreeze as unknown }])
    }
  }

  return { runId, scan, drift, safeFixResults, guardianQueued: guardianItems.length, freezePass: ranFreeze }
}
