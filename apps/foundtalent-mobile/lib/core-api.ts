/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { authedFetch } from './api'
import { IS_DEMO_MODE } from '@foundingos/ui/mobile-runtime-mode'

// Points at core-workforce/backend's Talent Console API (Job, Applicant,
// Worker, Timesheet, PayrollRun — see docs/console-requirements.md). This is
// separate from GROWTH_CONSOLE_URL (the legacy per-brand demo pipeline feed
// in talent-pipeline.ts) — CORE_API_BASE is the real FoundingOS
// Core.Workforce backend that now backs worker directory, timesheets, and
// payroll runs.
export const CORE_API_BASE = 'https://core-workforce-api.foundingos.com/api/v1'

export type Worker = { id: string; name: string; role: string; region?: string; employmentType: string }
export type Timesheet = { id: string; workerId: string; periodStart: string; periodEnd: string; hours: number; status: string }
export type PayrollRun = { id: string; periodStart: string; periodEnd: string; totalPence: number; status: string; syncedToFinanceAt?: string }

async function coreApiFetch<T>(path: string, init: RequestInit = {}): Promise<T | null> {
  if (IS_DEMO_MODE) return null
  try {
    const response = await authedFetch(`${CORE_API_BASE}${path}`, init)
    if (!response.ok) return null
    const data = await response.json().catch(() => null)
    return (data?.data ?? null) as T | null
  } catch {
    return null
  }
}

export const fetchWorkers = () => coreApiFetch<Worker[]>('/workers')
export const fetchTimesheets = () => coreApiFetch<Timesheet[]>('/timesheets')
export const fetchPayrollRuns = () => coreApiFetch<PayrollRun[]>('/payroll')

export const submitTimesheet = (input: { workerId: string; periodStart: string; periodEnd: string; hours: number }) =>
  coreApiFetch<Timesheet>('/timesheets', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  })

export const approveTimesheet = (id: string) =>
  coreApiFetch<Timesheet>(`/timesheets/${id}/approve`, { method: 'POST' })

export const triggerPayrollRun = (input: { periodStart: string; periodEnd: string; totalPence: number }) =>
  coreApiFetch<PayrollRun>('/payroll', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  })

export const syncPayrollToFinance = (id: string) =>
  coreApiFetch<PayrollRun>(`/payroll/${id}/sync-to-finance`, { method: 'POST' })
