/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import type { AALDomain } from './event-bus.ts'

export type AIAuditRecord = {
  id: string
  domain: AALDomain
  action: string
  tenantId: string
  userId: string
  timestamp: string
  outcome: 'success' | 'blocked' | 'error'
  message?: string
}

const auditLog: AIAuditRecord[] = []

export function recordAIAudit(record: Omit<AIAuditRecord, 'id' | 'timestamp'>) {
  const entry = { ...record, id: `audit_${record.domain}_${record.action}_${Date.now()}`, timestamp: new Date().toISOString() }
  auditLog.push(entry)
  return entry
}

export function listAIAuditLog(tenantId?: string) {
  return auditLog.filter((record) => !tenantId || record.tenantId === tenantId)
}
