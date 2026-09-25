/*
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { getStoredValue, setStoredValue, deleteStoredValue } from './platform-storage'

export const CORE_WORKFORCE_API_BASE = 'https://core-workforce-backend.vercel.app'

const SESSION_KEY = 'fo_core_workforce_session'
const DEVICE_FINGERPRINT_KEY = 'fo_core_workforce_device_fingerprint'

export type CoreWorkforceSession = {
  token: string
  refreshToken?: string
  userId: string
  email: string
  role: string
  tenantId: string | null
}

export async function getDeviceFingerprint(): Promise<string> {
  const existing = await getStoredValue(DEVICE_FINGERPRINT_KEY)
  if (existing) return existing
  const generated = `mobile-${Date.now()}-${Math.random().toString(36).slice(2, 12)}`
  await setStoredValue(DEVICE_FINGERPRINT_KEY, generated)
  return generated
}

export async function getSession(): Promise<CoreWorkforceSession | null> {
  const raw = await getStoredValue(SESSION_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw) as CoreWorkforceSession
  } catch {
    return null
  }
}

async function setSession(session: CoreWorkforceSession): Promise<void> {
  await setStoredValue(SESSION_KEY, JSON.stringify(session))
}

export async function clearSession(): Promise<void> {
  await deleteStoredValue(SESSION_KEY)
}

export type LoginResult =
  | { ok: true; session: CoreWorkforceSession }
  | { ok: false; error: string }

export async function login(email: string, password: string): Promise<LoginResult> {
  const deviceFingerprint = await getDeviceFingerprint()
  let response: Response
  try {
    response = await fetch(`${CORE_WORKFORCE_API_BASE}/api/v1/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Device-Fingerprint': deviceFingerprint },
      body: JSON.stringify({ email, password }),
    })
  } catch {
    return { ok: false, error: 'Cannot reach Core.Workforce. Check your connection and try again.' }
  }
  const data = await response.json().catch(() => ({}))
  if (!response.ok || !data?.success) {
    return { ok: false, error: data?.message || 'Sign in failed. Check your email and password.' }
  }
  const session: CoreWorkforceSession = {
    token: data.token,
    refreshToken: data.refreshToken,
    userId: data.user?.id,
    email: data.user?.email,
    role: data.user?.role,
    tenantId: data.user?.tenantId ?? null,
  }
  await setSession(session)
  return { ok: true, session }
}

export async function logout(): Promise<void> {
  await clearSession()
}

export class CoreWorkforceApiError extends Error {
  status: number
  constructor(message: string, status: number) {
    super(message)
    this.status = status
  }
}

// Same 15 minute access-token expiry as Core.Operations, with no prior refresh
// handling — see the matching comment in core-operations-api.ts.
let refreshInFlight: Promise<CoreWorkforceSession | null> | null = null

async function refreshSession(): Promise<CoreWorkforceSession | null> {
  if (refreshInFlight) return refreshInFlight
  refreshInFlight = (async () => {
    const current = await getSession()
    if (!current?.refreshToken) return null
    try {
      // See matching comment in core-operations-api.ts — the device fingerprint header
      // is required by the backend or every refresh attempt fails and clears the session.
      const deviceFingerprint = await getDeviceFingerprint()
      const response = await fetch(`${CORE_WORKFORCE_API_BASE}/api/v1/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-refresh-token': current.refreshToken,
          'X-Device-Fingerprint': deviceFingerprint,
        },
      })
      const data = await response.json().catch(() => ({}))
      if (!response.ok || !data?.success) {
        await clearSession()
        return null
      }
      const session: CoreWorkforceSession = {
        token: data.token,
        refreshToken: data.refreshToken,
        userId: data.user?.id,
        email: data.user?.email,
        role: data.user?.role,
        tenantId: data.user?.tenantId ?? null,
      }
      await setSession(session)
      return session
    } catch {
      return null
    }
  })()
  try {
    return await refreshInFlight
  } finally {
    refreshInFlight = null
  }
}

async function authedRequest<T>(path: string, init: RequestInit = {}): Promise<T> {
  let session = await getSession()
  if (!session) throw new CoreWorkforceApiError('Not signed in to Core.Workforce', 401)
  const deviceFingerprint = await getDeviceFingerprint()

  const send = async (activeSession: CoreWorkforceSession) => {
    const headers = new Headers(init.headers)
    headers.set('Authorization', `Bearer ${activeSession.token}`)
    headers.set('X-Device-Fingerprint', deviceFingerprint)
    if (activeSession.tenantId) headers.set('X-Tenant-Id', activeSession.tenantId)
    if (init.body) headers.set('Content-Type', 'application/json')
    return fetch(`${CORE_WORKFORCE_API_BASE}${path}`, { ...init, headers })
  }

  let response = await send(session)
  if (response.status === 401) {
    const refreshed = await refreshSession()
    if (refreshed) {
      session = refreshed
      response = await send(session)
    }
  }

  const data = await response.json().catch(() => ({}))
  if (!response.ok) {
    throw new CoreWorkforceApiError(data?.message || `Request failed (${response.status})`, response.status)
  }
  return (data?.data !== undefined ? data.data : data) as T
}

export type JobStatus = 'open' | 'closed' | 'filled'
export type CandidateStage = 'Applied' | 'Screening' | 'Interview' | 'Offer' | 'Hired' | 'Rejected'
export type InterviewStatus = 'scheduled' | 'completed' | 'cancelled' | 'no_show'
export type WorkforceActionStatus = 'proposed' | 'approved' | 'rejected' | 'executing' | 'completed' | 'reversed'

export type Job = {
  id: string
  tenantId: string
  title: string
  department?: string | null
  location?: string | null
  status: JobStatus
  description?: string | null
  createdAt: string
  updatedAt: string
}

export type Candidate = {
  id: string
  tenantId: string
  jobId: string
  job?: Job
  name: string
  email: string
  phone?: string | null
  source?: string | null
  resumeUrl?: string | null
  notes?: string | null
  stage: CandidateStage
  createdAt: string
  updatedAt: string
}

export type Interview = {
  id: string
  tenantId: string
  candidateId: string
  scheduledAt: string
  interviewer: string
  status: InterviewStatus
  outcomeNotes?: string | null
  createdBy?: string | null
  createdAt: string
  updatedAt: string
}

export type WorkforceAction = {
  id: string
  tenantId: string
  kind: string
  title: string
  summary: string
  rationale: string
  status: WorkforceActionStatus
  requiresApproval: boolean
  sourceCandidateId?: string | null
  sourceJobId?: string | null
  input: Record<string, unknown>
  simulationPreview?: Record<string, unknown> | null
  outcomeSummary?: string | null
  outcomeAssessment?: Record<string, unknown> | null
  trailEventIds?: string[]
  proposedBy: string
  approvedBy?: string | null
  approvedAt?: string | null
  executedBy?: string | null
  executedAt?: string | null
  result?: Record<string, unknown> | null
  createdAt: string
  updatedAt: string
}

export type WorkforceActionTrailEvent = {
  id: string
  tenantId: string | null
  type: string
  source: string
  payload: Record<string, unknown>
  createdAt: string
}

export const listJobs = (status?: JobStatus) =>
  authedRequest<Job[]>(`/api/v1/workforce/jobs${status ? `?status=${status}` : ''}`)

export const createJob = (input: { title: string; department?: string; location?: string; status?: JobStatus; description?: string }) =>
  authedRequest<Job>('/api/v1/workforce/jobs', { method: 'POST', body: JSON.stringify(input) })

export const updateJob = (id: string, input: Partial<{ title: string; department: string; location: string; status: JobStatus; description: string }>) =>
  authedRequest<Job>(`/api/v1/workforce/jobs/${id}`, { method: 'PATCH', body: JSON.stringify(input) })

export const deleteJob = (id: string) =>
  authedRequest<{ id: string; deleted: boolean }>(`/api/v1/workforce/jobs/${id}`, { method: 'DELETE' })

export const listCandidates = (params?: { jobId?: string; stage?: CandidateStage }) => {
  const query = new URLSearchParams()
  if (params?.jobId) query.set('jobId', params.jobId)
  if (params?.stage) query.set('stage', params.stage)
  const qs = query.toString()
  return authedRequest<Candidate[]>(`/api/v1/workforce/candidates${qs ? `?${qs}` : ''}`)
}

export const createCandidate = (input: { jobId: string; name: string; email: string; phone?: string; source?: string; resumeUrl?: string; notes?: string; stage?: CandidateStage }) =>
  authedRequest<Candidate>('/api/v1/workforce/candidates', { method: 'POST', body: JSON.stringify(input) })

export const updateCandidate = (id: string, input: Partial<{ name: string; email: string; phone: string; notes: string; stage: CandidateStage }>) =>
  authedRequest<Candidate>(`/api/v1/workforce/candidates/${id}`, { method: 'PATCH', body: JSON.stringify(input) })

export const deleteCandidate = (id: string) =>
  authedRequest<{ id: string; deleted: boolean }>(`/api/v1/workforce/candidates/${id}`, { method: 'DELETE' })

export const listInterviews = (params?: { candidateId?: string; status?: InterviewStatus }) => {
  const query = new URLSearchParams()
  if (params?.candidateId) query.set('candidateId', params.candidateId)
  if (params?.status) query.set('status', params.status)
  const qs = query.toString()
  return authedRequest<Interview[]>(`/api/v1/workforce/interviews${qs ? `?${qs}` : ''}`)
}

export const createInterview = (input: { candidateId: string; scheduledAt: string; interviewer: string; status?: InterviewStatus }) =>
  authedRequest<Interview>('/api/v1/workforce/interviews', { method: 'POST', body: JSON.stringify(input) })

export const listWorkforceActions = (status?: WorkforceActionStatus) =>
  authedRequest<WorkforceAction[]>(`/api/v1/workforce/platform/workforce-actions${status ? `?status=${status}` : ''}`)

export const proposeShortlistingAction = (input: { jobId: string; candidateId: string; targetStage?: CandidateStage }) =>
  authedRequest<WorkforceAction>('/api/v1/workforce/platform/workforce-actions/shortlisting', {
    method: 'POST',
    body: JSON.stringify(input),
  })

export const decideWorkforceAction = (id: string, decision: 'approve' | 'reject') =>
  authedRequest<WorkforceAction>(`/api/v1/workforce/platform/workforce-actions/${id}/decision`, {
    method: 'POST',
    body: JSON.stringify({ decision }),
  })

export const executeWorkforceAction = (id: string) =>
  authedRequest<WorkforceAction>(`/api/v1/workforce/platform/workforce-actions/${id}/execute`, { method: 'POST' })

export const reverseWorkforceActionExecution = (id: string) =>
  authedRequest<WorkforceAction>(`/api/v1/workforce/platform/workforce-actions/${id}/reverse`, { method: 'POST' })

export const getWorkforceActionTrail = (id: string) =>
  authedRequest<WorkforceActionTrailEvent[]>(`/api/v1/workforce/platform/workforce-actions/${id}/trail`)
