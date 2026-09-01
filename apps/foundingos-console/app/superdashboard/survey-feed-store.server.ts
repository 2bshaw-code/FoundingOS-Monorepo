/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
// Server-side store for the cross-app SuperDash survey feed. Any brand website (starting
// with retail-web) can POST a tester survey submission here via /api/superdash/survey-feed,
// and SuperDash reads it back via GET from the same origin (foundingos-console) — this
// avoids the cross-origin localStorage gap that the Customer/Buyer/Investor survey system
// hit earlier (that system only works because its pages and SuperDash share one origin).
//
// Postgres/Prisma-backed (migrated off the local JSON file now that DATABASE_URL is
// configured). Dormant-safe: if DATABASE_URL isn't set, this silently no-ops on write and
// returns an empty list on read — matching every other backend integration point in this
// ecosystem (see legal-acceptance-store.server.ts, packages/billing).
import { getPrismaClient } from '@foundingos/db'

export type SurveyFeedCategory =
  | 'sales' | 'marketing' | 'product' | 'support' | 'operations'
  | 'finance' | 'retailexp' | 'uxui' | 'branding' | 'competitor'

export type SurveyFeedEntry = {
  brand: string
  category: SurveyFeedCategory
  tester: string | null
  responses: string[]
  timestamp: number
  receivedAt: string
}

export async function logSurveyFeedEntry(entry: Omit<SurveyFeedEntry, 'receivedAt'>): Promise<void> {
  const prisma = getPrismaClient()
  if (!prisma) return // Demo Mode — no DB configured; submission still succeeds upstream, just not persisted.

  await prisma.surveyEntry.create({
    data: {
      brand: entry.brand,
      category: entry.category,
      tester: entry.tester,
      responses: entry.responses,
      timestamp: BigInt(entry.timestamp),
    },
  })
}

export async function readSurveyFeedEntries(): Promise<SurveyFeedEntry[]> {
  const prisma = getPrismaClient()
  if (!prisma) return [] // Demo Mode — nothing persisted yet.

  const rows = await prisma.surveyEntry.findMany({ orderBy: { receivedAt: 'asc' } })
  return rows.map((row) => ({
    brand: row.brand,
    category: row.category as SurveyFeedCategory,
    tester: row.tester,
    responses: Array.isArray(row.responses) ? (row.responses as string[]) : [],
    timestamp: Number(row.timestamp),
    receivedAt: row.receivedAt.toISOString(),
  }))
}
