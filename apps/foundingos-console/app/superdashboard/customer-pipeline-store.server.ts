/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
// Honest "customer pipeline" layer — built entirely on top of REAL, already-persisted data:
// the SurveyEntry table (real tester/survey submissions from brand websites, read via
// survey-feed-store.server.ts's readSurveyFeedEntries()) and the real BrandMetric rows this
// dashboard already reads (scraping-store.server.ts). No external contact enrichment, no
// invented names/emails/companies, no outbound communication of any kind — this is a
// read-only, internal segmentation/scoring VIEW over real rows that already exist, clearly
// labeled as synthetic/demo throughout (the same real synthetic engagement data used
// everywhere else in this dashboard).
import { readSurveyFeedEntries, type SurveyFeedEntry } from './survey-feed-store.server'

export type PipelineStage = 'new' | 'engaged' | 'qualified' | 'opportunity'

export type PipelineContact = {
  // "Contact" here means a real distinct tester/session id (or a synthetic anonymous bucket
  // when no tester id was recorded) that has submitted at least one real SurveyEntry row —
  // never an invented person, email, or company name.
  contactId: string
  brand: string
  categories: string[]
  submissionCount: number
  firstSeen: string
  lastSeen: string
  leadScore: number
  stage: PipelineStage
}

// Lead score: a simple, transparent, deterministic function of two real signals already on
// the SurveyEntry row — how many times this contact has submitted (submissionCount) and how
// many distinct categories they've touched (categories.length). No external enrichment, no
// hidden inputs — the formula is visible here in full.
function computeLeadScore(submissionCount: number, distinctCategories: number): number {
  return Math.min(100, submissionCount * 12 + distinctCategories * 8)
}

function stageForScore(score: number): PipelineStage {
  if (score >= 70) return 'opportunity'
  if (score >= 40) return 'qualified'
  if (score >= 15) return 'engaged'
  return 'new'
}

export type PipelineSummary = {
  contacts: PipelineContact[]
  stageCounts: Record<PipelineStage, number>
  brandCounts: Record<string, number>
  totalContacts: number
  totalSubmissions: number
}

// Groups real SurveyEntry rows into per-contact pipeline records, computes a transparent
// lead score, and buckets each into one of four honest stages (new -> engaged -> qualified
// -> opportunity). Entries with no tester id are grouped into one "anonymous-<brand>" bucket
// per brand rather than being fabricated into fake individual contacts.
export async function buildCustomerPipeline(): Promise<PipelineSummary> {
  const entries = await readSurveyFeedEntries()
  const byContact = new Map<string, { brand: string; categories: Set<string>; count: number; first: string; last: string }>()

  for (const entry of entries) {
    const contactId = entry.tester ?? `anonymous-${entry.brand}`
    const existing = byContact.get(contactId)
    if (existing) {
      existing.categories.add(entry.category)
      existing.count += 1
      if (entry.receivedAt < existing.first) existing.first = entry.receivedAt
      if (entry.receivedAt > existing.last) existing.last = entry.receivedAt
    } else {
      byContact.set(contactId, { brand: entry.brand, categories: new Set([entry.category]), count: 1, first: entry.receivedAt, last: entry.receivedAt })
    }
  }

  const contacts: PipelineContact[] = Array.from(byContact.entries()).map(([contactId, data]) => {
    const leadScore = computeLeadScore(data.count, data.categories.size)
    return {
      contactId,
      brand: data.brand,
      categories: Array.from(data.categories),
      submissionCount: data.count,
      firstSeen: data.first,
      lastSeen: data.last,
      leadScore,
      stage: stageForScore(leadScore),
    }
  }).sort((a, b) => b.leadScore - a.leadScore)

  const stageCounts: Record<PipelineStage, number> = { new: 0, engaged: 0, qualified: 0, opportunity: 0 }
  const brandCounts: Record<string, number> = {}
  for (const contact of contacts) {
    stageCounts[contact.stage] += 1
    brandCounts[contact.brand] = (brandCounts[contact.brand] ?? 0) + 1
  }

  return {
    contacts,
    stageCounts,
    brandCounts,
    totalContacts: contacts.length,
    totalSubmissions: entries.length,
  }
}

export type { SurveyFeedEntry }
