/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
// Tester-metrics aggregator — SuperDash-internal only, no new routes, no UI beyond one
// footer micro-line. Every function here is a pure read: it aggregates numbers already
// sitting in BrandMetric, EngagementLog, AnomalyLog, and DriftLog (GuardianQueue = DriftLog
// rows with kind='needsApproval' and resolved=false — the same definition AVL's own
// readVerificationStatus already uses, reused here rather than re-derived so the two never
// drift apart). Nothing in this file writes a new row, creates a table, or reads from
// anything outside that set — despite the "record*" naming (kept to match the requested
// signatures), none of these functions persist per-call data anywhere.
//
// Per-user granularity note: none of the four source tables carries a userId/tester
// column, so this is honestly a system-wide aggregate, not per-tester tracking. userId /
// event arguments are accepted for signature compatibility only and are unused; moduleId /
// brandId ARE used, since categoryBreakdown keys and brandName give a real, existing lookup
// for those two.
import { getPrismaClient } from '@foundingos/db'
import { readVerificationStatus } from './verification-layer.server'

async function loadBrandMetrics() {
  const prisma = getPrismaClient()
  if (!prisma) return []
  return prisma.brandMetric.findMany()
}

function sumCategoryBreakdowns(rows: Array<{ categoryBreakdown: unknown }>): Record<string, number> {
  const totals: Record<string, number> = {}
  for (const row of rows) {
    const breakdown = row.categoryBreakdown
    if (breakdown && typeof breakdown === 'object') {
      for (const [key, value] of Object.entries(breakdown as Record<string, unknown>)) {
        totals[key] = (totals[key] ?? 0) + (typeof value === 'number' ? value : 0)
      }
    }
  }
  return totals
}

export async function recordActivation(userId?: string): Promise<{ activatedBrands: number; totalBrands: number }> {
  void userId // no per-user column in the allowed sources — see file header
  const rows = await loadBrandMetrics()
  return { activatedBrands: rows.filter((r) => r.totalEngagement > 0).length, totalBrands: rows.length }
}

export async function recordEngagement(userId?: string, moduleId?: string): Promise<{ totalEngagement: number; moduleEngagement: number | null }> {
  void userId
  const rows = await loadBrandMetrics()
  const totalEngagement = rows.reduce((sum, r) => sum + r.totalEngagement, 0)
  const moduleEngagement = moduleId ? (sumCategoryBreakdowns(rows)[moduleId] ?? 0) : null
  return { totalEngagement, moduleEngagement }
}

export async function recordRetention(userId?: string): Promise<{ engagementSnapshots: number; distinctDays: number }> {
  void userId
  const prisma = getPrismaClient()
  if (!prisma) return { engagementSnapshots: 0, distinctDays: 0 }
  const rows = await prisma.engagementLog.findMany({ select: { recordedAt: true } })
  const distinctDays = new Set(rows.map((r) => r.recordedAt.toISOString().slice(0, 10))).size
  return { engagementSnapshots: rows.length, distinctDays }
}

export async function recordHeatmap(moduleId?: string): Promise<Record<string, number> | number> {
  const totals = sumCategoryBreakdowns(await loadBrandMetrics())
  return moduleId ? (totals[moduleId] ?? 0) : totals
}

export async function recordBrandPreference(brandId?: string): Promise<Array<{ brandName: string; totalEngagement: number }> | number> {
  const rows = await loadBrandMetrics()
  if (brandId) return rows.find((r) => r.brandName === brandId)?.totalEngagement ?? 0
  return rows.map((r) => ({ brandName: r.brandName, totalEngagement: r.totalEngagement })).sort((a, b) => b.totalEngagement - a.totalEngagement)
}

export async function recordStability(event?: string): Promise<{ score: number; anomalyCount: number; pendingGuardian: number }> {
  void event // no matching column on AnomalyLog/DriftLog — see file header
  const prisma = getPrismaClient()
  const anomalyCount = prisma ? await prisma.anomalyLog.count() : 0
  const { pendingGuardian } = await readVerificationStatus()
  const score = Math.max(0, Math.min(100, 100 - anomalyCount * 2 - pendingGuardian * 5))
  return { score, anomalyCount, pendingGuardian }
}

export async function recordAutonomy(safeFixCount?: number, guardianCount?: number): Promise<{ safeFixCount: number; guardianCount: number }> {
  // Pass-through when the caller already has fresh AVL numbers this request (e.g. from
  // readVerificationStatus) — no recomputation, no write. Otherwise aggregate DriftLog now.
  if (typeof safeFixCount === 'number' && typeof guardianCount === 'number') return { safeFixCount, guardianCount }
  const status = await readVerificationStatus()
  return { safeFixCount: status.safeFixCount, guardianCount: status.pendingGuardian }
}

export type TesterSummary = { activation: string; engagement: number; retention: number; stability: number; autonomy: string }

export async function getTesterSummary(): Promise<TesterSummary> {
  const [activation, engagement, retention, stability, autonomy] = await Promise.all([
    recordActivation(),
    recordEngagement(),
    recordRetention(),
    recordStability(),
    recordAutonomy(),
  ])
  return {
    activation: `${activation.activatedBrands}/${activation.totalBrands}`,
    engagement: engagement.totalEngagement,
    retention: retention.distinctDays,
    stability: stability.score,
    autonomy: `${autonomy.safeFixCount} fixed / ${autonomy.guardianCount} pending`,
  }
}
