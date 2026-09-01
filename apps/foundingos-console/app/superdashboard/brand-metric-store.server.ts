/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
// Live per-brand engagement metrics — one row per brand, updated on every survey
// submission for that brand. Additive to the existing mock portfolio table in
// SuperDashboardPage.tsx: only brands with a working survey-feed pipeline (currently just
// FoundRetail) ever get a row here, so this powers a separate "real data" panel rather than
// replacing the mock table (which still covers all 8 brands, several with no real source).
import { getPrismaClient } from '@foundingos/db'
import { brands, type BrandSlug } from '@foundingos/config'

function resolveBrandName(brandSlug: string): string {
  const brand = brands[brandSlug as BrandSlug]
  return brand?.name ?? brandSlug
}

// Same scoring shape as categoryScore (getSurveyFeedTiles.ts) and survey-feed-signals.server.ts
// — base 1.0, capped engagement bonus for volume, applied here at brand (not category)
// level. Tuned so the score meaningfully crosses the 1.20 high-engagement threshold around
// 4 submissions (realistic tester load), while still capping in the ~1.3–1.4 range so a
// spike stays meaningful rather than extreme.
function computeAnomalyScore(totalEngagement: number): number {
  const bonus = Math.min(totalEngagement, 6) * 0.06
  return Number(Math.min(1.4, 1.0 + bonus).toFixed(2))
}

// Autonomous high-engagement ("auto-optimize") trigger thresholds — kept low enough to
// fire under realistic tester load, but guarded by a minimum submission count and category
// spread so a single burst of identical-category submissions can't trigger it accidentally.
const HIGH_ENGAGEMENT_SCORE_THRESHOLD = 1.2
const HIGH_ENGAGEMENT_MIN_TOTAL = 3
const HIGH_ENGAGEMENT_MIN_CATEGORIES = 2

function shouldTriggerHighEngagement(anomalyScore: number, totalEngagement: number, categoryBreakdown: Record<string, number>): boolean {
  const distinctCategories = Object.values(categoryBreakdown).filter((count) => count > 0).length
  return anomalyScore >= HIGH_ENGAGEMENT_SCORE_THRESHOLD
    && totalEngagement >= HIGH_ENGAGEMENT_MIN_TOTAL
    && distinctCategories >= HIGH_ENGAGEMENT_MIN_CATEGORIES
}

export async function upsertBrandMetricOnSubmission(brandSlug: string, category: string): Promise<void> {
  const prisma = getPrismaClient()
  if (!prisma) return // Demo Mode — no DB configured.

  const brandName = resolveBrandName(brandSlug)
  const existing = await prisma.brandMetric.findUnique({ where: { brandName } })

  const totalEngagement = (existing?.totalEngagement ?? 0) + 1
  const existingBreakdown = (existing?.categoryBreakdown as Record<string, number> | null) ?? {}
  const categoryBreakdown = { ...existingBreakdown, [category]: (existingBreakdown[category] ?? 0) + 1 }
  const anomalyScore = computeAnomalyScore(totalEngagement)

  await prisma.brandMetric.upsert({
    where: { brandName },
    create: { brandName, totalEngagement, anomalyScore, categoryBreakdown },
    update: { totalEngagement, anomalyScore, categoryBreakdown, lastUpdated: new Date() },
  })

  if (shouldTriggerHighEngagement(anomalyScore, totalEngagement, categoryBreakdown)) {
    const message = `${brandName} high engagement — auto-optimize triggered.`
    await Promise.all([
      prisma.anomalyLog.create({ data: { brandName, message, score: anomalyScore, totalEngagement, categoryBreakdown } }),
      prisma.engagementLog.create({ data: { brandName, score: anomalyScore, totalEngagement, categoryBreakdown } }),
    ])
  }
}

export async function readBrandMetrics() {
  const prisma = getPrismaClient()
  if (!prisma) return []

  return prisma.brandMetric.findMany({ orderBy: { brandName: 'asc' } })
}
