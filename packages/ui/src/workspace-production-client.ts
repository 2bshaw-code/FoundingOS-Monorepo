'use client'

export type ProductionUser = { id: string; email: string; role: string; tenantId?: string }
export type ProductionInvitation = { id: string; email: string; role: string; permissions?: { workspaces?: string[] }; expiresAt: string; createdAt: string; invitationUrl?: string }
export type ControlSettings = {
  notificationChannel: 'whatsapp' | 'email' | 'both'
  notificationEnabled: boolean
  approvalThresholdPence: number
  requireOwnerExecution: boolean
  requireEvidence: boolean
  governanceMode: 'human_approval'
}
export type ProductionSession = { accessToken: string; refreshToken: string; user: ProductionUser }
export type ProductionWorkspaceRecord = {
  id: string
  reference: string
  name: string
  status: string
  ownerId?: string | null
  valuePence?: number | null
  data?: Record<string, unknown> | null
  version: number
  updatedAt: string
}
export type AgentActionStep = {
  id: string
  workspace: 'retail' | 'logistics' | 'finance' | 'marketing'
  module: string
  action: string
  description: string
  status: 'pending' | 'completed'
}
export type AgentAction = {
  id: string
  kind: string
  title: string
  summary: string
  rationale: string
  status: 'proposed' | 'approved' | 'rejected' | 'executing' | 'completed'
  riskLevel: 'low' | 'medium' | 'high'
  requiresApproval: boolean
  sourceEventId?: string | null
  input: Record<string, unknown>
  steps: AgentActionStep[]
  coordinationSummary?: {
    workspaces: AgentActionStep['workspace'][]
    workspaceCount: number
    inventoryRisk: string
    cashImpactPence: number
    logisticsLoad: string
    expectedOutcome: string
    tradeoffs: string[]
    patternConfidence: number
    decisionScore: number
    scoreExplanation: string[]
  } | null
  historicalContext?: {
    similarSignals: number
    proposedActions: number
    completedActions: number
    completionRate: number
    lastCompletedAt?: string | null
    lastOutcome?: Record<string, unknown> | null
    narrative: string
  } | null
  predictiveSignals?: {
    triggerPattern: string
    likelyNext: string
    likelyDownstreamEffects: string[]
    confidence: number
    confidenceLabel: 'emerging' | 'moderate' | 'strong'
    evidenceCount: number
    successfulOutcomes: number
    issueOutcomes: number
    highImpactOutcomeRate: number
    assessedOutcomes: number
    averageAccuracy: number
    reliabilityScore: number
    refined: boolean
    cohortEvidenceCount: number
    cohortTenantCount: number
    cohortIncluded: boolean
    basis: string[]
  } | null
  simulationPreview?: {
    generatedAt: string
    disclaimer: string
    workspaces: Array<{
      workspace: AgentActionStep['workspace']
      before: string
      after: string
      effect: string
      secondOrderEffects: string[]
    }>
    comparison: {
      approve: string[]
      reject: string[]
      predictedDelta: string
    }
  } | null
  outcomeSummary?: string | null
  outcomeAssessment?: {
    accuracy: number
    predictedConfidence: number
    matched: string[]
    deviations: Array<{ field: string; predicted: string; actual: string; delta: string }>
    financialDeviationPence: number
    economicOutcome?: {
      cashGovernedPence: number
      marginProtectedPence: number | null
      inventoryUnitsProtected: number
      coordinatedHandoffs: number
      estimatedOperatorMinutesSaved: number
      basis: string[]
    }
    summary: string
  } | null
  trailEventIds?: string[]
  estimatedValuePence?: number | null
  result?: Record<string, string> | null
  executionReversed?: boolean
  createdAt: string
  updatedAt: string
}
export type AgentActionInteraction = {
  id: string
  actionIds: [string, string]
  actionTitles: [string, string]
  severity: 'watch' | 'material'
  dimensions: Array<'supplier' | 'sku' | 'cash' | 'logistics'>
  summary: string
  evidence: string[]
  advisory: string
}
export type SystemIntelligenceHealth = {
  totalAssessedOutcomes: number
  averagePredictionAccuracy: number
  refinedPatterns: number
  confidenceImprovement: number
  averageReliability: number
  activePatterns: number
  interactionCount: number
  recurringDeviation: { field: string; count: number; insight: string } | null
  narrative: string
}
export type EmergingSignal = {
  id: string
  kind: 'recurring-deviation' | 'cross-action-risk' | 'strong-precedent'
  severity: 'watch' | 'material' | 'positive'
  title: string
  summary: string
  reliability: number
  outcomeCount: number
  evidence: string[]
  advisory: string
}
export type IntelligenceSnapshot = {
  totalAssessedOutcomes: number
  refinedPatterns: number
  activeInteractions: number
  recentAccuracyTrend: {
    current: number
    previous: number
    change: number
    assessmentWindow: number
    narrative: string
  }
  learningMomentum: {
    score: number
    label: 'establishing' | 'building' | 'compounding'
    narrative: string
  }
  economicValue: {
    cashGovernedPence: number
    cashPreservedPence: number
    marginProtectedPence: number | null
    inventoryUnitsProtected: number
    riskReducedActions: number
    coordinatedHandoffs: number
    estimatedOperatorMinutesSaved: number
    measuredOutcomes: number
    narrative: string
    methodology: string[]
  }
}
export type ExecutionAuditEntry = {
  id: string
  actionId: string
  actionTitle: string
  stage: 'proposed' | 'approved' | 'rejected' | 'executed' | 'assessed' | 'reversed'
  actor: string
  occurredAt: string
  summary: string
  evidence: string[]
}
export type AgentIntelligenceSummary = {
  interactions: AgentActionInteraction[]
  health: SystemIntelligenceHealth
  emergingSignals: EmergingSignal[]
  snapshot: IntelligenceSnapshot
  auditTrail: ExecutionAuditEntry[]
}

const SESSION_KEY = 'foundingos-platform-session-v1'
const configuredRoot = process.env.NEXT_PUBLIC_FOUNDINGOS_API_URL
  || process.env.NEXT_PUBLIC_CORE_OPERATIONS_API_URL?.replace(/\/ops\/?$/, '')
  || ''

export const productionModeEnabled = process.env.NEXT_PUBLIC_APP_MODE === 'production'
export const productionApiConfigured = Boolean(configuredRoot)

const apiRoot = () => {
  if (!configuredRoot) throw new Error('NEXT_PUBLIC_FOUNDINGOS_API_URL is required in production')
  return configuredRoot.replace(/\/+$/, '')
}

const readBody = async (response: Response) => {
  const body = await response.json().catch(() => ({ success: false, message: 'Invalid server response' })) as { success?: boolean; message?: string; data?: unknown }
  if (!response.ok || body.success === false) throw new Error(body.message || `Request failed with status ${response.status}`)
  return body
}

export const getProductionSession = (): ProductionSession | null => {
  if (typeof window === 'undefined') return null
  const stored = window.localStorage.getItem(SESSION_KEY)
  if (!stored) return null
  try {
    return JSON.parse(stored) as ProductionSession
  } catch {
    window.localStorage.removeItem(SESSION_KEY)
    return null
  }
}

const saveSession = (session: ProductionSession | null) => {
  if (session) window.localStorage.setItem(SESSION_KEY, JSON.stringify(session))
  else window.localStorage.removeItem(SESSION_KEY)
}

export async function loginToProduction(email: string, password: string) {
  const response = await fetch(`${apiRoot()}/auth/login`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', 'X-Device-Fingerprint': crypto.randomUUID() },
    body: JSON.stringify({ email, password }),
  })
  const body = await readBody(response) as { accessToken?: string; token?: string; refreshToken?: string; user?: ProductionUser }
  const accessToken = body.accessToken || body.token
  if (!accessToken || !body.refreshToken || !body.user) throw new Error('Authentication response did not include a complete session')
  const session = { accessToken, refreshToken: body.refreshToken, user: body.user }
  saveSession(session)
  return session
}

export async function bootstrapProduction(input: Record<string, unknown>, bootstrapToken: string) {
  const response = await fetch(`${apiRoot()}/ops/platform/bootstrap`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Bootstrap-Token': bootstrapToken },
    body: JSON.stringify(input),
  })
  return readBody(response)
}

export async function logoutProduction() {
  const session = getProductionSession()
  try {
    if (session) await fetch(`${apiRoot()}/auth/logout`, { method: 'POST', credentials: 'include', headers: { 'X-Refresh-Token': session.refreshToken } })
  } finally {
    saveSession(null)
  }
}

async function refreshSession(session: ProductionSession) {
  const response = await fetch(`${apiRoot()}/auth/refresh`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', 'X-Refresh-Token': session.refreshToken, 'X-Device-Fingerprint': crypto.randomUUID() },
    body: '{}',
  })
  const body = await readBody(response) as { accessToken?: string; token?: string; refreshToken?: string; user?: ProductionUser }
  const accessToken = body.accessToken || body.token
  if (!accessToken || !body.refreshToken || !body.user) throw new Error('Session refresh failed')
  const refreshed = { accessToken, refreshToken: body.refreshToken, user: body.user }
  saveSession(refreshed)
  return refreshed
}

export async function productionRequest<T>(path: string, init: RequestInit = {}, retry = true): Promise<T> {
  const session = getProductionSession()
  if (!session) throw new Error('Sign in to continue')
  const headers = new Headers(init.headers)
  if (!headers.has('Content-Type')) headers.set('Content-Type', 'application/json')
  headers.set('Authorization', `Bearer ${session.accessToken}`)
  const response = await fetch(`${apiRoot()}/ops${path}`, { ...init, credentials: 'include', headers })
  if (response.status === 401 && retry) {
    await refreshSession(session)
    return productionRequest<T>(path, init, false)
  }
  const body = await readBody(response) as { data: T }
  return body.data
}

export const productionRecords = {
  list: (workspace: string, module: string) => productionRequest<ProductionWorkspaceRecord[]>(`/platform/workspaces/${workspace}/${module}/records`),
  create: (workspace: string, module: string, input: Record<string, unknown>, idempotencyKey = crypto.randomUUID()) => productionRequest<ProductionWorkspaceRecord>(`/platform/workspaces/${workspace}/${module}/records`, { method: 'POST', headers: { 'Idempotency-Key': idempotencyKey }, body: JSON.stringify(input) }),
  update: (id: string, input: Record<string, unknown>) => productionRequest<ProductionWorkspaceRecord>(`/platform/records/${id}`, { method: 'PATCH', body: JSON.stringify(input) }),
}

export const productionAgentActions = {
  list: () => productionRequest<AgentAction[]>('/platform/agent-actions'),
  intelligence: () => productionRequest<AgentIntelligenceSummary>('/platform/agent-actions-intelligence'),
  messageIntelligence: (participantId: string, actionId?: string) => productionRequest<{ sent: boolean; channel: string; participantId: string; actionId: string | null; characters: number }>('/platform/agent-actions-intelligence/message', { method: 'POST', body: JSON.stringify({ participantId, actionId }) }),
  proposeReplenishment: (input: Record<string, unknown>) => productionRequest<AgentAction>('/platform/agent-actions/replenishment', { method: 'POST', body: JSON.stringify(input) }),
  propose: (kind: string, input: Record<string, unknown>) => productionRequest<AgentAction>('/platform/agent-actions/proposals', { method: 'POST', body: JSON.stringify({ kind, input }) }),
  decide: (id: string, decision: 'approve' | 'reject') => productionRequest<AgentAction>(`/platform/agent-actions/${id}/decision`, { method: 'POST', body: JSON.stringify({ decision }) }),
  execute: (id: string) => productionRequest<AgentAction>(`/platform/agent-actions/${id}/execute`, { method: 'POST', body: '{}' }),
  reverse: (id: string) => productionRequest<{ actionId: string; status: 'reversed'; compensation: { summary: string } }>(`/platform/agent-actions/${id}/reverse`, { method: 'POST', body: '{}' }),
  trail: (id: string) => productionRequest<Array<{ id: string; type: string; source: string; payload: Record<string, unknown>; createdAt: string }>>(`/platform/agent-actions/${id}/trail`),
}

export const productionPlatform = {
  controlSettings: () => productionRequest<ControlSettings | null>('/platform/control-settings'),
  saveControlSettings: (input: Partial<ControlSettings>) => productionRequest<ControlSettings>('/platform/control-settings', { method: 'PUT', body: JSON.stringify(input) }),
  governanceExport: async () => {
    const session = getProductionSession()
    if (!session) throw new Error('Sign in to continue')
    const response = await fetch(`${apiRoot()}/ops/platform/governance/export`, { credentials: 'include', headers: { Authorization: `Bearer ${session.accessToken}` } })
    if (!response.ok) throw new Error(`Export failed with status ${response.status}`)
    return response.blob()
  },
  teamInvitations: () => productionRequest<ProductionInvitation[]>('/platform/team/invitations'),
  revokeTeamInvitation: (id: string) => productionRequest<{ id: string; status: 'revoked' }>(`/platform/team/invitations/${id}/revoke`, { method: 'POST', body: '{}' }),
  resendTeamInvitation: (id: string) => productionRequest<{ invitation: ProductionInvitation; delivery: { status: string; message: string } }>(`/platform/team/invitations/${id}/resend`, { method: 'POST', body: '{}' }),
}
