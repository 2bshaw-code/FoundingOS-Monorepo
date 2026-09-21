/*
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
// Native CRM module for the mobile app — mirrors the lead-scoring model shipped on the
// web workspace (packages/ui/src/complete-workspace-application.tsx computeLeadScore) so
// the same "Hot/Warm/Cold" reasoning is available on mobile. Contact records are generated
// deterministically client-side (same pattern already used for demo mobile data) since the
// shared operations backend has no CRM/contacts table yet — swap `buildCrmRecords` for a real
// `fetchOwnerOperations()`-style call once that endpoint exists.

export type CrmStatus = 'New' | 'Engaged' | 'Active' | 'VIP'
export const CRM_STATUSES: CrmStatus[] = ['New', 'Engaged', 'Active', 'VIP']

export type CrmRecord = {
  id: string
  name: string
  company: string
  status: CrmStatus
  valuePence: number
  owner: string
  activityCount: number
  daysUntilFollowUp: number // negative = overdue
  updatedAt: string
}

const FIRST_NAMES = ['Amelia', 'Noah', 'Isla', 'Oscar', 'Freya', 'Leo', 'Grace', 'Arthur', 'Willow', 'Jack', 'Ivy', 'Theo', 'Poppy', 'Finn']
const LAST_NAMES = ['Whitfield', 'Okafor', 'Mercer', 'Sinclair', 'Dubois', 'Hartley', 'Nakamura', 'Osei', 'Ferreira', 'Lindqvist', 'Abioye', 'Costa', 'Marsh', 'Delacroix']
const COMPANY_WORDS = ['Northwind', 'Brightside', 'Summit', 'Anchor', 'Cobalt', 'Foundry', 'Lattice', 'Harbor', 'Meridian', 'Oakstone', 'Pinnacle', 'Vantage', 'Fernway', 'Ledger']
const COMPANY_SUFFIX = ['Retail Group', 'Trading Co.', '& Partners', 'Holdings', 'Supply Ltd.', 'Collective', 'Retail Ltd.', 'Group']
const OWNERS = ['Sam', 'Priya', 'Marcus', 'Elena']

function hashString(input: string): number {
  let hash = 0
  for (let i = 0; i < input.length; i += 1) {
    hash = (hash * 31 + input.charCodeAt(i)) >>> 0
  }
  return hash
}

function pick<T>(list: T[], seed: number): T {
  return list[seed % list.length]
}

const CONTACT_COUNT = 14

export function buildCrmRecords(): CrmRecord[] {
  const records: CrmRecord[] = []
  for (let i = 0; i < CONTACT_COUNT; i += 1) {
    const seed = hashString(`crm-contact-${i}`)
    const name = `${pick(FIRST_NAMES, seed)} ${pick(LAST_NAMES, seed >> 3)}`
    const company = `${pick(COMPANY_WORDS, seed >> 5)} ${pick(COMPANY_SUFFIX, seed >> 7)}`
    const status = pick(CRM_STATUSES, seed >> 9)
    const valuePence = 45000 + (seed % 38) * 32500
    const owner = pick(OWNERS, seed >> 11)
    const activityCount = seed % 9
    const daysUntilFollowUp = (seed % 21) - 8
    const updatedDaysAgo = seed % 30
    const updatedAt = new Date(Date.now() - updatedDaysAgo * 24 * 60 * 60 * 1000).toISOString()
    records.push({ id: `crm-${i}`, name, company, status, valuePence, owner, activityCount, daysUntilFollowUp, updatedAt })
  }
  return records
}

export type LeadTier = 'Hot' | 'Warm' | 'Cold'

export function computeLeadScore(record: CrmRecord, records: CrmRecord[]): { score: number; tier: LeadTier; factors: string[] } {
  const factors: string[] = []
  let score = 0

  const stageIndex = CRM_STATUSES.indexOf(record.status)
  const stagePoints = Math.round((stageIndex / (CRM_STATUSES.length - 1)) * 35)
  score += stagePoints
  factors.push(`${record.status} stage (+${stagePoints})`)

  const avgValue = records.reduce((sum, r) => sum + r.valuePence, 0) / Math.max(1, records.length)
  const valueRatio = record.valuePence / Math.max(1, avgValue)
  const valuePoints = Math.min(25, Math.round(valueRatio * 14))
  score += valuePoints
  factors.push(`Deal value vs. average (+${valuePoints})`)

  const activityPoints = Math.min(25, record.activityCount * 6)
  score += activityPoints
  factors.push(`${record.activityCount} logged activities (+${activityPoints})`)

  let followUpPoints = 0
  if (record.daysUntilFollowUp < 0) {
    followUpPoints = -15
    factors.push(`Follow-up overdue (${followUpPoints})`)
  } else if (record.daysUntilFollowUp <= 2) {
    followUpPoints = 8
    factors.push(`Follow-up due soon (+${followUpPoints})`)
  } else {
    followUpPoints = 2
    factors.push(`Follow-up scheduled (+${followUpPoints})`)
  }
  score += followUpPoints

  score = Math.max(0, Math.min(100, score))
  const tier: LeadTier = score >= 70 ? 'Hot' : score >= 40 ? 'Warm' : 'Cold'
  return { score, tier, factors }
}

export type CreditSafetyBand = 'Low risk' | 'Medium risk' | 'High risk'
export type CreditSafetyReport = {
  score: number // 0-100, CreditSafe-style company credit score
  band: CreditSafetyBand
  limitPence: number
  updatedAt: string
  source: 'creditsafe_live' | 'demo'
}

// Real CreditSafe integration point: set CREDITSAFE_API_KEY / CREDITSAFE_USERNAME /
// CREDITSAFE_PASSWORD as EAS secrets and swap this body for a call to
// https://connect.creditsafe.com/v1/companies (auth) + /companies/{id}/creditreport.
// Until real credentials are configured this returns deterministic demo data, clearly
// labeled `source: 'demo'`, using the same company name so results stay stable per contact.
export function creditSafetyLookup(company: string): CreditSafetyReport {
  const seed = hashString(`creditsafe-${company}`)
  const score = 20 + (seed % 81)
  const band: CreditSafetyBand = score >= 70 ? 'Low risk' : score >= 40 ? 'Medium risk' : 'High risk'
  const limitPence = (5 + (seed % 45)) * 100000
  return {
    score,
    band,
    limitPence,
    updatedAt: new Date(Date.now() - (seed % 14) * 24 * 60 * 60 * 1000).toISOString(),
    source: 'demo',
  }
}
