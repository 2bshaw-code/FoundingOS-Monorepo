/*
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { getStoredValue, setStoredValue, deleteStoredValue } from './platform-storage'

export const CORE_OPS_API_BASE = 'https://core-operations-backend.vercel.app'

const SESSION_KEY = 'fo_core_ops_session'
const DEVICE_FINGERPRINT_KEY = 'fo_core_ops_device_fingerprint'

export type CoreOpsSession = {
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

export async function getSession(): Promise<CoreOpsSession | null> {
  const raw = await getStoredValue(SESSION_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw) as CoreOpsSession
  } catch {
    return null
  }
}

async function setSession(session: CoreOpsSession): Promise<void> {
  await setStoredValue(SESSION_KEY, JSON.stringify(session))
}

export async function clearSession(): Promise<void> {
  await deleteStoredValue(SESSION_KEY)
}

export type LoginResult =
  | { ok: true; session: CoreOpsSession }
  | { ok: false; error: string }

export async function login(email: string, password: string): Promise<LoginResult> {
  const deviceFingerprint = await getDeviceFingerprint()
  let response: Response
  try {
    response = await fetch(`${CORE_OPS_API_BASE}/api/v1/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Device-Fingerprint': deviceFingerprint },
      body: JSON.stringify({ email, password }),
    })
  } catch {
    return { ok: false, error: 'Cannot reach Core.Operations. Check your connection and try again.' }
  }
  const data = await response.json().catch(() => ({}))
  if (!response.ok || !data?.success) {
    return { ok: false, error: data?.message || 'Sign in failed. Check your email and password.' }
  }
  const session: CoreOpsSession = {
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

export class CoreOpsApiError extends Error {
  status: number
  constructor(message: string, status: number) {
    super(message)
    this.status = status
  }
}

async function authedRequest<T>(path: string, init: RequestInit = {}): Promise<T> {
  const session = await getSession()
  if (!session) throw new CoreOpsApiError('Not signed in to Core.Operations', 401)
  const deviceFingerprint = await getDeviceFingerprint()
  const headers = new Headers(init.headers)
  headers.set('Authorization', `Bearer ${session.token}`)
  headers.set('X-Device-Fingerprint', deviceFingerprint)
  if (session.tenantId) headers.set('X-Tenant-Id', session.tenantId)
  if (init.body) headers.set('Content-Type', 'application/json')
  const response = await fetch(`${CORE_OPS_API_BASE}${path}`, { ...init, headers })
  const data = await response.json().catch(() => ({}))
  if (!response.ok) {
    throw new CoreOpsApiError(data?.message || `Request failed (${response.status})`, response.status)
  }
  return (data?.data !== undefined ? data.data : data) as T
}

export type AgentActionStatus = 'proposed' | 'approved' | 'rejected' | 'executing' | 'completed'

export type AgentAction = {
  id: string
  tenantId: string
  kind: string
  title: string
  summary: string
  rationale: string
  status: AgentActionStatus
  riskLevel: string
  requiresApproval: boolean
  input: Record<string, unknown>
  steps: Array<{ id: string; workspace: string; module: string; action: string; description: string; status: string }> | unknown
  coordinationSummary?: Record<string, unknown> | null
  historicalContext?: Record<string, unknown> | null
  predictiveSignals?: Record<string, unknown> | null
  simulationPreview?: Record<string, unknown> | null
  outcomeSummary?: string | null
  outcomeAssessment?: Record<string, unknown> | null
  estimatedValuePence?: number | null
  proposedBy: string
  approvedBy?: string | null
  approvedAt?: string | null
  executedBy?: string | null
  executedAt?: string | null
  result?: Record<string, unknown> | null
  createdAt: string
  updatedAt: string
  execution?: {
    id: string
    status: 'completed' | 'reversing' | 'reversed'
    effects: unknown
    compensation?: unknown
    executedBy: string
    executedAt: string
    reversedBy?: string | null
    reversedAt?: string | null
  } | null
}

export type AgentActionTrailEvent = {
  id: string
  tenantId: string | null
  type: string
  source: string
  payload: Record<string, unknown>
  createdAt: string
}

export type BusinessPulse = {
  openOrders: number
  orderRevenuePence: number
  unpaidInvoices: number
  outstandingPence: number
  inventoryItems: number
  lowStock: number
  leads: number
  customers: number
}

export type PlatformEvent = {
  id: string
  tenantId: string | null
  type: string
  source: string
  payload: Record<string, unknown>
  createdAt: string
}

export type InventoryItem = {
  id: string
  tenantId: string
  name: string
  sku: string
  category: string
  supplierName?: string | null
  supplierEmail?: string | null
  pricePence: number
  stock: number
  lowStockLevel: number
  createdAt: string
  updatedAt: string
}

export type SalesOrder = {
  id: string
  tenantId: string
  reference: string
  status: string
  totalPence: number
  paymentStatus?: string | null
  deliveryStatus?: string | null
  createdAt: string
  updatedAt: string
}

export type Invoice = {
  id: string
  tenantId: string
  number: string
  status: string
  totalPence: number
  dueAt?: string | null
  paidAt?: string | null
  createdAt: string
  updatedAt: string
}

export type MarketingCampaign = {
  id: string
  tenantId: string
  name: string
  objective: string
  audience: string
  platforms: string[]
  status: string
  scheduledAt?: string | null
  impressions: number
  engagements: number
  conversions: number
  revenuePence: number
  idea?: string | null
  caption?: string | null
  hashtags?: string | null
  adCopy?: string | null
  createdAt: string
  updatedAt: string
}

export type SocialPost = {
  id: string
  tenantId: string
  campaignId?: string | null
  platforms: string[]
  content: string
  mediaUrl?: string | null
  mediaType?: string | null
  status: string
  scheduledAt?: string | null
  publishedAt?: string | null
  autoPost: boolean
  createdAt: string
  updatedAt: string
}

export type MediaGeneration = {
  id: string
  tenantId: string
  format: string
  brief: string
  output: string
  context?: Record<string, unknown> | null
  createdAt: string
}

export type OwnerOperationsData = {
  inventory: InventoryItem[]
  orders: SalesOrder[]
  invoices: Invoice[]
  campaigns: MarketingCampaign[]
  socialPosts: SocialPost[]
  media: MediaGeneration[]
  deliveryOperators: Array<Record<string, unknown>>
  deliveryVehicles: Array<Record<string, unknown>>
  deliveryZones: Array<Record<string, unknown>>
  deliveryAssignments: Array<Record<string, unknown>>
  deliveryNotifications: Array<Record<string, unknown>>
  locationProfiles: Array<Record<string, unknown>>
  metrics: {
    inventoryItems: number
    lowStock: number
    inventoryValuePence: number
    orders: number
    orderRevenuePence: number
    unpaidInvoices: number
    outstandingPence: number
    campaigns: number
    scheduledPosts: number
    activeDeliveries: number
    delivered: number
    deliveryRevenuePence: number
    deliverySuccessRate: number
  }
}

export type MarketingWorkspace = {
  campaigns: MarketingCampaign[]
  socialPosts: SocialPost[]
  media: MediaGeneration[]
  metrics: {
    campaigns: number
    scheduledPosts: number
    impressions: number
    conversions: number
    revenuePence: number
  }
}

export type MessagingChannelConnection = {
  channel: string
  externalAccountId: string
  displayName?: string | null
  active: boolean
}

export type MessagingParticipant = {
  id: string
  tenantId: string
  userId?: string | null
  channel: string
  address: string
  displayName?: string | null
  role: string
  active: boolean
  createdAt: string
  updatedAt: string
}

export type MessagingReadiness = {
  operational: boolean
  activeConnections: MessagingChannelConnection[]
  authorizedParticipants: number
  failedDeliveriesLast24Hours: number
  unrecognizedMessagesLast24Hours: number
  webFallbackUrl: string
  dependencyRisk: string
}

export type ActionInteraction = {
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

export type AgentActionIntelligence = {
  interactions: ActionInteraction[]
  health: SystemIntelligenceHealth
  snapshot: IntelligenceSnapshot
  emergingSignals: EmergingSignal[]
  auditTrail: ExecutionAuditEntry[]
}

export type LicensedSuites = { core_workforce: boolean; core_intelligence: boolean }

/**
 * Real, backend-checked suite visibility — calls the TenantSuiteLicense-backed
 * /module-access endpoint for the two optional suites (Core.Operations is the
 * suite this client itself authenticates against, so it is always available).
 * Falls back to allowed on network failure so a transient outage never hides
 * a suite a tenant is actually licensed for.
 */
export async function fetchLicensedSuites(): Promise<LicensedSuites> {
  const session = await getSession()
  if (!session?.tenantId) return { core_workforce: true, core_intelligence: true }
  const check = (suite: string) =>
    authedRequest<{ success: boolean; allowed: boolean }>(`/api/v1/ops/module-access/${session.tenantId}/${suite}`)
      .then((res) => res.allowed)
      .catch(() => true)
  const [core_workforce, core_intelligence] = await Promise.all([check('core_workforce'), check('core_intelligence')])
  return { core_workforce, core_intelligence }
}

export const listAgentActions = (status?: AgentActionStatus) =>
  authedRequest<AgentAction[]>(`/api/v1/ops/platform/agent-actions${status ? `?status=${status}` : ''}`)

export const decideAgentAction = (id: string, decision: 'approve' | 'reject') =>
  authedRequest<AgentAction>(`/api/v1/ops/platform/agent-actions/${id}/decision`, {
    method: 'POST',
    body: JSON.stringify({ decision }),
  })

export const executeAgentAction = (id: string) =>
  authedRequest<AgentAction>(`/api/v1/ops/platform/agent-actions/${id}/execute`, { method: 'POST' })

export const reverseAgentActionExecution = (id: string) =>
  authedRequest<AgentAction>(`/api/v1/ops/platform/agent-actions/${id}/reverse`, { method: 'POST' })

export const getAgentActionTrail = (id: string) =>
  authedRequest<AgentActionTrailEvent[]>(`/api/v1/ops/platform/agent-actions/${id}/trail`)

export const fetchAgentActionIntelligence = () =>
  authedRequest<AgentActionIntelligence>('/api/v1/ops/platform/agent-actions-intelligence')

export const sendMessagingIntelligenceBrief = (participantId: string, actionId?: string) =>
  authedRequest<{ sent: boolean; channel: string; participantId: string; actionId: string | null; characters: number }>(
    '/api/v1/ops/platform/agent-actions-intelligence/message',
    {
      method: 'POST',
      body: JSON.stringify({ participantId, ...(actionId ? { actionId } : {}) }),
    }
  )

export async function fetchBusinessPulse(): Promise<BusinessPulse | null> {
  try {
    const data = await authedRequest<{ reports: { pipeline: Record<string, number>; operations: Record<string, number> } }>('/api/v1/ops/console/reports')
    const pipeline = data.reports?.pipeline || {}
    const operations = data.reports?.operations || {}
    return {
      openOrders: pipeline.openOrders ?? 0,
      orderRevenuePence: operations.orderRevenuePence ?? 0,
      unpaidInvoices: operations.unpaidInvoices ?? 0,
      outstandingPence: operations.outstandingPence ?? 0,
      inventoryItems: operations.inventoryItems ?? 0,
      lowStock: operations.lowStock ?? 0,
      leads: pipeline.leads ?? 0,
      customers: pipeline.customers ?? 0,
    }
  } catch {
    return null
  }
}

export const fetchOwnerOperations = () => authedRequest<OwnerOperationsData>('/api/v1/ops/owner/operations')

export const fetchMarketingWorkspace = () => authedRequest<MarketingWorkspace>('/api/v1/ops/marketing/workspace')

export async function fetchEventFeed(limit = 20): Promise<PlatformEvent[]> {
  try {
    return await authedRequest<PlatformEvent[]>(`/api/v1/ops/platform/events?limit=${limit}`)
  } catch {
    return []
  }
}

export const fetchMessagingReadiness = () => authedRequest<MessagingReadiness>('/api/v1/ops/messaging/readiness')
export const fetchMessagingConnections = () => authedRequest<MessagingChannelConnection[]>('/api/v1/ops/messaging/connections')
export const fetchMessagingParticipants = () => authedRequest<MessagingParticipant[]>('/api/v1/ops/messaging/participants')

export const createMarketingCampaign = (input: {
  name: string
  objective?: string
  audience?: string
  platforms?: string[]
  status?: string
  scheduledAt?: string
}) => authedRequest<MarketingCampaign>('/api/v1/ops/marketing/campaigns', {
  method: 'POST',
  body: JSON.stringify(input),
})

export const updateMarketingCampaign = (id: string, input: {
  status?: string
  scheduledAt?: string | null
  impressions?: number
  engagements?: number
  conversions?: number
  revenuePence?: number
}) => authedRequest<MarketingCampaign>(`/api/v1/ops/marketing/campaigns/${id}`, {
  method: 'PATCH',
  body: JSON.stringify(input),
})

export const createMarketingSocialPost = (input: {
  campaignId?: string
  platforms?: string[]
  content: string
  mediaUrl?: string
  mediaType?: string
  scheduledAt?: string
  autoPost?: boolean
}) => authedRequest<SocialPost>('/api/v1/ops/social/posts', {
  method: 'POST',
  body: JSON.stringify(input),
})

export const updateMarketingSocialPost = (id: string, input: {
  content?: string
  status?: string
  scheduledAt?: string | null
  autoPost?: boolean
}) => authedRequest<SocialPost>(`/api/v1/ops/social/posts/${id}`, {
  method: 'PATCH',
  body: JSON.stringify(input),
})

export const generateMarketingMedia = (input: { format?: string; brief: string }) =>
  authedRequest<MediaGeneration>('/api/v1/ops/media/generate', {
    method: 'POST',
    body: JSON.stringify(input),
  })
