/*
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
// Bridges backend workspace records to the shared professional models
// (@foundingos/ui/pro/models) so invoices, deals, campaigns and reports behave
// identically on web, SuperDash and the app.
import { documentKindFor, readProfile, type DocumentProfile, type ProPatch, type ProRecord } from '@foundingos/ui/pro/models'
import { createWorkspaceRecord, fetchWorkspaceRecords, updateWorkspaceRecord, type WorkspaceRecordDTO } from './core-operations-api'

const text = (value: unknown) => (typeof value === 'string' ? value : '')

export function dtoToPro(record: WorkspaceRecordDTO): ProRecord {
  const data = (record.data || {}) as Record<string, unknown>
  return {
    id: record.reference,
    backendId: record.id,
    version: record.version,
    name: record.name,
    secondary: text(data.secondary),
    value: record.valuePence === null || record.valuePence === undefined ? '' : String(record.valuePence / 100),
    status: record.status,
    owner: text(data.owner),
    dueDate: text(data.dueDate) || undefined,
    email: text(data.email) || undefined,
    phone: text(data.phone) || undefined,
    data,
  }
}

export const saveProPatch = (record: WorkspaceRecordDTO, patch: ProPatch) =>
  updateWorkspaceRecord(record.id, {
    version: record.version,
    ...(patch.name ? { name: patch.name } : {}),
    ...(patch.status ? { status: patch.status } : {}),
    ...(typeof patch.valuePence === 'number' ? { valuePence: patch.valuePence } : {}),
    ...(patch.data ? { data: patch.data } : {}),
  })

export const loadProRecords = async (workspace: string, module: string) => (await fetchWorkspaceRecords(workspace, module)).map(dtoToPro)

export const createProRecord = (workspace: string, module: string, input: { reference: string; name: string; status: string; valuePence: number; data: Record<string, unknown> }) =>
  createWorkspaceRecord(workspace, module, input)

// Business, VAT and bank details are shared with the web app (module `document-profile`, reference PROFILE).
export async function loadDocumentProfile(workspace: string): Promise<DocumentProfile> {
  try {
    const found = (await fetchWorkspaceRecords(workspace, 'document-profile')).find((record) => record.reference === 'PROFILE')
    return readProfile((found?.data as Record<string, unknown> | null)?.profile)
  } catch {
    return readProfile(null)
  }
}

export type ProKind = 'document' | 'deal' | 'campaign'
export function proKindFor(workspace: string, module: string): ProKind | null {
  if (documentKindFor(workspace, module)) return 'document'
  if (module === 'sales-pipeline') return 'deal'
  if (module === 'campaigns') return 'campaign'
  return null
}

export type ProReportKind = 'finance' | 'sales' | 'marketing'
export function proReportFor(workspace: string, module: string): ProReportKind | null {
  if (workspace === 'finance' && module === 'reports') return 'finance'
  if (workspace === 'retail' && module === 'reports') return 'sales'
  if (workspace === 'marketing' && (module === 'reports' || module === 'attribution')) return 'marketing'
  return null
}
