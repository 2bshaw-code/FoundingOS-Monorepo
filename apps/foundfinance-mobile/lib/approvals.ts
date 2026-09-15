/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { getJSON, setJSON } from './local-store'
import { postBespokeAction } from './bespoke-actions'
import type { PendingApproval } from './cashflow'

export type ApprovalDecision = {
  id: string
  decision: 'approved' | 'rejected'
  decidedAt: string
}

// A locally-scanned receipt/invoice that hasn't been fed into the real backend (there is no
// real invoicing/expense-submission backend behind FoundFinance's demo mode) — added to the
// approvals queue as a genuinely pending item, clearly distinct from the server-provided demo
// items by its id prefix.
export type ScannedApproval = PendingApproval & { scannedAt: string }

const DECISIONS_KEY = 'fo_finance_approval_decisions'
const SCANNED_KEY = 'fo_finance_scanned_approvals'

// Real approvals ledger, now with real write-back — there is no live payments/AP backend
// behind FoundFinance's demo mode (the only real backend is the deterministic cashflow feed at
// /api/finance/cashflow), so approve/reject persists on-device for instant/offline UI, but
// every decision is also written through to the real module_actions table
// (moduleId "finance-approvals") via POST /api/console/bespoke-actions — real, durable, and
// cross-device, clearly labelled in the UI as a paper (not live-money-moved) decision.
export async function getDecisions(): Promise<Record<string, ApprovalDecision>> {
  return getJSON<Record<string, ApprovalDecision>>(DECISIONS_KEY, {})
}

export async function recordDecision(id: string, decision: 'approved' | 'rejected'): Promise<ApprovalDecision> {
  const decisions = await getDecisions()
  const record: ApprovalDecision = { id, decision, decidedAt: new Date().toISOString() }
  decisions[id] = record
  await setJSON(DECISIONS_KEY, decisions)
  await postBespokeAction({ moduleId: 'finance-approvals', action: decision === 'approved' ? 'Approve' : 'Reject', note: id, payload: record })
  return record
}

export async function resetDecisions(): Promise<void> {
  await setJSON(DECISIONS_KEY, {})
}

export async function getScannedApprovals(): Promise<ScannedApproval[]> {
  return getJSON<ScannedApproval[]>(SCANNED_KEY, [])
}

// Called by the receipt scanner after a successful capture — turns the scan into a new
// pending approval item so it shows up in both the Cash Flow spend breakdown and the
// Approvals queue, same as a real invoice/expense would.
export async function addScannedApproval(input: { supplier: string; category: string; amountUsd: number }): Promise<ScannedApproval> {
  const scanned = await getScannedApprovals()
  const entry: ScannedApproval = {
    id: `scan-${Date.now()}`,
    kind: 'expense',
    supplier: input.supplier,
    category: input.category,
    amountUsd: input.amountUsd,
    scannedAt: new Date().toISOString(),
  }
  scanned.unshift(entry)
  await setJSON(SCANNED_KEY, scanned)
  return entry
}
