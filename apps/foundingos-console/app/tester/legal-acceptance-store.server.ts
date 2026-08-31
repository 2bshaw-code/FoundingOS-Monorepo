/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
// Legal-agreement acceptance log — Postgres/Prisma-backed (migrated off the local
// JSON file). Dormant-safe by design: if DATABASE_URL isn't configured (Demo Mode,
// the current real state of this environment), this silently no-ops rather than
// throwing — that's what keeps the tester/investor/lawyer login flow working today,
// with zero live database, exactly as every other backend integration point in this
// ecosystem already behaves (see packages/billing, packages/db/survey-service.ts).
// Once DATABASE_URL/NEXTAUTH_SECRET/STRIPE_SECRET_KEY are all supplied (Commercial
// Mode), acceptance records start writing to Postgres automatically — no code change
// needed at that point.
import { getPrismaClient } from '@foundingos/db'

export type LegalAcceptanceEntry = {
  email: string
  passwordUsed: string
  version: string
  timestamp: Date
}

export async function logLegalAcceptance(entry: LegalAcceptanceEntry): Promise<void> {
  const prisma = getPrismaClient()
  if (!prisma) return // Demo Mode — no DB configured; acceptance is still enforced server-side, just not persisted.

  await prisma.legalAcceptance.create({
    data: {
      email: entry.email,
      passwordUsed: entry.passwordUsed,
      version: entry.version,
      timestamp: entry.timestamp,
    },
  })
  // Immutable: only .create() is ever called here — no update/delete paths exist.
}

// Read-only accessor for the Legal Reviewer view (/legal) — most recent acceptances
// first. Demo Mode (no DATABASE_URL) returns an empty list rather than throwing.
export async function listLegalAcceptances(limit = 100): Promise<LegalAcceptanceEntry[]> {
  const prisma = getPrismaClient()
  if (!prisma) return []

  const rows = await prisma.legalAcceptance.findMany({ orderBy: { timestamp: 'desc' }, take: limit })
  return rows.map((row) => ({
    email: row.email,
    passwordUsed: row.passwordUsed,
    version: row.version,
    timestamp: row.timestamp,
  }))
}
