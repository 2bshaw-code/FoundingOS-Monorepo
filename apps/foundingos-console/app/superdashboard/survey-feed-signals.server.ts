/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
// Historical engagement/anomaly logging for the survey feed — real Postgres-backed rows
// (engagement_logs, anomaly_logs), written each time a new submission changes a category's
// computed state. Additive to the existing live, on-demand tile computation in
// getSurveyFeedTiles/SuperDashAnomaly (packages/ui/src/superdash) — this does not replace
// or duplicate that logic, it reuses the same scoring rules to persist a point-in-time
// snapshot for trend history.
import { getPrismaClient } from '@foundingos/db'
import { readSurveyFeedEntries, type SurveyFeedCategory } from './survey-feed-store.server'

function blankAnswerCount(responses: string[]): number {
  return responses.filter((answer) => answer.trim().length < 3).length
}

// Mirrors getSurveyFeedTiles' categoryScore in packages/ui/src/superdash — kept in sync
// intentionally rather than imported, since that package computes tiles for many callers
// and this is a narrower, persistence-only concern.
function categoryScore(entries: { responses: string[] }[]): number {
  if (entries.length === 0) return 0.6
  const engagementBonus = Math.min(entries.length, 4) * 0.08
  const blankPenalty = entries.reduce((total, entry) => total + blankAnswerCount(entry.responses), 0) * 0.05
  return Number(Math.max(0.4, Math.min(1.6, 1.0 + engagementBonus - blankPenalty)).toFixed(2))
}

export async function logEngagementSnapshot(category: SurveyFeedCategory): Promise<void> {
  const prisma = getPrismaClient()
  if (!prisma) return // Demo Mode — no DB configured.

  const entries = await readSurveyFeedEntries()
  const categoryEntries = entries.filter((entry) => entry.category === category)
  const score = categoryScore(categoryEntries)

  await prisma.engagementLog.create({
    data: { category, submissionCount: categoryEntries.length, score },
  })
}

export async function logAnomalyIfDetected(category: SurveyFeedCategory): Promise<void> {
  const prisma = getPrismaClient()
  if (!prisma) return

  const entries = await readSurveyFeedEntries()
  const categoryEntries = entries.filter((entry) => entry.category === category)
  const score = categoryScore(categoryEntries)

  // Same +/-0.3 threshold as SuperDashAnomaly (packages/ui/src/superdash/SuperDashAnomaly.ts).
  const spiked = score - 1.0 >= 0.3
  const dropped = 1.0 - score >= 0.3
  if (!spiked && !dropped) return

  const message = spiked ? `${category} spiked unexpectedly.` : `${category} dropped sharply.`
  await prisma.anomalyLog.create({ data: { category, message, score } })
}
