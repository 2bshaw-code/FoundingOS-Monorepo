/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
'use client'

// Shared client-side fetch helper for the Talent Console API
// (Job, Applicant, Worker, Timesheet, PayrollRun — core-workforce/backend).
// Mirrors apps/core-operations-console/app/lib/retail-api.ts. Fails
// gracefully so screens never block the console shell from rendering when
// the API is unreachable.
export const CORE_API_BASE = process.env.NEXT_PUBLIC_CORE_WORKFORCE_API_URL || 'https://core-workforce-api.foundingos.com/api/v1'

export type Job = { id: string; title: string; department?: string; status: string; createdAt: string }
export type Applicant = { id: string; jobId: string; name: string; stage: string; createdAt: string }
export type Worker = { id: string; name: string; role: string; region?: string; employmentType: string }
export type Timesheet = { id: string; workerId: string; periodStart: string; periodEnd: string; hours: number; status: string }
export type PayrollRun = { id: string; periodStart: string; periodEnd: string; totalPence: number; status: string; syncedToFinanceAt?: string | null }

function authHeaders(): HeadersInit | undefined {
  if (typeof window === 'undefined') return undefined
  const token = window.localStorage.getItem('foundingos_token')
  return token ? { Authorization: 'Bearer ' + token } : undefined
}

export async function coreApiFetch<T>(path: string, init: RequestInit = {}): Promise<T | null> {
  try {
    const response = await fetch(`${CORE_API_BASE}${path}`, {
      ...init,
      headers: { ...authHeaders(), ...(init.headers || {}) },
    })
    if (!response.ok) return null
    const data = await response.json().catch(() => null)
    return (data?.data ?? null) as T | null
  } catch {
    return null
  }
}

export const fetchJobs = () => coreApiFetch<Job[]>('/jobs')
export const createJob = (input: Record<string, unknown>) => coreApiFetch<Job>('/jobs', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(input) })

export const fetchApplicants = () => coreApiFetch<Applicant[]>('/candidates')
export const createApplicant = (input: Record<string, unknown>) => coreApiFetch<Applicant>('/candidates', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(input) })
export const moveApplicantStage = (id: string, stage: string) =>
  coreApiFetch<Applicant>(`/candidates/${id}/stage`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ stage }) })

export const fetchWorkers = () => coreApiFetch<Worker[]>('/workers')
export const createWorker = (input: Record<string, unknown>) => coreApiFetch<Worker>('/workers', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(input) })

export const fetchTimesheets = () => coreApiFetch<Timesheet[]>('/timesheets')
export const approveTimesheet = (id: string) => coreApiFetch<Timesheet>(`/timesheets/${id}/approve`, { method: 'POST' })

export const fetchPayrollRuns = () => coreApiFetch<PayrollRun[]>('/payroll')
export const triggerPayrollRun = (input: Record<string, unknown>) => coreApiFetch<PayrollRun>('/payroll', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(input) })
export const syncPayrollToFinance = (id: string) => coreApiFetch<PayrollRun>(`/payroll/${id}/sync-to-finance`, { method: 'POST' })
