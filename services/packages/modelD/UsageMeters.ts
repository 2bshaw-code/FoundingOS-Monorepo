/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import type { AALDomain, AALIntent } from '../../ai/events/event-bus.ts'

export type AIUsageRecord = {
  tenantId: string
  domain: AALDomain
  action: AALIntent | string
  count: number
  recordedAt: string
}

const usageLedger: AIUsageRecord[] = []

export function recordAIUsage(tenantId: string, domain: AALDomain, action: AALIntent | string) {
  const record = { tenantId, domain, action, count: 1, recordedAt: new Date().toISOString() }
  usageLedger.push(record)
  return record
}

export function getAIUsage(tenantId: string, domain?: AALDomain) {
  return usageLedger.filter((record) => record.tenantId === tenantId && (!domain || record.domain === domain))
}

export function enforceUsageLimits(tenantId: string, domain: AALDomain, action: AALIntent | string) {
  const domainUsage = getAIUsage(tenantId, domain).length
  const limit = action === 'automate' || action === 'approve' ? 500 : 2500
  return {
    allowed: domainUsage < limit,
    usage: domainUsage,
    limit,
    reason: domainUsage < limit ? 'Usage available.' : `${domain} ${action} usage limit reached.`,
  }
}
