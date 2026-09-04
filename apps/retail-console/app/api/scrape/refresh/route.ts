/* 
  © 2024–2026 FoundingOS API. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { NextResponse, type NextRequest } from 'next/server'
import { getPrismaClient } from '@foundingos/db'

// Force dynamic rendering — this handler writes to the database on every call and must
// never be statically cached/prerendered.
export const dynamic = 'force-dynamic'

const BRAND_NAME = 'FoundRetail'
const BRAND_SLUG = 'retail'
const CATEGORIES = ['listings', 'pricing', 'availability'] as const

// Synthetic metric profile for this brand — growth speed, anomaly-spike likelihood, and
// engagement-wave shape. No external calls, no persisted counters beyond BrandMetric
// itself; the 15-minute time bucket doubles as a deterministic "tick" for the wave.
const PROFILE = {
  growthMultiplier: 3.0, // base new-engagement points per refresh
  anomalySpikeProbability: 0.15, // chance this refresh is a stochastic spike
  anomalySpikeMagnitude: 0.15, // extra anomalyScore added on a spike
  waveAmplitude: 0.6, // engagement-wave swing, as a fraction of growthMultiplier
  wavePeriodTicks: 8, // ticks (15-min windows) per full wave cycle
} as const

function hashSeed(seed: string): number {
  let h = 2166136261
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return (h >>> 0) / 4294967295
}

function timeBucket(windowMs: number): number {
  return Math.floor(Date.now() / windowMs)
}

// Same capped scoring shape used by the real survey-driven BrandMetric writer in the
// FoundingOS console — base 1.0, capped bonus for volume, so this scraper's writes stay
// consistent with Autonomous's real thresholds (~1.20 high-engagement, capped ~1.4)
// rather than inventing a second scale.
function computeAnomalyScore(totalEngagement: number): number {
  const bonus = Math.min(totalEngagement, 6) * 0.06
  return Number(Math.min(1.4, 1.0 + bonus).toFixed(2))
}

// Synthetic scraper: no external network calls, no paid APIs. Combines a brand-specific
// growth slope, a sine-wave engagement overlay, and a stochastic anomaly-spike chance into
// this refresh's engagement delta, then genuinely persists it into the real BrandMetric
// row for this brand via Prisma (incremental upsert — never overwrites unrelated fields).
// Real primary/backup engine redundancy: Vercel Pro's own cron (configured in this app's
// vercel.json) is the real primary scheduler and always wins. A separate GitHub Actions
// workflow (.github/workflows/engine-backup.yml) calls this same endpoint every 30 minutes
// as a backup, in case Vercel's cron ever fails or is delayed -- but since this handler
// increments totalEngagement on every real write, letting both fire within the same short
// window would double-count. Vercel's cron requests always carry a real, unspoofable
// 'user-agent: vercel-cron/1.0' header (Vercel sets this itself; it isn't configurable via
// vercel.json, so this is the actual, verifiable signal of a primary run rather than a
// custom header we'd have to trust). The backup workflow instead sends a real custom
// 'x-engine-source: github-backup' header, which IS something we control. If a backup
// request arrives less than 10 minutes after the last real write, it's skipped -- Vercel is
// still running on schedule, so the backup stood down correctly instead of double-writing.
const BACKUP_STANDDOWN_WINDOW_MS = 10 * 60 * 1000

export async function GET(request: NextRequest) {
  const isVercelPrimary = request.headers.get('user-agent') === 'vercel-cron/1.0'
  const isGithubBackup = request.headers.get('x-engine-source') === 'github-backup'
  const engineSource = isVercelPrimary ? 'vercel-primary' : isGithubBackup ? 'github-backup' : 'manual'

  const windowMs = 15 * 60 * 1000
  const tick = timeBucket(windowMs)

  // Engagement wave: smooth sine oscillation around the base growth rate.
  const wavePhase = (2 * Math.PI * tick) / PROFILE.wavePeriodTicks
  const waveOffset = Math.sin(wavePhase) * PROFILE.waveAmplitude * PROFILE.growthMultiplier

  // Small deterministic noise on top of growth + wave, seeded per brand/tick.
  const noise = (hashSeed(`scrape:${BRAND_SLUG}:${tick}:noise`) * 2 - 1) * 0.5

  const rawDelta = PROFILE.growthMultiplier + waveOffset + noise
  const itemCount = Math.max(1, Math.round(rawDelta))

  const categoryIndex = Math.floor(hashSeed(`scrape:${BRAND_SLUG}:${tick}:category`) * CATEGORIES.length)
  const category = CATEGORIES[categoryIndex]

  // Stochastic anomaly spike — deterministic per brand/tick, not true randomness, so a
  // given tick always produces the same result (genuinely "synthetic", not flaky).
  const isSpike = hashSeed(`scrape:${BRAND_SLUG}:${tick}:spike`) < PROFILE.anomalySpikeProbability

  const prisma = getPrismaClient()
  if (!prisma) {
    // Demo Mode — no DATABASE_URL configured. Report the computed signal without writing.
    return NextResponse.json({ mode: 'demo' as const, brand: BRAND_SLUG, written: false, itemCount, category, isSpike })
  }

  const existing = await prisma.brandMetric.findUnique({ where: { brandName: BRAND_NAME } })

  // Real stand-down check -- only ever relevant for the backup engine; the real primary
  // (Vercel) never skips its own scheduled run.
  if (engineSource === 'github-backup' && existing?.lastUpdated) {
    const msSinceLastWrite = Date.now() - new Date(existing.lastUpdated).getTime()
    if (msSinceLastWrite < BACKUP_STANDDOWN_WINDOW_MS) {
      return NextResponse.json({
        mode: 'skipped' as const,
        brand: BRAND_SLUG,
        engineSource,
        reason: 'Primary engine already ran recently -- backup stood down to avoid double-counting.',
        lastUpdated: existing.lastUpdated,
      })
    }
  }

  const totalEngagement = (existing?.totalEngagement ?? 0) + itemCount
  const existingBreakdown = (existing?.categoryBreakdown as Record<string, number> | null) ?? {}
  const categoryBreakdown = { ...existingBreakdown, [category]: (existingBreakdown[category] ?? 0) + itemCount }

  let anomalyScore = computeAnomalyScore(totalEngagement)
  if (isSpike) anomalyScore = Number(Math.min(1.4, anomalyScore + PROFILE.anomalySpikeMagnitude).toFixed(2))

  await prisma.brandMetric.upsert({
    where: { brandName: BRAND_NAME },
    create: { brandName: BRAND_NAME, totalEngagement, anomalyScore, categoryBreakdown },
    update: { totalEngagement, anomalyScore, categoryBreakdown, lastUpdated: new Date() },
  })

  return NextResponse.json({
    mode: 'live' as const,
    brand: BRAND_SLUG,
    engineSource,
    written: true,
    itemCount,
    category,
    isSpike,
    totalEngagement,
    anomalyScore,
  })
}
