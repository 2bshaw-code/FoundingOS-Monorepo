/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { authedFetch } from './api'
import { IS_DEMO_MODE } from '@foundingos/ui/mobile-runtime-mode'

// Points at the new core-health/backend Health Console API (Patient,
// Appointment, Record, Treatment, MedicalInvoice, ComplianceFlag — see
// docs/console-requirements.md). This is separate from GROWTH_CONSOLE_URL
// (the legacy per-brand demo clinic-feed in clinic-feed.ts) — CORE_API_BASE
// is the real FoundingOS Core.Intelligence-backed Health Console service.
export const CORE_API_BASE = 'https://core-health-api.foundingos.com/api/v1'

export type Patient = { id: string; name: string; dateOfBirth?: string; phone?: string }
export type Appointment = { id: string; patientId: string; scheduledAt: string; status: string; reason?: string }
export type MedicalRecord = { id: string; patientId: string; note: string; createdAt: string }
export type Treatment = { id: string; patientId: string; description: string; status: string }
export type MedicalInvoice = { id: string; patientId: string; number: string; totalPence: number; status: string; dueAt?: string }
export type ComplianceFlag = { id: string; kind: string; detail: string; severity: string; createdAt: string }

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

export const fetchPatients = () => coreApiFetch<Patient[]>('/patients')
export const fetchAppointments = () => coreApiFetch<Appointment[]>('/appointments')
export const fetchPredictedNoShows = () => coreApiFetch<Appointment[]>('/appointments/predict-no-shows')
export const fetchRecords = (patientId?: string) => coreApiFetch<MedicalRecord[]>(`/records${patientId ? `?patientId=${patientId}` : ''}`)
export const fetchMedicalInvoices = () => coreApiFetch<MedicalInvoice[]>('/billing')
export const fetchComplianceFlags = () => coreApiFetch<ComplianceFlag[]>('/compliance/flags')

export const updateAppointmentStatus = (id: string, status: string) =>
  coreApiFetch<Appointment>(`/appointments/${id}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  })

export const syncMedicalBillingToFinance = (id: string) =>
  coreApiFetch<MedicalInvoice>(`/billing/${id}/sync-to-finance`, { method: 'POST' })

export const sendMedicalInvoice = (id: string) =>
  coreApiFetch<MedicalInvoice>(`/billing/${id}/send`, { method: 'POST' })
