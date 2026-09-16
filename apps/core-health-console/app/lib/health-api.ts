/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
'use client'

// Shared client-side fetch helper for the Health Console API
// (Patient, Appointment, Record, Treatment, MedicalInvoice — core-health/backend).
// Mirrors apps/core-operations-console/app/lib/retail-api.ts. Fails
// gracefully so screens never block the console shell from rendering when
// the API is unreachable.
export const CORE_API_BASE = process.env.NEXT_PUBLIC_CORE_HEALTH_API_URL || 'https://core-health-api.foundingos.com/api/v1'

export type Patient = { id: string; name: string; phone?: string; dateOfBirth?: string; createdAt: string }
export type Appointment = { id: string; patientId: string; scheduledAt: string; status: string; reason?: string }
export type MedicalRecord = { id: string; patientId: string; summary: string; createdAt: string }
export type Treatment = { id: string; patientId: string; description: string; status: string }
export type MedicalInvoice = { id: string; patientId: string; amountPence: number; status: string; createdAt: string; sentAt?: string | null; syncedToFinanceAt?: string | null }
export type ComplianceFlag = { id: string; patientId?: string; issue: string; createdAt: string }

function authHeaders(): HeadersInit | undefined {
  if (typeof window === 'undefined') return undefined
  const token = window.localStorage.getItem('foundingos_token')
  return token ? { Authorization: `Bearer ${token}` } : undefined
}

export async function coreApiFetch<T>(path: string, init: RequestInit = {}): Promise<T | null> {
  try {
    const response = await fetch(`${CORE_API_BASE}${path}`, {
      ...init,
      headers: { ...authHeaders(), ...(init.headers || {}) },
    })
    if (!response.ok) return null
    return (await response.json()) as T
  } catch {
    return null
  }
}

export const fetchPatients = () => coreApiFetch<Patient[]>('/patients')
export const fetchPatient = (id: string) => coreApiFetch<Patient>(`/patients/${id}`)
export const createPatient = (input: Partial<Patient>) =>
  coreApiFetch<Patient>('/patients', { method: 'POST', body: JSON.stringify(input), headers: { 'Content-Type': 'application/json' } })
export const updatePatient = (id: string, input: Partial<Patient>) =>
  coreApiFetch<Patient>(`/patients/${id}`, { method: 'PATCH', body: JSON.stringify(input), headers: { 'Content-Type': 'application/json' } })

export const fetchAppointments = () => coreApiFetch<Appointment[]>('/appointments')
export const createAppointment = (input: Partial<Appointment>) =>
  coreApiFetch<Appointment>('/appointments', { method: 'POST', body: JSON.stringify(input), headers: { 'Content-Type': 'application/json' } })
export const updateAppointmentStatus = (id: string, status: string) =>
  coreApiFetch<Appointment>(`/appointments/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }), headers: { 'Content-Type': 'application/json' } })
export const fetchNoShowPredictions = () => coreApiFetch<{ appointmentId: string; risk: number }[]>('/appointments/predict-no-shows')

export const fetchRecords = (patientId?: string) =>
  coreApiFetch<MedicalRecord[]>(`/records${patientId ? `?patientId=${patientId}` : ''}`)
export const createRecord = (input: Partial<MedicalRecord>) =>
  coreApiFetch<MedicalRecord>('/records', { method: 'POST', body: JSON.stringify(input), headers: { 'Content-Type': 'application/json' } })

export const createTreatment = (input: Partial<Treatment>) =>
  coreApiFetch<Treatment>('/treatments', { method: 'POST', body: JSON.stringify(input), headers: { 'Content-Type': 'application/json' } })
export const updateTreatmentStatus = (id: string, status: string) =>
  coreApiFetch<Treatment>(`/treatments/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }), headers: { 'Content-Type': 'application/json' } })

export const fetchMedicalInvoices = () => coreApiFetch<MedicalInvoice[]>('/billing')
export const createMedicalInvoice = (input: Partial<MedicalInvoice>) =>
  coreApiFetch<MedicalInvoice>('/billing', { method: 'POST', body: JSON.stringify(input), headers: { 'Content-Type': 'application/json' } })
export const sendMedicalInvoice = (id: string) => coreApiFetch<MedicalInvoice>(`/billing/${id}/send`, { method: 'POST' })
export const syncMedicalBillingToFinance = (id: string) => coreApiFetch<MedicalInvoice>(`/billing/${id}/sync-to-finance`, { method: 'POST' })

export const fetchComplianceFlags = () => coreApiFetch<ComplianceFlag[]>('/compliance/flags')
export const flagComplianceIssues = () => coreApiFetch<ComplianceFlag[]>('/compliance/flag-issues', { method: 'POST' })
