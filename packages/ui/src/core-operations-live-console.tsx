'use client'

import { useCallback, useEffect, useMemo, useState, type CSSProperties, type FormEvent, type ReactNode } from 'react'

const CORE_OPS_API_BASE = process.env.NEXT_PUBLIC_CORE_OPERATIONS_API_URL || 'https://core-operations-backend.vercel.app'
const CORE_OPS_PROXY_PREFIX = '/api/core-operations'
const CORE_OPS_API_PREFIX = `${CORE_OPS_PROXY_PREFIX}/ops`
const CORE_OPS_SESSION_KEY = 'foundingos-core-operations-console-session-v1'
const CORE_OPS_DEVICE_KEY = 'foundingos-core-operations-console-device-v1'

type CoreOpsSession = {
  token: string
  refreshToken?: string
  userId: string
  email: string
  role: string
  tenantId: string | null
}

type Customer = {
  id: string
  tenantId: string
  companyName: string
  contactName?: string | null
  email?: string | null
  phone?: string | null
  source?: string | null
  createdAt: string
  updatedAt: string
  leads?: Array<{ id: string }>
}

type InventoryItem = {
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
  active: boolean
  availability: string
  approvalStatus: string
  createdAt: string
  updatedAt: string
}

type SalesOrder = {
  id: string
  tenantId: string
  customerId?: string | null
  reference: string
  status: string
  totalPence: number
  paymentStatus: string
  paymentMethod?: string | null
  deliveryStatus: string
  deliveryAddress?: string | null
  notes?: string | null
  createdAt: string
  updatedAt: string
}

type Invoice = {
  id: string
  tenantId: string
  customerId?: string | null
  number: string
  status: string
  subtotalPence: number
  taxPence: number
  totalPence: number
  dueAt?: string | null
  paidAt?: string | null
  sentAt?: string | null
  createdAt: string
  updatedAt: string
}

type MarketingCampaign = {
  id: string
  tenantId: string
  name: string
  objective: string
  audience: string
  platforms: unknown
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

type SocialPost = {
  id: string
  tenantId: string
  campaignId?: string | null
  platforms: unknown
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

type MediaGeneration = {
  id: string
  tenantId: string
  format: string
  brief: string
  output: string
  context?: Record<string, unknown> | null
  createdAt: string
}

type DeliveryOperator = {
  id: string
  tenantId: string
  name: string
  phone: string
  role: string
  status: string
  phoneVerified: boolean
  active: boolean
  createdAt: string
  updatedAt: string
}

type DeliveryVehicle = {
  id: string
  tenantId: string
  registration: string
  label: string
  vehicleType: string
  capacityKg: number
  status: string
  currentLat?: number | null
  currentLng?: number | null
  lastLocationAt?: string | null
  active: boolean
  createdAt: string
  updatedAt: string
}

type DeliveryZone = {
  id: string
  tenantId: string
  name: string
  postcodePrefixes: unknown
  feePence: number
  estimatedMinutes: number
  feeMode: string
  cashOnDeliveryAllowed: boolean
  active: boolean
  createdAt: string
  updatedAt: string
}

type DeliveryAssignment = {
  id: string
  tenantId: string
  orderId: string
  operatorId?: string | null
  vehicleId?: string | null
  zoneId?: string | null
  status: string
  feePence: number
  routeDistanceKm: number
  estimatedMinutes: number
  originLat?: number | null
  originLng?: number | null
  destinationLat?: number | null
  destinationLng?: number | null
  timeline: unknown
  assignedAt: string
  completedAt?: string | null
  updatedAt: string
}

type DeliveryNotification = {
  id: string
  tenantId: string
  assignmentId?: string | null
  channel: string
  recipient: string
  message: string
  status: string
  sentAt?: string | null
  createdAt: string
}

type LocationProfile = {
  id: string
  tenantId: string
  label: string
  latitude?: number | null
  longitude?: number | null
  locality?: string | null
  countryCode?: string | null
  timezone?: string | null
  source: string
  gpsEnabled: boolean
  ipFallbackEnabled: boolean
  updatedAt: string
  createdAt: string
}

type OperationsSummary = {
  inventory: InventoryItem[]
  orders: SalesOrder[]
  invoices: Invoice[]
  campaigns: MarketingCampaign[]
  socialPosts: SocialPost[]
  media: MediaGeneration[]
  deliveryOperators: DeliveryOperator[]
  deliveryVehicles: DeliveryVehicle[]
  deliveryZones: DeliveryZone[]
  deliveryAssignments: DeliveryAssignment[]
  deliveryNotifications: DeliveryNotification[]
  locationProfiles: LocationProfile[]
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

type IntelligenceSummary = {
  interactions: Array<{
    id: string
    actionIds: [string, string]
    actionTitles: [string, string]
    severity: 'watch' | 'material'
    dimensions: string[]
    summary: string
    evidence: string[]
    advisory: string
  }>
  health: {
    totalAssessedOutcomes: number
    averagePredictionAccuracy: number
    refinedPatterns: number
    confidenceImprovement: number
    averageReliability: number
    activePatterns: number
    interactionCount: number
    recurringDeviation?: { field: string; count: number; insight: string } | null
    narrative: string
  }
  snapshot: {
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
  emergingSignals: Array<{
    id: string
    kind: string
    severity: 'watch' | 'material' | 'positive'
    title: string
    summary: string
    reliability: number
    outcomeCount: number
    evidence: string[]
    advisory: string
  }>
  auditTrail: Array<{
    id: string
    actionId: string
    actionTitle: string
    stage: string
    actor: string
    occurredAt: string
    summary: string
    evidence: string[]
  }>
}

type LocationWeather = {
  location: {
    latitude: number
    longitude: number
    locality?: string
    countryCode?: string
    timezone?: string
    source?: string
  }
  weather: {
    temperature?: number
    apparentTemperature?: number
    weatherCode?: number
    windSpeed?: number
    units?: Record<string, string>
    observedAt?: string
  }
}

type MessagingReadiness = {
  operational: boolean
  activeConnections: Array<{ channel: string; externalAccountId: string; displayName?: string | null; active: boolean }>
  authorizedParticipants: number
  failedDeliveriesLast24Hours: number
  unrecognizedMessagesLast24Hours: number
  webFallbackUrl: string
  dependencyRisk: string
}

type MessagingConnection = {
  id: string
  tenantId: string
  channel: string
  externalAccountId: string
  displayName?: string | null
  active: boolean
  createdAt: string
  updatedAt: string
}

type MessagingParticipant = {
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

type CoreOperationsWorkspaceData = {
  summary: OperationsSummary | null
  customers: Customer[]
  intelligence: IntelligenceSummary | null
  weather: LocationWeather | null
  messagingReadiness: MessagingReadiness | null
  messagingConnections: MessagingConnection[]
  messagingParticipants: MessagingParticipant[]
  loading: boolean
  error: string
  notices: string[]
  reload: () => Promise<void>
}

type FormState = {
  busy: boolean
  error: string
  notice: string
}

const money = (pence: number | null | undefined) => new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }).format((pence ?? 0) / 100)
const integer = (value: number | null | undefined) => new Intl.NumberFormat('en-GB').format(value ?? 0)
const percentage = (value: number | null | undefined) => `${Math.round(value ?? 0)}%`
const shortDate = (value?: string | null) => value ? new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: 'short' }).format(new Date(value)) : '—'
const dateTime = (value?: string | null) => value ? new Intl.DateTimeFormat('en-GB', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value)) : '—'
const inputDateTime = (value?: string | null) => value ? new Date(value).toISOString().slice(0, 16) : ''
const titleCase = (value: string) => value.replace(/[_-]+/g, ' ').replace(/\b\w/g, (character) => character.toUpperCase())
const safeArray = (value: unknown) => Array.isArray(value) ? value : []
const statusTone = (value: string) => /fail|overdue|cancel|exception|risk|out/i.test(value) ? '#fecaca' : /pending|draft|open|queued|watch|review|unassigned/i.test(value) ? '#fde68a' : '#bbf7d0'

function createDeviceFingerprint() {
  return `core-ops-console-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`
}

function readStoredSession(): CoreOpsSession | null {
  if (typeof window === 'undefined') return null
  const raw = window.localStorage.getItem(CORE_OPS_SESSION_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw) as CoreOpsSession
  } catch {
    return null
  }
}

function writeStoredSession(session: CoreOpsSession) {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(CORE_OPS_SESSION_KEY, JSON.stringify(session))
}

function clearStoredSession() {
  if (typeof window === 'undefined') return
  window.localStorage.removeItem(CORE_OPS_SESSION_KEY)
}

function getDeviceFingerprint() {
  if (typeof window === 'undefined') return createDeviceFingerprint()
  const existing = window.localStorage.getItem(CORE_OPS_DEVICE_KEY)
  if (existing) return existing
  const generated = createDeviceFingerprint()
  window.localStorage.setItem(CORE_OPS_DEVICE_KEY, generated)
  return generated
}

async function loginToCoreOperations(email: string, password: string): Promise<CoreOpsSession> {
  const response = await fetch(`${CORE_OPS_PROXY_PREFIX}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Device-Fingerprint': getDeviceFingerprint(),
    },
    body: JSON.stringify({ email, password }),
  })
  const body = await response.json().catch(() => ({}))
  if (!response.ok || !body?.success) {
    throw new Error(body?.message || 'Sign in failed. Check the seeded Core.Operations credentials and try again.')
  }
  const session: CoreOpsSession = {
    token: String(body.token || ''),
    refreshToken: typeof body.refreshToken === 'string' ? body.refreshToken : undefined,
    userId: String(body.user?.id || ''),
    email: String(body.user?.email || email),
    role: String(body.user?.role || ''),
    tenantId: body.user?.tenantId ? String(body.user.tenantId) : null,
  }
  writeStoredSession(session)
  return session
}

async function coreOpsRequest<T>(session: CoreOpsSession, path: string, init: RequestInit = {}): Promise<T> {
  const headers = new Headers(init.headers)
  headers.set('Authorization', `Bearer ${session.token}`)
  headers.set('X-Device-Fingerprint', getDeviceFingerprint())
  if (session.tenantId) headers.set('X-Tenant-Id', session.tenantId)
  if (init.body) headers.set('Content-Type', 'application/json')
  const response = await fetch(`${CORE_OPS_API_PREFIX}${path}`, { ...init, headers })
  const body = await response.json().catch(() => ({}))
  if (!response.ok) {
    if (response.status === 401) clearStoredSession()
    throw new Error(body?.message || `Core.Operations request failed (${response.status})`)
  }
  return (body?.data !== undefined ? body.data : body) as T
}

function platformsLabel(value: unknown) {
  const list = safeArray(value).map((item) => String(item)).filter(Boolean)
  return list.length ? list.join(', ') : '—'
}

function groupSeries<T>(
  rows: T[],
  dateSelector: (row: T) => string | null | undefined,
  valueSelector: (row: T) => number,
  days = 7,
) {
  const buckets = new Map<string, number>()
  for (let index = days - 1; index >= 0; index -= 1) {
    const day = new Date()
    day.setHours(0, 0, 0, 0)
    day.setDate(day.getDate() - index)
    buckets.set(day.toISOString().slice(0, 10), 0)
  }
  for (const row of rows) {
    const rawDate = dateSelector(row)
    if (!rawDate) continue
    const date = new Date(rawDate)
    if (Number.isNaN(date.getTime())) continue
    const key = date.toISOString().slice(0, 10)
    if (buckets.has(key)) buckets.set(key, (buckets.get(key) ?? 0) + valueSelector(row))
  }
  return [...buckets.entries()].map(([key, value]) => ({
    key,
    label: new Intl.DateTimeFormat('en-GB', { weekday: 'short' }).format(new Date(key)),
    value,
  }))
}

function countByLabel(values: string[]) {
  const counts = new Map<string, number>()
  for (const value of values) counts.set(value, (counts.get(value) ?? 0) + 1)
  return [...counts.entries()].map(([label, value]) => ({ label, value })).sort((left, right) => right.value - left.value)
}

function useCoreOperationsData(session: CoreOpsSession): CoreOperationsWorkspaceData {
  const [summary, setSummary] = useState<OperationsSummary | null>(null)
  const [customers, setCustomers] = useState<Customer[]>([])
  const [intelligence, setIntelligence] = useState<IntelligenceSummary | null>(null)
  const [weather, setWeather] = useState<LocationWeather | null>(null)
  const [messagingReadiness, setMessagingReadiness] = useState<MessagingReadiness | null>(null)
  const [messagingConnections, setMessagingConnections] = useState<MessagingConnection[]>([])
  const [messagingParticipants, setMessagingParticipants] = useState<MessagingParticipant[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [notices, setNotices] = useState<string[]>([])

  const reload = useCallback(async () => {
    setLoading(true)
    setError('')
    const results = await Promise.allSettled([
      coreOpsRequest<OperationsSummary>(session, '/owner/operations'),
      coreOpsRequest<Customer[]>(session, '/customers'),
      coreOpsRequest<IntelligenceSummary>(session, '/platform/agent-actions-intelligence'),
      coreOpsRequest<LocationWeather>(session, '/location/weather'),
      coreOpsRequest<MessagingReadiness>(session, '/messaging/readiness'),
      coreOpsRequest<MessagingConnection[]>(session, '/messaging/connections'),
      coreOpsRequest<MessagingParticipant[]>(session, '/messaging/participants'),
    ])

    const nextNotices: string[] = []
    const [summaryResult, customersResult, intelligenceResult, weatherResult, readinessResult, connectionsResult, participantsResult] = results

    if (summaryResult.status === 'fulfilled') setSummary(summaryResult.value)
    else setError(summaryResult.reason instanceof Error ? summaryResult.reason.message : 'Core.Operations data could not be loaded.')

    if (customersResult.status === 'fulfilled') setCustomers(customersResult.value)
    else nextNotices.push('Customer list unavailable right now.')

    if (intelligenceResult.status === 'fulfilled') setIntelligence(intelligenceResult.value)
    else nextNotices.push('Agent intelligence summary unavailable right now.')

    if (weatherResult.status === 'fulfilled') setWeather(weatherResult.value)
    else nextNotices.push('Weather lookup is currently unavailable.')

    if (readinessResult.status === 'fulfilled') setMessagingReadiness(readinessResult.value)
    else nextNotices.push('Messaging readiness could not be refreshed.')

    if (connectionsResult.status === 'fulfilled') setMessagingConnections(connectionsResult.value)
    else nextNotices.push('Messaging connections could not be loaded.')

    if (participantsResult.status === 'fulfilled') setMessagingParticipants(participantsResult.value)
    else nextNotices.push('Messaging participants could not be loaded.')

    setNotices(nextNotices)
    setLoading(false)
  }, [session])

  useEffect(() => {
    void reload()
  }, [reload])

  return { summary, customers, intelligence, weather, messagingReadiness, messagingConnections, messagingParticipants, loading, error, notices, reload }
}

function useFormState(): [FormState, (state: Partial<FormState>) => void, () => void] {
  const [state, setState] = useState<FormState>({ busy: false, error: '', notice: '' })
  const patch = useCallback((next: Partial<FormState>) => setState((current) => ({ ...current, ...next })), [])
  const reset = useCallback(() => setState({ busy: false, error: '', notice: '' }), [])
  return [state, patch, reset]
}

function NoticeBanner({ tone = 'info', children }: { tone?: 'info' | 'error' | 'success'; children: ReactNode }) {
  const colors = tone === 'error'
    ? { background: 'rgba(127, 29, 29, 0.42)', border: 'rgba(252, 165, 165, 0.32)', text: '#fee2e2' }
    : tone === 'success'
      ? { background: 'rgba(20, 83, 45, 0.42)', border: 'rgba(134, 239, 172, 0.3)', text: '#dcfce7' }
      : { background: 'rgba(15, 23, 42, 0.82)', border: 'rgba(148, 163, 184, 0.22)', text: '#dbeafe' }
  return <div className="panel" style={{ background: colors.background, borderColor: colors.border, color: colors.text }}>{children}</div>
}

function Pill({ children, tone }: { children: ReactNode; tone?: string }) {
  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      borderRadius: 999,
      padding: '4px 10px',
      border: `1px solid ${tone ?? 'rgba(148,163,184,0.28)'}`,
      color: tone ?? '#cbd5e1',
      fontSize: 12,
      fontWeight: 700,
      textTransform: 'capitalize',
    }}>{children}</span>
  )
}

function MetricCard({ label, value, detail }: { label: string; value: string; detail: string }) {
  return (
    <article className="panel" style={{ display: 'grid', gap: 8 }}>
      <p className="eyebrow">{label}</p>
      <strong style={{ fontSize: 32, lineHeight: 1.05 }}>{value}</strong>
      <span style={{ color: '#a8b3c3' }}>{detail}</span>
    </article>
  )
}

function SectionHeader({ eyebrow, title, description, actions }: { eyebrow: string; title: string; description: string; actions?: ReactNode }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16, flexWrap: 'wrap' }}>
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h1 style={{ margin: '6px 0 8px', fontSize: 'clamp(2rem, 3vw, 3rem)' }}>{title}</h1>
        <p style={{ margin: 0, maxWidth: 880, color: '#cbd5e1' }}>{description}</p>
      </div>
      {actions}
    </div>
  )
}

function HeaderActions({ onRefresh, onLogout, refreshing }: { onRefresh: () => void; onLogout: () => void; refreshing: boolean }) {
  return (
    <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
      <button type="button" className="btn btn-secondary" onClick={onRefresh} disabled={refreshing}>{refreshing ? 'Refreshing…' : 'Refresh live data'}</button>
      <button type="button" className="btn btn-secondary" onClick={onLogout}>Sign out</button>
    </div>
  )
}

function StatusTable({ headers, rows }: { headers: string[]; rows: ReactNode[][] }) {
  return (
    <div className="panel" style={{ overflowX: 'auto' }}>
      <table className="retail-data-table">
        <thead><tr>{headers.map((header) => <th key={header}>{header}</th>)}</tr></thead>
        <tbody>{rows.map((row, index) => <tr key={index}>{row.map((cell, cellIndex) => <td key={cellIndex}>{cell}</td>)}</tr>)}</tbody>
      </table>
    </div>
  )
}

function EmptyState({ title, detail }: { title: string; detail: string }) {
  return (
    <div className="panel" style={{ display: 'grid', gap: 8 }}>
      <strong style={{ fontSize: 20 }}>{title}</strong>
      <p style={{ margin: 0, color: '#cbd5e1' }}>{detail}</p>
    </div>
  )
}

function BarChart({ title, subtitle, data, formatter, emptyTitle, emptyCopy }: { title: string; subtitle: string; data: Array<{ label: string; value: number }>; formatter: (value: number) => string; emptyTitle: string; emptyCopy: string }) {
  const max = Math.max(0, ...data.map((item) => item.value))
  const meaningful = data.some((item) => item.value > 0)
  return (
    <article className="panel" style={{ display: 'grid', gap: 14 }}>
      <div>
        <p className="eyebrow">Chart</p>
        <h2 style={{ margin: '6px 0 4px' }}>{title}</h2>
        <p style={{ margin: 0, color: '#a8b3c3' }}>{subtitle}</p>
      </div>
      {!meaningful ? <EmptyState title={emptyTitle} detail={emptyCopy} /> : (
        <div style={{ display: 'grid', gap: 10 }}>
          {data.map((item) => (
            <div key={item.label} style={{ display: 'grid', gap: 5 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, fontSize: 13 }}>
                <span>{item.label}</span>
                <strong>{formatter(item.value)}</strong>
              </div>
              <div style={{ height: 10, borderRadius: 999, background: 'rgba(30,41,59,0.85)', overflow: 'hidden' }}>
                <div style={{ width: `${max ? (item.value / max) * 100 : 0}%`, height: '100%', borderRadius: 999, background: 'linear-gradient(90deg, #22c55e, #38bdf8)' }} />
              </div>
            </div>
          ))}
        </div>
      )}
    </article>
  )
}

function EyeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  )
}

function EyeOffIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-7 0-11-8-11-8a19.68 19.68 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a19.86 19.86 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  )
}

function AuthSurface({ title, description, children }: { title: string; description: string; children: (session: CoreOpsSession, controls: { logout: () => void }) => ReactNode }) {
  const [ready, setReady] = useState(false)
  const [session, setSession] = useState<CoreOpsSession | null>(null)
  const [email, setEmail] = useState('2bshaw@gmail.com')
  const [password, setPassword] = useState('foundingos-170377!!')
  const [showPassword, setShowPassword] = useState(false)
  const [state, patchState] = useState<FormState>({ busy: false, error: '', notice: '' })

  useEffect(() => {
    setSession(readStoredSession())
    setReady(true)
  }, [])

  const logout = useCallback(() => {
    clearStoredSession()
    void fetch(`${CORE_OPS_PROXY_PREFIX}/auth/logout`, { method: 'POST' })
    setSession(null)
    patchState({ busy: false, error: '', notice: 'Signed out of the live Core.Operations backend.' })
  }, [])

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    patchState({ busy: true, error: '', notice: '' })
    try {
      const nextSession = await loginToCoreOperations(email, password)
      setSession(nextSession)
      patchState({ busy: false, error: '', notice: `Signed in as ${nextSession.email}.` })
    } catch (error) {
      patchState({ busy: false, error: error instanceof Error ? error.message : 'Sign in failed.', notice: '' })
    }
  }

  if (!ready) return <section className="page-grid"><NoticeBanner>Loading Core.Operations session…</NoticeBanner></section>
  if (session) return <>{children(session, { logout })}</>

  return (
    <section className="page-grid">
      <div className="panel" style={{ maxWidth: 760, margin: '32px auto', display: 'grid', gap: 20 }}>
        <SectionHeader eyebrow="Live backend access" title={title} description={description} />
        <NoticeBanner>
          This console now signs in directly against the live <code>core-operations-backend</code> tenant-auth API and stores the session locally in this browser. No demo rows are injected here.
        </NoticeBanner>
        {state.notice ? <NoticeBanner tone="success">{state.notice}</NoticeBanner> : null}
        {state.error ? <NoticeBanner tone="error">{state.error}</NoticeBanner> : null}
        <form onSubmit={submit} style={{ display: 'grid', gap: 14 }}>
          <label>
            <span>Email</span>
            <input className="input" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
          </label>
          <label>
            <span>Password</span>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <input
                className="input"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
                style={{ paddingRight: 44, width: '100%' }}
              />
              <button
                type="button"
                onClick={() => setShowPassword((visible) => !visible)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                aria-pressed={showPassword}
                style={{
                  position: 'absolute',
                  right: 10,
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#94a3b8',
                  display: 'flex',
                  alignItems: 'center',
                  padding: 4,
                }}
              >
                {showPassword ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>
          </label>
          <button type="submit" className="btn btn-primary" disabled={state.busy}>{state.busy ? 'Signing in…' : 'Sign in to live Core.Operations'}</button>
        </form>
      </div>
    </section>
  )
}

function WorkspaceShell({ title, description, children }: { title: string; description: string; children: (data: CoreOperationsWorkspaceData, controls: { logout: () => void }) => ReactNode }) {
  return (
    <AuthSurface title={title} description={description}>
      {(session, controls) => <WorkspaceShellInner session={session} controls={controls} title={title} description={description}>{children}</WorkspaceShellInner>}
    </AuthSurface>
  )
}

function WorkspaceShellInner({ session, controls, title, description, children }: { session: CoreOpsSession; controls: { logout: () => void }; title: string; description: string; children: (data: CoreOperationsWorkspaceData, controls: { logout: () => void }) => ReactNode }) {
  const data = useCoreOperationsData(session)
  return (
    <section className="page-grid">
      <SectionHeader eyebrow="Core.Operations" title={title} description={description} actions={<HeaderActions onRefresh={() => void data.reload()} onLogout={controls.logout} refreshing={data.loading} />} />
      {data.error ? <NoticeBanner tone="error">{data.error}</NoticeBanner> : null}
      {data.notices.map((notice) => <NoticeBanner key={notice}>{notice}</NoticeBanner>)}
      {data.loading && !data.summary ? <NoticeBanner>Loading live Core.Operations workspace…</NoticeBanner> : null}
      {children(data, controls)}
    </section>
  )
}

function useCustomerMap(customers: Customer[]) {
  return useMemo(() => new Map(customers.map((customer) => [customer.id, customer])), [customers])
}

function DashboardBody({ data }: { data: CoreOperationsWorkspaceData }) {
  if (!data.summary) return null
  const { summary, customers, intelligence, weather } = data
  const customerMap = new Map(customers.map((customer) => [customer.id, customer]))
  const orderSeries = groupSeries(summary.orders, (order) => order.createdAt, (order) => order.totalPence)
  const invoiceSeries = groupSeries(summary.invoices, (invoice) => invoice.createdAt, (invoice) => invoice.totalPence)
  const deliverySeries = countByLabel(summary.deliveryAssignments.map((assignment) => titleCase(assignment.status)))
  const lowStockItems = summary.inventory.filter((item) => item.stock <= item.lowStockLevel).slice(0, 5)
  const recentOrders = summary.orders.slice(0, 5)
  const recentSignals = intelligence?.emergingSignals.slice(0, 4) ?? []

  return (
    <>
      <div className="kpi-grid">
        <MetricCard label="Order revenue" value={money(summary.metrics.orderRevenuePence)} detail={`${integer(summary.metrics.orders)} live orders in the tenant.`} />
        <MetricCard label="Inventory value" value={money(summary.metrics.inventoryValuePence)} detail={`${integer(summary.metrics.lowStock)} items are at or below threshold.`} />
        <MetricCard label="Outstanding invoices" value={money(summary.metrics.outstandingPence)} detail={`${integer(summary.metrics.unpaidInvoices)} invoices are still unpaid or not cancelled.`} />
        <MetricCard label="Delivery success" value={percentage(summary.metrics.deliverySuccessRate)} detail={`${integer(summary.metrics.delivered)} completed deliveries recorded.`} />
        <MetricCard label="Marketing revenue" value={money(summary.campaigns.reduce((total, campaign) => total + campaign.revenuePence, 0))} detail={`${integer(summary.metrics.scheduledPosts)} scheduled social posts are queued.`} />
        <MetricCard label="Learning momentum" value={intelligence ? titleCase(intelligence.snapshot.learningMomentum.label) : 'Building'} detail={intelligence?.snapshot.learningMomentum.narrative ?? 'The intelligence layer will show momentum after assessed outcomes accumulate.'} />
      </div>

      <div className="module-grid" style={{ alignItems: 'start' }}>
        <BarChart
          title="Order revenue trend"
          subtitle="Last seven days from real salesOrder creation timestamps."
          data={orderSeries}
          formatter={(value) => money(value)}
          emptyTitle="Establishing revenue history"
          emptyCopy="Order timestamps exist, but there is not yet enough recorded revenue in the last seven days to draw a meaningful trend."
        />
        <BarChart
          title="Invoice issuance trend"
          subtitle="Last seven days from real invoice records."
          data={invoiceSeries}
          formatter={(value) => money(value)}
          emptyTitle="Building invoice history"
          emptyCopy="Invoices are connected, but the recent period does not yet contain enough recorded volume for a trend chart."
        />
        <BarChart
          title="Delivery outcome mix"
          subtitle="Current status distribution across real delivery assignments."
          data={deliverySeries}
          formatter={(value) => integer(value)}
          emptyTitle="Awaiting delivery assignments"
          emptyCopy="Create or sync delivery assignments to see the live operational mix here."
        />
      </div>

      <div className="module-grid" style={{ alignItems: 'start' }}>
        <article className="panel" style={{ display: 'grid', gap: 14 }}>
          <div>
            <p className="eyebrow">Executive readout</p>
            <h2 style={{ margin: '6px 0' }}>What the live backend says right now</h2>
            <p style={{ margin: 0, color: '#cbd5e1' }}>{intelligence?.health.narrative ?? 'Agent intelligence is connected but has not yet assessed enough outcomes to summarize system health.'}</p>
          </div>
          <div style={{ display: 'grid', gap: 10 }}>
            <Pill tone="#86efac">{summary.metrics.orders} orders</Pill>
            <Pill tone="#bfdbfe">{summary.metrics.activeDeliveries} active deliveries</Pill>
            <Pill tone="#fde68a">{summary.metrics.unpaidInvoices} unpaid invoices</Pill>
            <Pill tone="#c4b5fd">{summary.metrics.campaigns} campaigns</Pill>
          </div>
          {weather ? <p style={{ margin: 0, color: '#a8b3c3' }}>Location/weather: {weather.location.locality || 'Detected location'} · {weather.weather.temperature ?? '—'}{weather.weather.units?.temperature_2m || '°C'} · wind {weather.weather.windSpeed ?? '—'}{weather.weather.units?.wind_speed_10m || ' km/h'}.</p> : null}
        </article>

        <article className="panel" style={{ display: 'grid', gap: 14 }}>
          <div><p className="eyebrow">Low-stock watchlist</p><h2 style={{ margin: '6px 0' }}>Inventory requiring action</h2></div>
          {lowStockItems.length ? lowStockItems.map((item) => (
            <div key={item.id} style={{ display: 'grid', gap: 4, paddingBottom: 10, borderBottom: '1px solid rgba(148,163,184,0.14)' }}>
              <strong>{item.name}</strong>
              <span>{item.sku} · {item.category}</span>
              <span style={{ color: '#facc15' }}>{item.stock} in stock · threshold {item.lowStockLevel}</span>
            </div>
          )) : <p style={{ margin: 0 }}>No low-stock items are currently returned by <code>operationsSummary</code>.</p>}
        </article>

        <article className="panel" style={{ display: 'grid', gap: 14 }}>
          <div><p className="eyebrow">Recent orders</p><h2 style={{ margin: '6px 0' }}>Latest operational records</h2></div>
          {recentOrders.length ? recentOrders.map((order) => (
            <div key={order.id} style={{ display: 'grid', gap: 4, paddingBottom: 10, borderBottom: '1px solid rgba(148,163,184,0.14)' }}>
              <strong>{order.reference}</strong>
              <span>{customerMap.get(order.customerId || '')?.companyName || 'Unlinked customer'} · {money(order.totalPence)}</span>
              <span>{titleCase(order.status)} · {titleCase(order.deliveryStatus)}</span>
            </div>
          )) : <p style={{ margin: 0 }}>No orders have been created yet.</p>}
        </article>
      </div>

      <div className="module-grid" style={{ alignItems: 'start' }}>
        <article className="panel" style={{ display: 'grid', gap: 12 }}>
          <div><p className="eyebrow">Agent-actions intelligence</p><h2 style={{ margin: '6px 0' }}>Emerging signals</h2></div>
          {recentSignals.length ? recentSignals.map((signal) => (
            <div key={signal.id} style={{ display: 'grid', gap: 4, paddingBottom: 10, borderBottom: '1px solid rgba(148,163,184,0.14)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
                <strong>{signal.title}</strong>
                <Pill tone={signal.severity === 'material' ? '#fca5a5' : signal.severity === 'positive' ? '#86efac' : '#fde68a'}>{signal.severity}</Pill>
              </div>
              <span>{signal.summary}</span>
              <small>Reliability {signal.reliability}% · {signal.outcomeCount} outcomes</small>
            </div>
          )) : <EmptyState title="Establishing intelligence history" detail="The backend returns the real intelligence layer, but there are not yet enough recent assessed outcomes to surface emerging signals." />}
        </article>
        <article className="panel" style={{ display: 'grid', gap: 12 }}>
          <div><p className="eyebrow">Customer coverage</p><h2 style={{ margin: '6px 0' }}>Live customer base</h2></div>
          <strong style={{ fontSize: 36 }}>{integer(customers.length)}</strong>
          <p style={{ margin: 0, color: '#cbd5e1' }}>{customers.filter((customer) => customer.email || customer.phone).length} customers have a direct contact method on file. {customers.filter((customer) => (customer.leads?.length ?? 0) > 0).length} are linked to converted lead records.</p>
          <div style={{ display: 'grid', gap: 8 }}>
            {customers.slice(0, 4).map((customer) => <Pill key={customer.id}>{customer.companyName}</Pill>)}
            {!customers.length ? <span style={{ color: '#a8b3c3' }}>No customers returned yet.</span> : null}
          </div>
        </article>
      </div>
    </>
  )
}

function OrdersModule({ data, moduleId }: { data: CoreOperationsWorkspaceData; moduleId: string }) {
  const summary = data.summary
  const customerMap = useCustomerMap(data.customers)
  const [selectedId, setSelectedId] = useState(summary?.orders[0]?.id ?? '')
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState('all')
  const [formState, patchFormState, resetFormState] = useFormState()

  useEffect(() => {
    if (summary && summary.orders.length && !summary.orders.some((order) => order.id === selectedId)) setSelectedId(summary.orders[0].id)
  }, [summary, selectedId])

  const visibleOrders = useMemo(() => (summary ? summary.orders.filter((order) => {
    const customer = customerMap.get(order.customerId || '')
    const haystack = `${order.reference} ${customer?.companyName || ''} ${order.paymentMethod || ''} ${order.deliveryAddress || ''}`.toLowerCase()
    return (status === 'all' || order.status === status) && haystack.includes(query.trim().toLowerCase())
  }) : []), [summary, customerMap, query, status])

  if (!summary) return null

  const selected = visibleOrders.find((order) => order.id === selectedId) ?? summary.orders.find((order) => order.id === selectedId) ?? visibleOrders[0]
  const orderSeries = groupSeries(summary.orders, (order) => order.createdAt, (order) => order.totalPence)
  const paymentMix = countByLabel(summary.orders.map((order) => titleCase(order.paymentMethod || 'Unspecified')))
  const outstandingOrders = summary.orders.filter((order) => !['delivered', 'cancelled'].includes(order.deliveryStatus)).length

  const nextOperationalStatus = (order: SalesOrder) => {
    const flow = ['open', 'picking', 'ready', 'dispatched', 'completed']
    const currentIndex = flow.indexOf(order.status)
    return flow[Math.min(currentIndex + 1, flow.length - 1)]
  }

  const nextDeliveryStatus = (order: SalesOrder) => {
    const flow = ['unassigned', 'assigned', 'out_for_delivery', 'delivered']
    const currentIndex = flow.indexOf(order.deliveryStatus)
    return flow[Math.min(currentIndex + 1, flow.length - 1)]
  }

  const createOrder = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    patchFormState({ busy: true, error: '', notice: '' })
    try {
      await withSessionMutation(data, async (session) => coreOpsRequest(session, '/orders', {
        method: 'POST',
        body: JSON.stringify({
          customerId: String(form.get('customerId') || '') || undefined,
          reference: String(form.get('reference') || '') || undefined,
          totalPence: Math.round(Number(form.get('total') || 0) * 100),
          paymentMethod: String(form.get('paymentMethod') || '') || undefined,
          deliveryAddress: String(form.get('deliveryAddress') || '') || undefined,
          notes: String(form.get('notes') || '') || undefined,
          status: 'open',
          paymentStatus: 'unpaid',
          deliveryStatus: 'unassigned',
        }),
      }))
      event.currentTarget.reset()
      patchFormState({ busy: false, error: '', notice: 'Order created in the live salesOrder table.' })
      await data.reload()
    } catch (error) {
      patchFormState({ busy: false, error: error instanceof Error ? error.message : 'Order could not be created.', notice: '' })
    }
  }

  const patchOrder = async (id: string, patch: Record<string, unknown>, message: string) => {
    resetFormState()
    patchFormState({ busy: true })
    try {
      await withSessionMutation(data, async (session) => coreOpsRequest(session, `/orders/${id}`, { method: 'PATCH', body: JSON.stringify(patch) }))
      patchFormState({ busy: false, notice: message, error: '' })
      await data.reload()
    } catch (error) {
      patchFormState({ busy: false, error: error instanceof Error ? error.message : 'Order update failed.', notice: '' })
    }
  }

  const variantTitle = moduleId === 'sales' ? 'Sales performance' : moduleId === 'pos' ? 'POS and order capture' : 'Order operations'
  const variantDescription = moduleId === 'sales'
    ? 'Different from the fulfilment queue: this view emphasizes real revenue, payment mix, and order creation pace from the live backend.'
    : moduleId === 'pos'
      ? 'Capture orders and monitor payment mix without falling back to a reused generic template.'
      : 'Track fulfilment state, payment state, and dispatch readiness from the real salesOrder records.'

  return (
    <>
      <div className="module-grid" style={{ alignItems: 'start' }}>
        <article className="panel" style={{ display: 'grid', gap: 14 }}>
          <div><p className="eyebrow">{variantTitle}</p><h2 style={{ margin: '6px 0' }}>{variantDescription}</h2></div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 12 }}>
            <MetricCard label="Live orders" value={integer(summary.metrics.orders)} detail={`${integer(outstandingOrders)} still need delivery completion.`} />
            <MetricCard label="Revenue" value={money(summary.metrics.orderRevenuePence)} detail={`${integer(summary.orders.filter((order) => order.paymentStatus === 'paid').length)} paid orders.`} />
            <MetricCard label="Ready to dispatch" value={integer(summary.orders.filter((order) => order.status === 'ready').length)} detail="Current operational queue." />
          </div>
        </article>
        <BarChart
          title={moduleId === 'sales' ? 'Revenue by day' : 'Orders created by day'}
          subtitle="Derived from real order timestamps in the tenant."
          data={moduleId === 'sales' ? orderSeries : groupSeries(summary.orders, (order) => order.createdAt, () => 1)}
          formatter={(value) => moduleId === 'sales' ? money(value) : integer(value)}
          emptyTitle="Establishing order cadence"
          emptyCopy="There is not yet enough recent order activity to draw a useful operational trend."
        />
        <BarChart
          title="Payment method mix"
          subtitle="Current distribution from order.paymentMethod."
          data={paymentMix}
          formatter={(value) => integer(value)}
          emptyTitle="Awaiting payment-method coverage"
          emptyCopy="Orders exist, but payment methods are still mostly unset in the live records."
        />
      </div>

      {formState.notice ? <NoticeBanner tone="success">{formState.notice}</NoticeBanner> : null}
      {formState.error ? <NoticeBanner tone="error">{formState.error}</NoticeBanner> : null}

      <div className="module-grid" style={{ alignItems: 'start' }}>
        <form className="panel" onSubmit={createOrder} style={{ display: 'grid', gap: 12 }}>
          <div><p className="eyebrow">Create order</p><h2 style={{ margin: '6px 0' }}>Write to <code>/orders</code></h2></div>
          <label><span>Customer</span><select className="input" name="customerId"><option value="">Unlinked order</option>{data.customers.map((customer) => <option key={customer.id} value={customer.id}>{customer.companyName}</option>)}</select></label>
          <label><span>Reference</span><input className="input" name="reference" placeholder="ORD-2026-001" /></label>
          <label><span>Total (£)</span><input className="input" name="total" type="number" min="0" step="0.01" required /></label>
          <label><span>Payment method</span><input className="input" name="paymentMethod" placeholder="Card / transfer / cash" /></label>
          <label><span>Delivery address</span><textarea className="input" name="deliveryAddress" rows={3} /></label>
          <label><span>Notes</span><textarea className="input" name="notes" rows={3} /></label>
          <button type="submit" className="btn btn-primary" disabled={formState.busy}>{formState.busy ? 'Saving…' : 'Create live order'}</button>
        </form>

        <div style={{ display: 'grid', gap: 14 }}>
          <div className="panel" style={{ display: 'grid', gap: 10 }}>
            <div><p className="eyebrow">Order queue</p><h2 style={{ margin: '6px 0' }}>Search and filter</h2></div>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 12 }}>
              <input className="input" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Reference, customer, method, address…" />
              <select className="input" value={status} onChange={(event) => setStatus(event.target.value)}>
                <option value="all">All statuses</option>
                {[...new Set(summary.orders.map((order) => order.status))].map((item) => <option key={item} value={item}>{titleCase(item)}</option>)}
              </select>
            </div>
          </div>
          <StatusTable
            headers={['Reference', 'Customer', 'Total', 'Order status', 'Payment', 'Delivery']}
            rows={visibleOrders.map((order) => [
              <button key="reference" type="button" className="btn btn-secondary" onClick={() => setSelectedId(order.id)}>{order.reference}</button>,
              customerMap.get(order.customerId || '')?.companyName || 'Unlinked customer',
              money(order.totalPence),
              <Pill key="status" tone={statusTone(order.status)}>{titleCase(order.status)}</Pill>,
              titleCase(order.paymentStatus),
              titleCase(order.deliveryStatus),
            ])}
          />
        </div>

        <article className="panel" style={{ display: 'grid', gap: 12 }}>
          <div><p className="eyebrow">Selected order</p><h2 style={{ margin: '6px 0' }}>{selected?.reference || 'No order selected'}</h2></div>
          {selected ? (
            <>
              <p style={{ margin: 0 }}>{customerMap.get(selected.customerId || '')?.companyName || 'Unlinked customer'} · {money(selected.totalPence)}</p>
              <p style={{ margin: 0, color: '#a8b3c3' }}>{selected.deliveryAddress || 'No delivery address recorded.'}</p>
              <div style={{ display: 'grid', gap: 8 }}>
                <Pill tone={statusTone(selected.status)}>{titleCase(selected.status)}</Pill>
                <Pill tone={statusTone(selected.deliveryStatus)}>{titleCase(selected.deliveryStatus)}</Pill>
                <Pill tone={statusTone(selected.paymentStatus)}>{titleCase(selected.paymentStatus)}</Pill>
              </div>
              <div style={{ display: 'grid', gap: 10 }}>
                <button type="button" className="btn btn-primary" disabled={formState.busy} onClick={() => void patchOrder(selected.id, { status: nextOperationalStatus(selected) }, `Order moved to ${titleCase(nextOperationalStatus(selected))}.`)}>Advance order status</button>
                <button type="button" className="btn btn-secondary" disabled={formState.busy} onClick={() => void patchOrder(selected.id, { deliveryStatus: nextDeliveryStatus(selected) }, `Delivery moved to ${titleCase(nextDeliveryStatus(selected))}.`)}>Advance delivery status</button>
                <button type="button" className="btn btn-secondary" disabled={formState.busy} onClick={() => void patchOrder(selected.id, { paymentStatus: 'paid' }, 'Order marked paid in the live backend.')}>Mark paid</button>
              </div>
              <small>Created {dateTime(selected.createdAt)} · updated {dateTime(selected.updatedAt)}</small>
            </>
          ) : <p style={{ margin: 0 }}>No live orders match the current filters.</p>}
        </article>
      </div>
    </>
  )
}

function InventoryModule({ data, moduleId }: { data: CoreOperationsWorkspaceData; moduleId: string }) {
  const summary = data.summary
  const [selectedId, setSelectedId] = useState(summary?.inventory[0]?.id ?? '')
  const [query, setQuery] = useState('')
  const [formState, patchFormState, resetFormState] = useFormState()

  useEffect(() => {
    if (summary && summary.inventory.length && !summary.inventory.some((item) => item.id === selectedId)) setSelectedId(summary.inventory[0].id)
  }, [summary, selectedId])

  const filteredItems = useMemo(() => (summary ? summary.inventory.filter((item) => `${item.name} ${item.sku} ${item.category} ${item.supplierName || ''}`.toLowerCase().includes(query.trim().toLowerCase())) : []), [summary, query])

  if (!summary) return null

  const selected = summary.inventory.find((item) => item.id === selectedId) ?? summary.inventory[0]
  const categoryMix = countByLabel(summary.inventory.map((item) => item.category))
  const supplierRows = [...new Map(summary.inventory.map((item) => [item.supplierName || 'Unassigned supplier', null])).keys()].map((supplier) => {
    const items = summary.inventory.filter((item) => (item.supplierName || 'Unassigned supplier') === supplier)
    return {
      supplier,
      items: items.length,
      lowStock: items.filter((item) => item.stock <= item.lowStockLevel).length,
      valuePence: items.reduce((total, item) => total + item.stock * item.pricePence, 0),
    }
  }).sort((left, right) => right.valuePence - left.valuePence)

  const createInventory = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    patchFormState({ busy: true, error: '', notice: '' })
    try {
      await withSessionMutation(data, async (session) => coreOpsRequest(session, '/inventory', {
        method: 'POST',
        body: JSON.stringify({
          name: String(form.get('name') || ''),
          sku: String(form.get('sku') || ''),
          category: String(form.get('category') || 'General'),
          supplierName: String(form.get('supplierName') || '') || undefined,
          supplierEmail: String(form.get('supplierEmail') || '') || undefined,
          pricePence: Math.round(Number(form.get('price') || 0) * 100),
          stock: Number(form.get('stock') || 0),
          lowStockLevel: Number(form.get('lowStockLevel') || 5),
        }),
      }))
      event.currentTarget.reset()
      patchFormState({ busy: false, error: '', notice: 'Inventory item created in the live Prisma table.' })
      await data.reload()
    } catch (error) {
      patchFormState({ busy: false, error: error instanceof Error ? error.message : 'Inventory item could not be created.', notice: '' })
    }
  }

  const updateSelected = async (patch: Record<string, unknown>, message: string) => {
    if (!selected) return
    resetFormState()
    patchFormState({ busy: true })
    try {
      await withSessionMutation(data, async (session) => coreOpsRequest(session, `/inventory/${selected.id}`, { method: 'PATCH', body: JSON.stringify(patch) }))
      patchFormState({ busy: false, error: '', notice: message })
      await data.reload()
    } catch (error) {
      patchFormState({ busy: false, error: error instanceof Error ? error.message : 'Inventory update failed.', notice: '' })
    }
  }

  const inventorySeries = categoryMix
  const lowStockItems = summary.inventory.filter((item) => item.stock <= item.lowStockLevel)

  if (moduleId === 'suppliers') {
    return (
      <>
        <div className="kpi-grid">
          <MetricCard label="Suppliers represented" value={integer(supplierRows.length)} detail="Derived from real inventory supplier fields." />
          <MetricCard label="Inventory value" value={money(summary.metrics.inventoryValuePence)} detail="Value of current stock held against supplier records." />
          <MetricCard label="Supplier-driven risks" value={integer(supplierRows.filter((row) => row.lowStock > 0).length)} detail="Suppliers with at least one low-stock SKU." />
        </div>
        <BarChart title="Supplier exposure" subtitle="Inventory items grouped by supplierName." data={supplierRows.map((row) => ({ label: row.supplier, value: row.items }))} formatter={(value) => integer(value)} emptyTitle="Awaiting supplier-linked inventory" emptyCopy="Inventory exists, but supplier names have not yet been filled out on enough live items." />
        <StatusTable headers={['Supplier', 'Items', 'Low-stock SKUs', 'Inventory value']} rows={supplierRows.map((row) => [row.supplier, integer(row.items), integer(row.lowStock), money(row.valuePence)])} />
      </>
    )
  }

  if (moduleId === 'products') {
    return (
      <>
        {formState.notice ? <NoticeBanner tone="success">{formState.notice}</NoticeBanner> : null}
        {formState.error ? <NoticeBanner tone="error">{formState.error}</NoticeBanner> : null}
        <div className="module-card-grid">
          {summary.inventory.map((item) => (
            <article key={item.id} className="panel" style={{ display: 'grid', gap: 8 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
                <strong>{item.name}</strong>
                <Pill tone={statusTone(item.stock <= item.lowStockLevel ? 'low' : 'good')}>{item.stock <= item.lowStockLevel ? 'Low stock' : 'Healthy'}</Pill>
              </div>
              <span>{item.sku} · {item.category}</span>
              <span>{money(item.pricePence)} · {item.stock} in stock</span>
              <small>Supplier: {item.supplierName || 'Not set'}</small>
              <button type="button" className="btn btn-secondary" onClick={() => setSelectedId(item.id)}>Edit this product</button>
            </article>
          ))}
        </div>
        <article className="panel" style={{ display: 'grid', gap: 12 }}>
          <div><p className="eyebrow">Selected product</p><h2 style={{ margin: '6px 0' }}>{selected?.name || 'No product selected'}</h2></div>
          {selected ? (
            <div style={{ display: 'grid', gap: 10 }}>
              <button type="button" className="btn btn-primary" disabled={formState.busy} onClick={() => void updateSelected({ stock: selected.stock + 5 }, `Added five units to ${selected.name}.`)}>Add 5 units</button>
              <button type="button" className="btn btn-secondary" disabled={formState.busy} onClick={() => void updateSelected({ pricePence: selected.pricePence + 100 }, `Raised ${selected.name} by £1.00.`)}>Increase price by £1</button>
            </div>
          ) : null}
        </article>
      </>
    )
  }

  return (
    <>
      {formState.notice ? <NoticeBanner tone="success">{formState.notice}</NoticeBanner> : null}
      {formState.error ? <NoticeBanner tone="error">{formState.error}</NoticeBanner> : null}
      <div className="module-grid" style={{ alignItems: 'start' }}>
        <form className="panel" onSubmit={createInventory} style={{ display: 'grid', gap: 12 }}>
          <div><p className="eyebrow">Create inventory</p><h2 style={{ margin: '6px 0' }}>Write to <code>/inventory</code></h2></div>
          <label><span>Name</span><input className="input" name="name" required /></label>
          <label><span>SKU</span><input className="input" name="sku" required /></label>
          <label><span>Category</span><input className="input" name="category" defaultValue="General" /></label>
          <label><span>Supplier name</span><input className="input" name="supplierName" /></label>
          <label><span>Supplier email</span><input className="input" name="supplierEmail" type="email" /></label>
          <label><span>Unit price (£)</span><input className="input" name="price" type="number" min="0" step="0.01" required /></label>
          <label><span>Stock</span><input className="input" name="stock" type="number" min="0" required /></label>
          <label><span>Low-stock level</span><input className="input" name="lowStockLevel" type="number" min="0" defaultValue="5" required /></label>
          <button type="submit" className="btn btn-primary" disabled={formState.busy}>{formState.busy ? 'Saving…' : 'Create live item'}</button>
        </form>
        <BarChart title="Inventory by category" subtitle="Current live inventory grouped by category." data={inventorySeries.map((row) => ({ label: row.label, value: row.value }))} formatter={(value) => integer(value)} emptyTitle="Awaiting catalog structure" emptyCopy="Create or sync inventory items to establish category-level coverage." />
        <article className="panel" style={{ display: 'grid', gap: 12 }}>
          <div><p className="eyebrow">Restock pressure</p><h2 style={{ margin: '6px 0' }}>{integer(lowStockItems.length)} low-stock items</h2></div>
          {lowStockItems.length ? lowStockItems.slice(0, 6).map((item) => <Pill key={item.id} tone="#fde68a">{item.name} · {item.stock}/{item.lowStockLevel}</Pill>) : <p style={{ margin: 0 }}>No items are currently below threshold.</p>}
        </article>
      </div>
      <div className="panel" style={{ display: 'grid', gap: 10 }}>
        <div><p className="eyebrow">Inventory table</p><h2 style={{ margin: '6px 0' }}>Search live SKUs</h2></div>
        <input className="input" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Name, SKU, category, supplier…" />
      </div>
      <div className="module-grid" style={{ alignItems: 'start' }}>
        <StatusTable headers={['SKU', 'Product', 'Category', 'Stock', 'Threshold', 'Supplier']} rows={filteredItems.map((item) => [
          <button key="sku" type="button" className="btn btn-secondary" onClick={() => setSelectedId(item.id)}>{item.sku}</button>,
          item.name,
          item.category,
          item.stock,
          item.lowStockLevel,
          item.supplierName || '—',
        ])} />
        <article className="panel" style={{ display: 'grid', gap: 12 }}>
          <div><p className="eyebrow">Selected SKU</p><h2 style={{ margin: '6px 0' }}>{selected?.name || 'No SKU selected'}</h2></div>
          {selected ? (
            <>
              <span>{selected.sku} · {money(selected.pricePence)} · {selected.stock} in stock</span>
              <span>Supplier: {selected.supplierName || 'Not set'}</span>
              <div style={{ display: 'grid', gap: 10 }}>
                <button type="button" className="btn btn-primary" disabled={formState.busy} onClick={() => void updateSelected({ stock: selected.stock + Math.max(selected.lowStockLevel, 5) }, `Replenished ${selected.name} in the live backend.`)}>Replenish to safety stock</button>
                <button type="button" className="btn btn-secondary" disabled={formState.busy} onClick={() => void updateSelected({ stock: Math.max(0, selected.stock - 1) }, `Reduced ${selected.name} by one unit.`)}>Reduce stock by 1</button>
              </div>
              <small>Updated {dateTime(selected.updatedAt)}</small>
            </>
          ) : <p style={{ margin: 0 }}>Select a live inventory item to update it.</p>}
        </article>
      </div>
    </>
  )
}

function CustomersModule({ data }: { data: CoreOperationsWorkspaceData }) {
  const summary = data.summary
  const [formState, patchFormState] = useFormState()

  if (!summary) return null

  const ordersByCustomer = new Map<string, SalesOrder[]>()
  for (const order of summary.orders) {
    if (!order.customerId) continue
    ordersByCustomer.set(order.customerId, [...(ordersByCustomer.get(order.customerId) ?? []), order])
  }

  const createCustomer = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    patchFormState({ busy: true, error: '', notice: '' })
    try {
      await withSessionMutation(data, async (session) => coreOpsRequest(session, '/customers', {
        method: 'POST',
        body: JSON.stringify({
          companyName: String(form.get('companyName') || ''),
          contactName: String(form.get('contactName') || '') || undefined,
          email: String(form.get('email') || '') || undefined,
          phone: String(form.get('phone') || '') || undefined,
          source: String(form.get('source') || '') || undefined,
        }),
      }))
      event.currentTarget.reset()
      patchFormState({ busy: false, error: '', notice: 'Customer created in the live CRM table.' })
      await data.reload()
    } catch (error) {
      patchFormState({ busy: false, error: error instanceof Error ? error.message : 'Customer could not be created.', notice: '' })
    }
  }

  return (
    <>
      {formState.notice ? <NoticeBanner tone="success">{formState.notice}</NoticeBanner> : null}
      {formState.error ? <NoticeBanner tone="error">{formState.error}</NoticeBanner> : null}
      <div className="module-grid" style={{ alignItems: 'start' }}>
        <form className="panel" onSubmit={createCustomer} style={{ display: 'grid', gap: 12 }}>
          <div><p className="eyebrow">Create customer</p><h2 style={{ margin: '6px 0' }}>Write to <code>/customers</code></h2></div>
          <label><span>Company name</span><input className="input" name="companyName" required /></label>
          <label><span>Contact name</span><input className="input" name="contactName" /></label>
          <label><span>Email</span><input className="input" name="email" type="email" /></label>
          <label><span>Phone</span><input className="input" name="phone" /></label>
          <label><span>Source</span><input className="input" name="source" placeholder="WhatsApp / referral / web" /></label>
          <button type="submit" className="btn btn-primary" disabled={formState.busy}>{formState.busy ? 'Saving…' : 'Create live customer'}</button>
        </form>
        <article className="panel" style={{ display: 'grid', gap: 12 }}>
          <div><p className="eyebrow">Coverage</p><h2 style={{ margin: '6px 0' }}>{integer(data.customers.length)} customers</h2></div>
          <p style={{ margin: 0, color: '#cbd5e1' }}>{data.customers.filter((customer) => (ordersByCustomer.get(customer.id)?.length ?? 0) > 0).length} customers are already linked to at least one real order.</p>
          <p style={{ margin: 0, color: '#cbd5e1' }}>{data.customers.filter((customer) => customer.email || customer.phone).length} customers have a contact method saved.</p>
        </article>
      </div>
      <StatusTable headers={['Customer', 'Contact', 'Source', 'Orders', 'Lifetime order value']} rows={data.customers.map((customer) => {
        const orders = ordersByCustomer.get(customer.id) ?? []
        return [
          <div key="name"><strong>{customer.companyName}</strong><div><small>{customer.contactName || 'No named contact'}</small></div></div>,
          customer.email || customer.phone || '—',
          customer.source || '—',
          integer(orders.length),
          money(orders.reduce((total, order) => total + order.totalPence, 0)),
        ]
      })} />
    </>
  )
}

function AccountingModule({ data }: { data: CoreOperationsWorkspaceData }) {
  const summary = data.summary
  const customerMap = useCustomerMap(data.customers)
  const [selectedId, setSelectedId] = useState(summary?.invoices[0]?.id ?? '')
  const [formState, patchFormState, resetFormState] = useFormState()

  useEffect(() => {
    if (summary && summary.invoices.length && !summary.invoices.some((invoice) => invoice.id === selectedId)) setSelectedId(summary.invoices[0].id)
  }, [summary, selectedId])

  if (!summary) return null

  const selected = summary.invoices.find((invoice) => invoice.id === selectedId) ?? summary.invoices[0]
  const invoiceSeries = groupSeries(summary.invoices, (invoice) => invoice.createdAt, (invoice) => invoice.totalPence)

  const createInvoice = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    patchFormState({ busy: true, error: '', notice: '' })
    try {
      await withSessionMutation(data, async (session) => coreOpsRequest(session, '/invoices', {
        method: 'POST',
        body: JSON.stringify({
          customerId: String(form.get('customerId') || '') || undefined,
          number: String(form.get('number') || '') || undefined,
          subtotalPence: Math.round(Number(form.get('subtotal') || 0) * 100),
          taxPence: Math.round(Number(form.get('tax') || 0) * 100),
          dueAt: String(form.get('dueAt') || '') || undefined,
          status: 'draft',
        }),
      }))
      event.currentTarget.reset()
      patchFormState({ busy: false, error: '', notice: 'Invoice created in the live invoice table.' })
      await data.reload()
    } catch (error) {
      patchFormState({ busy: false, error: error instanceof Error ? error.message : 'Invoice could not be created.', notice: '' })
    }
  }

  const updateInvoice = async (path: string, init: RequestInit, notice: string) => {
    resetFormState()
    patchFormState({ busy: true })
    try {
      await withSessionMutation(data, async (session) => coreOpsRequest(session, path, init))
      patchFormState({ busy: false, error: '', notice })
      await data.reload()
    } catch (error) {
      patchFormState({ busy: false, error: error instanceof Error ? error.message : 'Invoice update failed.', notice: '' })
    }
  }

  return (
    <>
      {formState.notice ? <NoticeBanner tone="success">{formState.notice}</NoticeBanner> : null}
      {formState.error ? <NoticeBanner tone="error">{formState.error}</NoticeBanner> : null}
      <div className="kpi-grid">
        <MetricCard label="Outstanding" value={money(summary.metrics.outstandingPence)} detail={`${integer(summary.metrics.unpaidInvoices)} invoices still need collection.`} />
        <MetricCard label="Paid invoices" value={integer(summary.invoices.filter((invoice) => invoice.status === 'paid').length)} detail="Recorded as paid in the live backend." />
        <MetricCard label="Invoice coverage" value={percentage(summary.metrics.orders ? (summary.invoices.length / summary.metrics.orders) * 100 : 0)} detail="Invoices created relative to total order count." />
      </div>
      <div className="module-grid" style={{ alignItems: 'start' }}>
        <form className="panel" onSubmit={createInvoice} style={{ display: 'grid', gap: 12 }}>
          <div><p className="eyebrow">Create invoice</p><h2 style={{ margin: '6px 0' }}>Write to <code>/invoices</code></h2></div>
          <label><span>Customer</span><select className="input" name="customerId"><option value="">Unlinked invoice</option>{data.customers.map((customer) => <option key={customer.id} value={customer.id}>{customer.companyName}</option>)}</select></label>
          <label><span>Invoice number</span><input className="input" name="number" placeholder="INV-2026-001" /></label>
          <label><span>Subtotal (£)</span><input className="input" name="subtotal" type="number" min="0" step="0.01" required /></label>
          <label><span>Tax (£)</span><input className="input" name="tax" type="number" min="0" step="0.01" defaultValue="0" required /></label>
          <label><span>Due at</span><input className="input" name="dueAt" type="datetime-local" /></label>
          <button type="submit" className="btn btn-primary" disabled={formState.busy}>{formState.busy ? 'Saving…' : 'Create live invoice'}</button>
        </form>
        <BarChart title="Invoice creation trend" subtitle="Last seven days from real invoice.createdAt values." data={invoiceSeries} formatter={(value) => money(value)} emptyTitle="Building invoice history" emptyCopy="The backend is connected, but the recent invoice window is not yet dense enough for a meaningful trend line." />
        <article className="panel" style={{ display: 'grid', gap: 12 }}>
          <div><p className="eyebrow">Selected invoice</p><h2 style={{ margin: '6px 0' }}>{selected?.number || 'No invoice selected'}</h2></div>
          {selected ? (
            <>
              <span>{customerMap.get(selected.customerId || '')?.companyName || 'Unlinked customer'} · {money(selected.totalPence)}</span>
              <div style={{ display: 'grid', gap: 8 }}>
                <Pill tone={statusTone(selected.status)}>{titleCase(selected.status)}</Pill>
                <span>Due {dateTime(selected.dueAt)} · sent {dateTime(selected.sentAt)} · paid {dateTime(selected.paidAt)}</span>
              </div>
              <div style={{ display: 'grid', gap: 10 }}>
                <button type="button" className="btn btn-primary" disabled={formState.busy} onClick={() => void updateInvoice(`/invoices/${selected.id}`, { method: 'PATCH', body: JSON.stringify({ status: 'paid' }) }, 'Invoice marked paid in the live backend.')}>Mark paid</button>
                <button type="button" className="btn btn-secondary" disabled={formState.busy} onClick={() => void updateInvoice(`/invoices/${selected.id}/send`, { method: 'POST' }, 'Invoice marked sent via the live send endpoint.')}>Send invoice</button>
                <button type="button" className="btn btn-secondary" disabled={formState.busy} onClick={() => void updateInvoice(`/invoices/${selected.id}`, { method: 'PATCH', body: JSON.stringify({ status: 'overdue' }) }, 'Invoice marked overdue.')}>Mark overdue</button>
              </div>
            </>
          ) : <p style={{ margin: 0 }}>No live invoices available yet.</p>}
        </article>
      </div>
      <StatusTable headers={['Invoice', 'Customer', 'Total', 'Status', 'Due', 'Sent']} rows={summary.invoices.map((invoice) => [
        <button key="invoice" type="button" className="btn btn-secondary" onClick={() => setSelectedId(invoice.id)}>{invoice.number}</button>,
        customerMap.get(invoice.customerId || '')?.companyName || 'Unlinked customer',
        money(invoice.totalPence),
        <Pill key="status" tone={statusTone(invoice.status)}>{titleCase(invoice.status)}</Pill>,
        shortDate(invoice.dueAt),
        shortDate(invoice.sentAt),
      ])} />
    </>
  )
}

function DeliveryMapPanel({ vehicles, assignments }: { vehicles: DeliveryVehicle[]; assignments: DeliveryAssignment[] }) {
  const vehiclePoints = vehicles.filter((vehicle) => vehicle.currentLat != null && vehicle.currentLng != null)
  const routeAssignments = assignments.filter((assignment) => assignment.originLat != null && assignment.originLng != null && assignment.destinationLat != null && assignment.destinationLng != null)
  const allLats = [...vehiclePoints.map((vehicle) => vehicle.currentLat as number), ...routeAssignments.flatMap((assignment) => [assignment.originLat as number, assignment.destinationLat as number])]
  const allLngs = [...vehiclePoints.map((vehicle) => vehicle.currentLng as number), ...routeAssignments.flatMap((assignment) => [assignment.originLng as number, assignment.destinationLng as number])]

  if (!allLats.length) {
    return (
      <article className="panel" style={{ display: 'grid', gap: 12 }}>
        <div><p className="eyebrow">Live tracking</p><h2 style={{ margin: '6px 0' }}>Delivery map</h2></div>
        <p style={{ margin: 0, color: '#94a3b8' }}>No live GPS positions yet. Add origin/destination coordinates when creating an assignment, or update a vehicle&apos;s current position, to see it plotted here.</p>
      </article>
    )
  }

  const minLat = Math.min(...allLats), maxLat = Math.max(...allLats)
  const minLng = Math.min(...allLngs), maxLng = Math.max(...allLngs)
  const spanLat = maxLat - minLat || 0.01
  const spanLng = maxLng - minLng || 0.01
  const project = (lat: number, lng: number): [number, number] => [
    ((lng - minLng) / spanLng) * 280 + 10,
    (1 - (lat - minLat) / spanLat) * 180 + 10,
  ]

  return (
    <article className="panel" style={{ display: 'grid', gap: 12 }}>
      <div><p className="eyebrow">Live tracking</p><h2 style={{ margin: '6px 0' }}>Delivery map</h2></div>
      <svg viewBox="0 0 300 200" role="img" aria-label="Delivery map showing vehicle positions and active routes" style={{ width: '100%', height: 220, background: '#0b1220', borderRadius: 12, border: '1px solid rgba(148,163,184,0.14)' }}>
        {routeAssignments.map((assignment) => {
          const [x1, y1] = project(assignment.originLat as number, assignment.originLng as number)
          const [x2, y2] = project(assignment.destinationLat as number, assignment.destinationLng as number)
          const delivered = assignment.status === 'delivered'
          return (
            <g key={assignment.id}>
              <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={statusTone(assignment.status)} strokeWidth={2} strokeDasharray={delivered ? undefined : '4 3'} />
              <circle cx={x1} cy={y1} r={3} fill="#64748b" />
              <circle cx={x2} cy={y2} r={4} fill={statusTone(assignment.status)} />
            </g>
          )
        })}
        {vehiclePoints.map((vehicle) => {
          const [x, y] = project(vehicle.currentLat as number, vehicle.currentLng as number)
          return (
            <g key={vehicle.id}>
              <circle cx={x} cy={y} r={6} fill="#38bdf8" stroke="#0b1220" strokeWidth={1.5} />
              <text x={x + 8} y={y + 3} fontSize={9} fill="#e2e8f0">{vehicle.label}</text>
            </g>
          )
        })}
      </svg>
      <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', fontSize: 12, color: '#94a3b8' }}>
        <span>● Vehicle position</span>
        <span>— Route in progress</span>
        <span>— Delivered route</span>
      </div>
      <p style={{ margin: 0, fontSize: 12, color: '#64748b' }}>{vehiclePoints.length} vehicle position{vehiclePoints.length === 1 ? '' : 's'} · {routeAssignments.length} route{routeAssignments.length === 1 ? '' : 's'} with known coordinates</p>
    </article>
  )
}

function DeliveryModule({ data }: { data: CoreOperationsWorkspaceData }) {
  const summary = data.summary
  const [formState, patchFormState, resetFormState] = useFormState()
  const [selectedId, setSelectedId] = useState(summary?.deliveryAssignments[0]?.id ?? '')

  useEffect(() => {
    if (summary && summary.deliveryAssignments.length && !summary.deliveryAssignments.some((assignment) => assignment.id === selectedId)) setSelectedId(summary.deliveryAssignments[0].id)
  }, [summary, selectedId])

  if (!summary) return null

  const orderMap = new Map(summary.orders.map((order) => [order.id, order]))
  const operatorMap = new Map(summary.deliveryOperators.map((operator) => [operator.id, operator]))
  const vehicleMap = new Map(summary.deliveryVehicles.map((vehicle) => [vehicle.id, vehicle]))
  const zoneMap = new Map(summary.deliveryZones.map((zone) => [zone.id, zone]))

  const selected = summary.deliveryAssignments.find((assignment) => assignment.id === selectedId) ?? summary.deliveryAssignments[0]
  const boardStatuses = ['assigned', 'out_for_delivery', 'delivered', 'failed', 'cancelled']

  const createAssignment = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    patchFormState({ busy: true, error: '', notice: '' })
    try {
      await withSessionMutation(data, async (session) => coreOpsRequest(session, '/delivery/assignments', {
        method: 'POST',
        body: JSON.stringify({
          orderId: String(form.get('orderId') || ''),
          operatorId: String(form.get('operatorId') || '') || undefined,
          vehicleId: String(form.get('vehicleId') || '') || undefined,
          zoneId: String(form.get('zoneId') || '') || undefined,
          recipient: String(form.get('recipient') || '') || undefined,
          message: String(form.get('message') || '') || undefined,
          originLat: form.get('originLat') ? Number(form.get('originLat')) : undefined,
          originLng: form.get('originLng') ? Number(form.get('originLng')) : undefined,
          destinationLat: form.get('destinationLat') ? Number(form.get('destinationLat')) : undefined,
          destinationLng: form.get('destinationLng') ? Number(form.get('destinationLng')) : undefined,
        }),
      }))
      event.currentTarget.reset()
      patchFormState({ busy: false, error: '', notice: 'Delivery assignment created in the live backend.' })
      await data.reload()
    } catch (error) {
      patchFormState({ busy: false, error: error instanceof Error ? error.message : 'Delivery assignment could not be created.', notice: '' })
    }
  }

  const updateAssignment = async (assignmentId: string, patch: Record<string, unknown>, notice: string) => {
    resetFormState()
    patchFormState({ busy: true })
    try {
      await withSessionMutation(data, async (session) => coreOpsRequest(session, `/delivery/assignments/${assignmentId}`, { method: 'PATCH', body: JSON.stringify(patch) }))
      patchFormState({ busy: false, error: '', notice })
      await data.reload()
    } catch (error) {
      patchFormState({ busy: false, error: error instanceof Error ? error.message : 'Delivery update failed.', notice: '' })
    }
  }

  return (
    <>
      {formState.notice ? <NoticeBanner tone="success">{formState.notice}</NoticeBanner> : null}
      {formState.error ? <NoticeBanner tone="error">{formState.error}</NoticeBanner> : null}
      <div className="kpi-grid">
        <MetricCard label="Active deliveries" value={integer(summary.metrics.activeDeliveries)} detail={`${integer(summary.deliveryOperators.filter((operator) => operator.active).length)} active operators.`} />
        <MetricCard label="Success rate" value={percentage(summary.metrics.deliverySuccessRate)} detail={`${integer(summary.metrics.delivered)} delivered assignments.`} />
        <MetricCard label="Delivery revenue" value={money(summary.metrics.deliveryRevenuePence)} detail={`${integer(summary.deliveryZones.length)} configured zones.`} />
      </div>
      <DeliveryMapPanel vehicles={summary.deliveryVehicles} assignments={summary.deliveryAssignments} />
      <div className="module-grid" style={{ alignItems: 'start' }}>
        <form className="panel" onSubmit={createAssignment} style={{ display: 'grid', gap: 12 }}>
          <div><p className="eyebrow">Assign delivery</p><h2 style={{ margin: '6px 0' }}>Write to <code>/delivery/assignments</code></h2></div>
          <label><span>Order</span><select className="input" name="orderId" required>{summary.orders.map((order) => <option key={order.id} value={order.id}>{order.reference}</option>)}</select></label>
          <label><span>Operator</span><select className="input" name="operatorId"><option value="">Unassigned</option>{summary.deliveryOperators.map((operator) => <option key={operator.id} value={operator.id}>{operator.name}</option>)}</select></label>
          <label><span>Vehicle</span><select className="input" name="vehicleId"><option value="">Unassigned</option>{summary.deliveryVehicles.map((vehicle) => <option key={vehicle.id} value={vehicle.id}>{vehicle.label}</option>)}</select></label>
          <label><span>Zone</span><select className="input" name="zoneId"><option value="">No zone</option>{summary.deliveryZones.map((zone) => <option key={zone.id} value={zone.id}>{zone.name}</option>)}</select></label>
          <label><span>Recipient</span><input className="input" name="recipient" placeholder="WhatsApp number for notification" /></label>
          <label><span>Message</span><textarea className="input" name="message" rows={3} placeholder="Optional custom delivery message" /></label>
          <details style={{ display: 'grid', gap: 10 }}>
            <summary style={{ cursor: 'pointer', color: '#94a3b8' }}>Route coordinates (optional, powers the live map)</summary>
            <div style={{ display: 'grid', gap: 10, gridTemplateColumns: '1fr 1fr' }}>
              <label><span>Origin latitude</span><input className="input" name="originLat" type="number" step="any" placeholder="e.g. 51.5072" /></label>
              <label><span>Origin longitude</span><input className="input" name="originLng" type="number" step="any" placeholder="e.g. -0.1276" /></label>
              <label><span>Destination latitude</span><input className="input" name="destinationLat" type="number" step="any" placeholder="e.g. 51.4545" /></label>
              <label><span>Destination longitude</span><input className="input" name="destinationLng" type="number" step="any" placeholder="e.g. -0.9781" /></label>
            </div>
          </details>
          <button type="submit" className="btn btn-primary" disabled={formState.busy}>{formState.busy ? 'Saving…' : 'Create live assignment'}</button>
        </form>
        <article className="panel" style={{ display: 'grid', gap: 12 }}>
          <div><p className="eyebrow">Dispatch board</p><h2 style={{ margin: '6px 0' }}>Real assignment states</h2></div>
          <div style={{ display: 'grid', gap: 10 }}>
            {boardStatuses.map((status) => {
              const rows = summary.deliveryAssignments.filter((assignment) => assignment.status === status)
              return <div key={status} style={{ paddingBottom: 10, borderBottom: '1px solid rgba(148,163,184,0.14)' }}><strong>{titleCase(status)}</strong><div style={{ marginTop: 8, display: 'flex', gap: 8, flexWrap: 'wrap' }}>{rows.length ? rows.map((assignment) => <button key={assignment.id} type="button" className="btn btn-secondary" onClick={() => setSelectedId(assignment.id)}>{orderMap.get(assignment.orderId)?.reference || assignment.orderId}</button>) : <span style={{ color: '#94a3b8' }}>None</span>}</div></div>
            })}
          </div>
        </article>
        <article className="panel" style={{ display: 'grid', gap: 12 }}>
          <div><p className="eyebrow">Selected assignment</p><h2 style={{ margin: '6px 0' }}>{selected ? orderMap.get(selected.orderId)?.reference || selected.orderId : 'No assignment selected'}</h2></div>
          {selected ? (
            <>
              <span>{operatorMap.get(selected.operatorId || '')?.name || 'Unassigned operator'} · {vehicleMap.get(selected.vehicleId || '')?.label || 'No vehicle'} · {zoneMap.get(selected.zoneId || '')?.name || 'No zone'}</span>
              <span>{money(selected.feePence)} · {selected.routeDistanceKm} km · {selected.estimatedMinutes} mins</span>
              <Pill tone={statusTone(selected.status)}>{titleCase(selected.status)}</Pill>
              <div style={{ display: 'grid', gap: 10 }}>
                <button type="button" className="btn btn-primary" disabled={formState.busy} onClick={() => void updateAssignment(selected.id, { status: 'out_for_delivery' }, 'Assignment moved to out_for_delivery.')}>Dispatch</button>
                <button type="button" className="btn btn-secondary" disabled={formState.busy} onClick={() => void updateAssignment(selected.id, { status: 'delivered' }, 'Assignment marked delivered.')}>Mark delivered</button>
                <button type="button" className="btn btn-secondary" disabled={formState.busy} onClick={() => void updateAssignment(selected.id, { status: 'failed', detail: 'Customer unavailable' }, 'Assignment marked failed.')}>Mark failed</button>
              </div>
            </>
          ) : <p style={{ margin: 0 }}>No delivery assignments exist yet.</p>}
        </article>
      </div>
      <div className="module-grid" style={{ alignItems: 'start' }}>
        <StatusTable headers={['Order', 'Operator', 'Vehicle', 'Zone', 'Status', 'Fee']} rows={summary.deliveryAssignments.map((assignment) => [
          <button key="assignment" type="button" className="btn btn-secondary" onClick={() => setSelectedId(assignment.id)}>{orderMap.get(assignment.orderId)?.reference || assignment.orderId}</button>,
          operatorMap.get(assignment.operatorId || '')?.name || '—',
          vehicleMap.get(assignment.vehicleId || '')?.label || '—',
          zoneMap.get(assignment.zoneId || '')?.name || '—',
          <Pill key="status" tone={statusTone(assignment.status)}>{titleCase(assignment.status)}</Pill>,
          money(assignment.feePence),
        ])} />
        <StatusTable headers={['Operator', 'Role', 'Status', 'Phone verified']} rows={summary.deliveryOperators.map((operator) => [operator.name, operator.role, titleCase(operator.status), operator.phoneVerified ? 'Yes' : 'No'])} />
        <StatusTable headers={['Notification', 'Recipient', 'Channel', 'Status']} rows={summary.deliveryNotifications.slice(0, 12).map((notification) => [shortDate(notification.createdAt), notification.recipient, notification.channel, titleCase(notification.status)])} />
      </div>
    </>
  )
}

function LocationModule({ data }: { data: CoreOperationsWorkspaceData }) {
  const summary = data.summary
  const profile = summary?.locationProfiles[0]
  const [formState, patchFormState] = useFormState()
  const [draft, setDraft] = useState({
    label: profile?.label || 'Primary location',
    latitude: profile?.latitude?.toString() || '',
    longitude: profile?.longitude?.toString() || '',
    locality: profile?.locality || '',
    countryCode: profile?.countryCode || '',
    timezone: profile?.timezone || '',
    gpsEnabled: profile?.gpsEnabled ?? true,
    ipFallbackEnabled: profile?.ipFallbackEnabled ?? true,
  })

  useEffect(() => {
    setDraft({
      label: profile?.label || 'Primary location',
      latitude: profile?.latitude?.toString() || '',
      longitude: profile?.longitude?.toString() || '',
      locality: profile?.locality || '',
      countryCode: profile?.countryCode || '',
      timezone: profile?.timezone || '',
      gpsEnabled: profile?.gpsEnabled ?? true,
      ipFallbackEnabled: profile?.ipFallbackEnabled ?? true,
    })
  }, [profile?.id])

  if (!summary) return null

  const saveProfile = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    patchFormState({ busy: true, error: '', notice: '' })
    try {
      await withSessionMutation(data, async (session) => coreOpsRequest(session, '/location/profile', {
        method: 'PUT',
        body: JSON.stringify({
          ...draft,
          latitude: draft.latitude ? Number(draft.latitude) : undefined,
          longitude: draft.longitude ? Number(draft.longitude) : undefined,
        }),
      }))
      patchFormState({ busy: false, error: '', notice: 'Location profile saved to the live backend.' })
      await data.reload()
    } catch (error) {
      patchFormState({ busy: false, error: error instanceof Error ? error.message : 'Location profile could not be saved.', notice: '' })
    }
  }

  const detectLocation = async () => {
    patchFormState({ busy: true, error: '', notice: '' })
    try {
      const detection = await withSessionMutation(data, async (session) => coreOpsRequest<{ latitude: number; longitude: number; locality?: string; countryCode?: string; timezone?: string; source?: string }>(session, '/location/detect', { method: 'POST', body: JSON.stringify({}) }))
      setDraft((current) => ({
        ...current,
        latitude: detection.latitude.toString(),
        longitude: detection.longitude.toString(),
        locality: detection.locality || current.locality,
        countryCode: detection.countryCode || current.countryCode,
        timezone: detection.timezone || current.timezone,
      }))
      patchFormState({ busy: false, error: '', notice: `Detected ${detection.locality || 'current'} location from the live endpoint.` })
    } catch (error) {
      patchFormState({ busy: false, error: error instanceof Error ? error.message : 'Location detection failed.', notice: '' })
    }
  }

  return (
    <>
      {formState.notice ? <NoticeBanner tone="success">{formState.notice}</NoticeBanner> : null}
      {formState.error ? <NoticeBanner tone="error">{formState.error}</NoticeBanner> : null}
      <div className="kpi-grid">
        <MetricCard label="Location profiles" value={integer(summary.locationProfiles.length)} detail="Backed by Prisma locationProfile records." />
        <MetricCard label="Delivery zones" value={integer(summary.deliveryZones.length)} detail="Zones available to logistics and billing." />
        <MetricCard label="Weather" value={data.weather?.weather.temperature !== undefined ? `${data.weather.weather.temperature}${data.weather.weather.units?.temperature_2m || '°C'}` : 'Building'} detail={data.weather ? `${data.weather.location.locality || 'Detected location'} · wind ${data.weather.weather.windSpeed ?? '—'}${data.weather.weather.units?.wind_speed_10m || ' km/h'}` : 'Weather lookup is not yet available.'} />
      </div>
      <div className="module-grid" style={{ alignItems: 'start' }}>
        <form className="panel" onSubmit={saveProfile} style={{ display: 'grid', gap: 12 }}>
          <div><p className="eyebrow">Primary store / location</p><h2 style={{ margin: '6px 0' }}>Write to <code>/location/profile</code></h2></div>
          <label><span>Label</span><input className="input" value={draft.label} onChange={(event) => setDraft((current) => ({ ...current, label: event.target.value }))} /></label>
          <label><span>Latitude</span><input className="input" value={draft.latitude} onChange={(event) => setDraft((current) => ({ ...current, latitude: event.target.value }))} /></label>
          <label><span>Longitude</span><input className="input" value={draft.longitude} onChange={(event) => setDraft((current) => ({ ...current, longitude: event.target.value }))} /></label>
          <label><span>Locality</span><input className="input" value={draft.locality} onChange={(event) => setDraft((current) => ({ ...current, locality: event.target.value }))} /></label>
          <label><span>Country code</span><input className="input" value={draft.countryCode} onChange={(event) => setDraft((current) => ({ ...current, countryCode: event.target.value.toUpperCase() }))} /></label>
          <label><span>Timezone</span><input className="input" value={draft.timezone} onChange={(event) => setDraft((current) => ({ ...current, timezone: event.target.value }))} /></label>
          <label><input type="checkbox" checked={draft.gpsEnabled} onChange={(event) => setDraft((current) => ({ ...current, gpsEnabled: event.target.checked }))} /> GPS enabled</label>
          <label><input type="checkbox" checked={draft.ipFallbackEnabled} onChange={(event) => setDraft((current) => ({ ...current, ipFallbackEnabled: event.target.checked }))} /> IP fallback enabled</label>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <button type="submit" className="btn btn-primary" disabled={formState.busy}>{formState.busy ? 'Saving…' : 'Save live profile'}</button>
            <button type="button" className="btn btn-secondary" disabled={formState.busy} onClick={() => void detectLocation()}>Detect location</button>
          </div>
        </form>
        <article className="panel" style={{ display: 'grid', gap: 12 }}>
          <div><p className="eyebrow">Weather and routing context</p><h2 style={{ margin: '6px 0' }}>Live location intelligence</h2></div>
          {data.weather ? (
            <>
              <span>{data.weather.location.locality || 'Detected location'} · {data.weather.location.countryCode || '—'} · {data.weather.location.timezone || '—'}</span>
              <span>Temperature {data.weather.weather.temperature ?? '—'}{data.weather.weather.units?.temperature_2m || '°C'} · apparent {data.weather.weather.apparentTemperature ?? '—'}{data.weather.weather.units?.apparent_temperature || '°C'}</span>
              <span>Wind {data.weather.weather.windSpeed ?? '—'}{data.weather.weather.units?.wind_speed_10m || ' km/h'} · observed {dateTime(data.weather.weather.observedAt)}</span>
            </>
          ) : <EmptyState title="Building weather context" detail="The weather endpoint is real, but it has not returned a result for this session yet." />}
        </article>
        <StatusTable headers={['Zone', 'Postcodes', 'Fee', 'ETA', 'COD']} rows={summary.deliveryZones.map((zone) => [zone.name, safeArray(zone.postcodePrefixes).map((item) => String(item)).join(', ') || '—', money(zone.feePence), `${zone.estimatedMinutes} mins`, zone.cashOnDeliveryAllowed ? 'Yes' : 'No'])} />
      </div>
    </>
  )
}

function MarketingModule({ data }: { data: CoreOperationsWorkspaceData }) {
  const summary = data.summary
  const [selectedCampaignId, setSelectedCampaignId] = useState(summary?.campaigns[0]?.id ?? '')
  const [selectedPostId, setSelectedPostId] = useState(summary?.socialPosts[0]?.id ?? '')
  const [formState, patchFormState, resetFormState] = useFormState()

  if (!summary) return null

  const campaignSeries = groupSeries(summary.campaigns, (campaign) => campaign.createdAt, (campaign) => campaign.revenuePence)
  const calendarRows = [...summary.socialPosts].sort((left, right) => (left.scheduledAt || left.createdAt).localeCompare(right.scheduledAt || right.createdAt))
  const selectedCampaign = summary.campaigns.find((campaign) => campaign.id === selectedCampaignId) ?? summary.campaigns[0]
  const selectedPost = summary.socialPosts.find((post) => post.id === selectedPostId) ?? summary.socialPosts[0]

  const createCampaign = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    patchFormState({ busy: true, error: '', notice: '' })
    try {
      await withSessionMutation(data, async (session) => coreOpsRequest(session, '/marketing/campaigns', {
        method: 'POST',
        body: JSON.stringify({
          name: String(form.get('name') || ''),
          objective: String(form.get('objective') || ''),
          audience: String(form.get('audience') || ''),
          platforms: form.getAll('platforms'),
        }),
      }))
      event.currentTarget.reset()
      patchFormState({ busy: false, error: '', notice: 'Campaign created via the live marketing endpoint, including generated copy fields from the backend.' })
      await data.reload()
    } catch (error) {
      patchFormState({ busy: false, error: error instanceof Error ? error.message : 'Campaign could not be created.', notice: '' })
    }
  }

  const createPost = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    patchFormState({ busy: true, error: '', notice: '' })
    try {
      await withSessionMutation(data, async (session) => coreOpsRequest(session, '/social/posts', {
        method: 'POST',
        body: JSON.stringify({
          campaignId: String(form.get('campaignId') || '') || undefined,
          content: String(form.get('content') || ''),
          platforms: form.getAll('platforms'),
          scheduledAt: String(form.get('scheduledAt') || '') || undefined,
          autoPost: form.get('autoPost') === 'on',
        }),
      }))
      event.currentTarget.reset()
      patchFormState({ busy: false, error: '', notice: 'Social post saved to the live publishing queue.' })
      await data.reload()
    } catch (error) {
      patchFormState({ busy: false, error: error instanceof Error ? error.message : 'Social post could not be created.', notice: '' })
    }
  }

  const generateContent = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    patchFormState({ busy: true, error: '', notice: '' })
    try {
      await withSessionMutation(data, async (session) => coreOpsRequest(session, '/media/generate', {
        method: 'POST',
        body: JSON.stringify({ format: String(form.get('format') || ''), brief: String(form.get('brief') || '') }),
      }))
      event.currentTarget.reset()
      patchFormState({ busy: false, error: '', notice: 'Text/copy generation completed through the live mediaGeneration endpoint.' })
      await data.reload()
    } catch (error) {
      patchFormState({ busy: false, error: error instanceof Error ? error.message : 'Content could not be generated.', notice: '' })
    }
  }

  const updateCampaign = async (campaignId: string, patch: Record<string, unknown>, notice: string) => {
    resetFormState()
    patchFormState({ busy: true })
    try {
      await withSessionMutation(data, async (session) => coreOpsRequest(session, `/marketing/campaigns/${campaignId}`, { method: 'PATCH', body: JSON.stringify(patch) }))
      patchFormState({ busy: false, error: '', notice })
      await data.reload()
    } catch (error) {
      patchFormState({ busy: false, error: error instanceof Error ? error.message : 'Campaign update failed.', notice: '' })
    }
  }

  const updatePost = async (postId: string, patch: Record<string, unknown>, notice: string) => {
    resetFormState()
    patchFormState({ busy: true })
    try {
      await withSessionMutation(data, async (session) => coreOpsRequest(session, `/social/posts/${postId}`, { method: 'PATCH', body: JSON.stringify(patch) }))
      patchFormState({ busy: false, error: '', notice })
      await data.reload()
    } catch (error) {
      patchFormState({ busy: false, error: error instanceof Error ? error.message : 'Social post update failed.', notice: '' })
    }
  }

  return (
    <>
      {formState.notice ? <NoticeBanner tone="success">{formState.notice}</NoticeBanner> : null}
      {formState.error ? <NoticeBanner tone="error">{formState.error}</NoticeBanner> : null}
      <div className="kpi-grid">
        <MetricCard label="Campaigns" value={integer(summary.metrics.campaigns)} detail="Real marketingCampaign records." />
        <MetricCard label="Scheduled posts" value={integer(summary.metrics.scheduledPosts)} detail="Live socialPost queue depth." />
        <MetricCard label="Impressions" value={integer(summary.campaigns.reduce((total, campaign) => total + campaign.impressions, 0))} detail="Summed directly from campaign records." />
        <MetricCard label="Attributed revenue" value={money(summary.campaigns.reduce((total, campaign) => total + campaign.revenuePence, 0))} detail="Revenue stored on marketingCampaign rows." />
      </div>
      <div className="module-grid" style={{ alignItems: 'start' }}>
        <BarChart title="Campaign revenue trend" subtitle="Last seven days from campaign.createdAt and revenuePence." data={campaignSeries} formatter={(value) => money(value)} emptyTitle="Establishing marketing history" emptyCopy="Campaign records are connected, but recent attributed revenue is still too sparse for a meaningful trend chart." />
        <article className="panel" style={{ display: 'grid', gap: 12 }}>
          <div><p className="eyebrow">Scheduled content calendar</p><h2 style={{ margin: '6px 0' }}>Real publishing queue</h2></div>
          {calendarRows.length ? calendarRows.slice(0, 8).map((post) => (
            <div key={post.id} style={{ paddingBottom: 10, borderBottom: '1px solid rgba(148,163,184,0.14)' }}>
              <strong>{post.status === 'scheduled' ? shortDate(post.scheduledAt) : titleCase(post.status)}</strong>
              <p style={{ margin: '6px 0' }}>{post.content}</p>
              <small>{platformsLabel(post.platforms)} · auto-post {post.autoPost ? 'on' : 'off'}</small>
            </div>
          )) : <EmptyState title="No posts scheduled yet" detail="Create a social post with an optional schedule to populate the live calendar." />}
        </article>
        <article className="panel" style={{ display: 'grid', gap: 12 }}>
          <div><p className="eyebrow">AI content generation</p><h2 style={{ margin: '6px 0' }}>Real text output history</h2></div>
          <p style={{ margin: 0, color: '#cbd5e1' }}>This endpoint generates campaign copy/text content, not binary images. The output below comes from the real <code>mediaGeneration</code> table.</p>
          {summary.media.length ? summary.media.slice(0, 4).map((item) => (
            <div key={item.id} style={{ paddingBottom: 10, borderBottom: '1px solid rgba(148,163,184,0.14)' }}>
              <strong>{item.format}</strong>
              <p style={{ margin: '6px 0' }}>{item.output}</p>
              <small>{shortDate(item.createdAt)} · {item.brief}</small>
            </div>
          )) : <EmptyState title="No generated copy yet" detail="Run the live generator to create on-brand text informed by real operational context." />}
        </article>
      </div>
      <div className="module-grid" style={{ alignItems: 'start' }}>
        <form className="panel" onSubmit={createCampaign} style={{ display: 'grid', gap: 12 }}>
          <div><p className="eyebrow">Campaign builder</p><h2 style={{ margin: '6px 0' }}>Create live campaign</h2></div>
          <label><span>Name</span><input className="input" name="name" required /></label>
          <label><span>Objective</span><input className="input" name="objective" required /></label>
          <label><span>Audience</span><input className="input" name="audience" required /></label>
          <fieldset><legend>Platforms</legend>{['WhatsApp', 'Email', 'Facebook', 'Instagram', 'LinkedIn', 'X'].map((platform) => <label key={platform} style={{ display: 'inline-flex', gap: 8, marginRight: 12 }}><input type="checkbox" name="platforms" value={platform} /> {platform}</label>)}</fieldset>
          <button type="submit" className="btn btn-primary" disabled={formState.busy}>{formState.busy ? 'Saving…' : 'Create live campaign'}</button>
        </form>
        <form className="panel" onSubmit={createPost} style={{ display: 'grid', gap: 12 }}>
          <div><p className="eyebrow">Social publishing</p><h2 style={{ margin: '6px 0' }}>Create live social post</h2></div>
          <label><span>Campaign</span><select className="input" name="campaignId"><option value="">No linked campaign</option>{summary.campaigns.map((campaign) => <option key={campaign.id} value={campaign.id}>{campaign.name}</option>)}</select></label>
          <label><span>Content</span><textarea className="input" name="content" rows={4} required /></label>
          <label><span>Scheduled at</span><input className="input" name="scheduledAt" type="datetime-local" /></label>
          <fieldset><legend>Platforms</legend>{['Facebook', 'Instagram', 'LinkedIn', 'X'].map((platform) => <label key={platform} style={{ display: 'inline-flex', gap: 8, marginRight: 12 }}><input type="checkbox" name="platforms" value={platform} /> {platform}</label>)}</fieldset>
          <label><input type="checkbox" name="autoPost" /> Auto-post when due</label>
          <button type="submit" className="btn btn-primary" disabled={formState.busy}>{formState.busy ? 'Saving…' : 'Queue live post'}</button>
        </form>
        <form className="panel" onSubmit={generateContent} style={{ display: 'grid', gap: 12 }}>
          <div><p className="eyebrow">Content generation</p><h2 style={{ margin: '6px 0' }}>Generate text/copy</h2></div>
          <label><span>Format</span><select className="input" name="format"><option>Social media content</option><option>WhatsApp promotion</option><option>Email campaign</option><option>Product launch</option></select></label>
          <label><span>Brief</span><textarea className="input" name="brief" rows={5} required /></label>
          <button type="submit" className="btn btn-primary" disabled={formState.busy}>{formState.busy ? 'Generating…' : 'Generate live text output'}</button>
        </form>
      </div>
      <div className="module-grid" style={{ alignItems: 'start' }}>
        <article className="panel" style={{ display: 'grid', gap: 12 }}>
          <div><p className="eyebrow">Selected campaign</p><h2 style={{ margin: '6px 0' }}>{selectedCampaign?.name || 'No campaign selected'}</h2></div>
          {selectedCampaign ? (
            <>
              <p style={{ margin: 0 }}>{selectedCampaign.objective} · {selectedCampaign.audience}</p>
              <p style={{ margin: 0, color: '#a8b3c3' }}>{selectedCampaign.caption || selectedCampaign.idea || 'Generated copy will appear here once the backend creates it.'}</p>
              <small>{platformsLabel(selectedCampaign.platforms)} · revenue {money(selectedCampaign.revenuePence)}</small>
              <div style={{ display: 'grid', gap: 10 }}>
                <button type="button" className="btn btn-primary" disabled={formState.busy} onClick={() => void updateCampaign(selectedCampaign.id, { status: 'scheduled', scheduledAt: selectedCampaign.scheduledAt || new Date().toISOString() }, 'Campaign scheduled in the live backend.')}>Schedule campaign</button>
                <button type="button" className="btn btn-secondary" disabled={formState.busy} onClick={() => void updateCampaign(selectedCampaign.id, { status: 'live' }, 'Campaign marked live.')}>Mark live</button>
              </div>
            </>
          ) : <p style={{ margin: 0 }}>No campaigns available yet.</p>}
        </article>
        <article className="panel" style={{ display: 'grid', gap: 12 }}>
          <div><p className="eyebrow">Selected post</p><h2 style={{ margin: '6px 0' }}>{selectedPost ? titleCase(selectedPost.status) : 'No post selected'}</h2></div>
          {selectedPost ? (
            <>
              <p style={{ margin: 0 }}>{selectedPost.content}</p>
              <small>{platformsLabel(selectedPost.platforms)} · scheduled {dateTime(selectedPost.scheduledAt)}</small>
              <div style={{ display: 'grid', gap: 10 }}>
                <button type="button" className="btn btn-primary" disabled={formState.busy} onClick={() => void updatePost(selectedPost.id, { autoPost: !selectedPost.autoPost }, `Auto-post ${selectedPost.autoPost ? 'disabled' : 'enabled'} in the live record.`)}>{selectedPost.autoPost ? 'Disable auto-post' : 'Enable auto-post'}</button>
                <button type="button" className="btn btn-secondary" disabled={formState.busy} onClick={() => void updatePost(selectedPost.id, { status: 'published' }, 'Social post marked published.')}>Mark published</button>
              </div>
            </>
          ) : <p style={{ margin: 0 }}>No social posts available yet.</p>}
        </article>
        <StatusTable headers={['Campaign', 'Status', 'Platforms', 'Revenue']} rows={summary.campaigns.map((campaign) => [
          <button key="campaign" type="button" className="btn btn-secondary" onClick={() => setSelectedCampaignId(campaign.id)}>{campaign.name}</button>,
          <Pill key="status" tone={statusTone(campaign.status)}>{titleCase(campaign.status)}</Pill>,
          platformsLabel(campaign.platforms),
          money(campaign.revenuePence),
        ])} />
      </div>
      <StatusTable headers={['Post', 'Status', 'Platforms', 'Scheduled', 'Auto-post']} rows={summary.socialPosts.map((post) => [
        <button key="post" type="button" className="btn btn-secondary" onClick={() => setSelectedPostId(post.id)}>{post.content.slice(0, 40) || 'Post'}</button>,
        <Pill key="status" tone={statusTone(post.status)}>{titleCase(post.status)}</Pill>,
        platformsLabel(post.platforms),
        dateTime(post.scheduledAt),
        post.autoPost ? 'On' : 'Off',
      ])} />
    </>
  )
}

function MessagingModule({ data }: { data: CoreOperationsWorkspaceData }) {
  const readiness = data.messagingReadiness
  const [formState, patchFormState] = useFormState()

  const saveConnection = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    patchFormState({ busy: true, error: '', notice: '' })
    try {
      await withSessionMutation(data, async (session) => coreOpsRequest(session, `/messaging/connections/${String(form.get('channel') || 'whatsapp')}`, {
        method: 'PUT',
        body: JSON.stringify({ externalAccountId: String(form.get('externalAccountId') || ''), displayName: String(form.get('displayName') || '') || undefined, active: true }),
      }))
      event.currentTarget.reset()
      patchFormState({ busy: false, error: '', notice: 'Messaging connection saved to the live backend.' })
      await data.reload()
    } catch (error) {
      patchFormState({ busy: false, error: error instanceof Error ? error.message : 'Messaging connection could not be saved.', notice: '' })
    }
  }

  const saveParticipant = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    patchFormState({ busy: true, error: '', notice: '' })
    try {
      await withSessionMutation(data, async (session) => coreOpsRequest(session, '/messaging/participants', {
        method: 'PUT',
        body: JSON.stringify({ channel: String(form.get('participantChannel') || 'whatsapp'), address: String(form.get('address') || ''), displayName: String(form.get('participantName') || '') || undefined, role: String(form.get('role') || 'operator'), active: true }),
      }))
      event.currentTarget.reset()
      patchFormState({ busy: false, error: '', notice: 'Messaging participant saved to the live backend.' })
      await data.reload()
    } catch (error) {
      patchFormState({ busy: false, error: error instanceof Error ? error.message : 'Messaging participant could not be saved.', notice: '' })
    }
  }

  return (
    <>
      {formState.notice ? <NoticeBanner tone="success">{formState.notice}</NoticeBanner> : null}
      {formState.error ? <NoticeBanner tone="error">{formState.error}</NoticeBanner> : null}
      <div className="kpi-grid">
        <MetricCard label="Operational" value={readiness?.operational ? 'Yes' : 'No'} detail="Computed by /messaging/readiness." />
        <MetricCard label="Authorized participants" value={integer(readiness?.authorizedParticipants)} detail="Live role-linked participants." />
        <MetricCard label="Failed deliveries (24h)" value={integer(readiness?.failedDeliveriesLast24Hours)} detail="Outbound messaging failures recorded in the last day." />
      </div>
      <NoticeBanner>{readiness?.dependencyRisk || 'Messaging readiness depends on external providers once a live connection is configured.'}</NoticeBanner>
      <div className="module-grid" style={{ alignItems: 'start' }}>
        <form className="panel" onSubmit={saveConnection} style={{ display: 'grid', gap: 12 }}>
          <div><p className="eyebrow">Channel connection</p><h2 style={{ margin: '6px 0' }}>Write to <code>/messaging/connections/:channel</code></h2></div>
          <label><span>Channel</span><select className="input" name="channel"><option value="whatsapp">WhatsApp</option></select></label>
          <label><span>External account ID</span><input className="input" name="externalAccountId" required /></label>
          <label><span>Display name</span><input className="input" name="displayName" /></label>
          <button type="submit" className="btn btn-primary" disabled={formState.busy}>{formState.busy ? 'Saving…' : 'Save live connection'}</button>
        </form>
        <form className="panel" onSubmit={saveParticipant} style={{ display: 'grid', gap: 12 }}>
          <div><p className="eyebrow">Participant access</p><h2 style={{ margin: '6px 0' }}>Write to <code>/messaging/participants</code></h2></div>
          <label><span>Channel</span><select className="input" name="participantChannel"><option value="whatsapp">WhatsApp</option></select></label>
          <label><span>Address</span><input className="input" name="address" required placeholder="Phone number" /></label>
          <label><span>Name</span><input className="input" name="participantName" /></label>
          <label><span>Role</span><select className="input" name="role"><option value="operator">Operator</option><option value="driver">Driver</option><option value="marketing">Marketing</option><option value="finance">Finance</option><option value="admin">Admin</option></select></label>
          <button type="submit" className="btn btn-primary" disabled={formState.busy}>{formState.busy ? 'Saving…' : 'Save live participant'}</button>
        </form>
        <StatusTable headers={['Connection', 'Display name', 'Active']} rows={data.messagingConnections.map((connection) => [connection.channel, connection.displayName || '—', connection.active ? 'Yes' : 'No'])} />
      </div>
      <StatusTable headers={['Participant', 'Role', 'Channel', 'Active']} rows={data.messagingParticipants.map((participant) => [participant.displayName || participant.address, participant.role, participant.channel, participant.active ? 'Yes' : 'No'])} />
    </>
  )
}

function MonitoringModule({ data }: { data: CoreOperationsWorkspaceData }) {
  const intelligence = data.intelligence
  if (!intelligence) return <EmptyState title="Building monitoring workspace" detail="The live agent-actions intelligence summary is not available yet for this session." />
  return (
    <>
      <div className="kpi-grid">
        <MetricCard label="Prediction accuracy" value={percentage(intelligence.health.averagePredictionAccuracy)} detail={intelligence.health.narrative} />
        <MetricCard label="Active interactions" value={integer(intelligence.snapshot.activeInteractions)} detail="Cross-action interaction risks currently detected." />
        <MetricCard label="Measured outcomes" value={integer(intelligence.snapshot.economicValue.measuredOutcomes)} detail={intelligence.snapshot.economicValue.narrative} />
      </div>
      <div className="module-grid" style={{ alignItems: 'start' }}>
        <article className="panel" style={{ display: 'grid', gap: 12 }}>
          <div><p className="eyebrow">Accuracy trend</p><h2 style={{ margin: '6px 0' }}>{percentage(intelligence.snapshot.recentAccuracyTrend.current)}</h2></div>
          {intelligence.snapshot.totalAssessedOutcomes > 0 ? (
            <>
              <p style={{ margin: 0 }}>{intelligence.snapshot.recentAccuracyTrend.narrative}</p>
              <small>Previous window {percentage(intelligence.snapshot.recentAccuracyTrend.previous)} · change {intelligence.snapshot.recentAccuracyTrend.change > 0 ? '+' : ''}{intelligence.snapshot.recentAccuracyTrend.change}%</small>
            </>
          ) : <EmptyState title="Establishing accuracy history" detail="The backend intentionally withholds a fake time series until real assessed outcomes exist." />}
        </article>
        <article className="panel" style={{ display: 'grid', gap: 12 }}>
          <div><p className="eyebrow">Emerging signals</p><h2 style={{ margin: '6px 0' }}>Real intelligence feed</h2></div>
          {intelligence.emergingSignals.length ? intelligence.emergingSignals.slice(0, 6).map((signal) => <div key={signal.id} style={{ paddingBottom: 10, borderBottom: '1px solid rgba(148,163,184,0.14)' }}><strong>{signal.title}</strong><p style={{ margin: '6px 0' }}>{signal.summary}</p><small>{signal.reliability}% reliability · {signal.kind}</small></div>) : <EmptyState title="No emerging signals yet" detail="Signals will appear here once enough governed actions have executed and been assessed." />}
        </article>
        <article className="panel" style={{ display: 'grid', gap: 12 }}>
          <div><p className="eyebrow">Execution audit trail</p><h2 style={{ margin: '6px 0' }}>Recent assessed actions</h2></div>
          {intelligence.auditTrail.length ? intelligence.auditTrail.slice(0, 6).map((entry) => <div key={entry.id} style={{ paddingBottom: 10, borderBottom: '1px solid rgba(148,163,184,0.14)' }}><strong>{entry.actionTitle}</strong><p style={{ margin: '6px 0' }}>{entry.summary}</p><small>{titleCase(entry.stage)} · {entry.actor} · {dateTime(entry.occurredAt)}</small></div>) : <EmptyState title="Audit trail will grow here" detail="Once governed actions are proposed, approved, executed, and assessed, the backend will populate this real audit stream." />}
        </article>
      </div>
    </>
  )
}

function HonestGapModule({ moduleId }: { moduleId: string }) {
  return <EmptyState title={`${titleCase(moduleId)} is not yet wired to a real Core.Operations backend domain`} detail="This module no longer falls back to fabricated rows or fake KPI charts. It stays in an honest building state until a real backend surface exists." />
}

function withSessionMutation<T>(data: CoreOperationsWorkspaceData, action: (session: CoreOpsSession) => Promise<T>) {
  const session = readStoredSession()
  if (!session) throw new Error('Your live Core.Operations session has expired. Sign in again.')
  return action(session)
}

export function CoreOperationsDashboard() {
  return (
    <WorkspaceShell title="Core.Operations live dashboard" description="Real inventory, orders, invoices, delivery, marketing, customers, location, and intelligence — all sourced from the deployed core-operations-backend.">
      {(data) => <DashboardBody data={data} />}
    </WorkspaceShell>
  )
}

export function CoreOperationsModulePage({ moduleId }: { moduleId: string }) {
  const normalized = moduleId.toLowerCase()
  const descriptionMap: Record<string, string> = {
    pos: 'Live order capture and payment mix from real salesOrder records.',
    sales: 'Real sales performance from the live orders table.',
    orders: 'Operational fulfilment and dispatch tracking from live orders.',
    inventory: 'Real inventory control from the live inventoryItem table.',
    products: 'Real product catalog management using inventory records.',
    suppliers: 'Real supplier exposure derived from inventory supplier fields.',
    customers: 'Live customer accounts from the production CRM table.',
    accounting: 'Real invoice creation, status updates, and cash collection visibility.',
    finance: 'Real invoice creation, status updates, and cash collection visibility.',
    logistics: 'Real delivery assignments, operators, vehicles, zones, and notifications.',
    delivery: 'Real delivery assignments, operators, vehicles, zones, and notifications.',
    stores: 'Live location profile, weather, and delivery-zone context.',
    location: 'Live location profile, weather, and delivery-zone context.',
    'marketing-suite': 'Real campaigns, publishing, and AI text generation.',
    marketing: 'Real campaigns, publishing, and AI text generation.',
    messaging: 'Real channel readiness, connections, and participants.',
    monitoring: 'Real governed-action intelligence, emerging signals, and audit trail.',
  }

  return (
    <WorkspaceShell title={`${titleCase(moduleId)} workspace`} description={descriptionMap[normalized] ?? 'Live Core.Operations module view.'}>
      {(data) => {
        if (['pos', 'sales', 'orders'].includes(normalized)) return <OrdersModule data={data} moduleId={normalized} />
        if (['inventory', 'products', 'suppliers'].includes(normalized)) return <InventoryModule data={data} moduleId={normalized} />
        if (normalized === 'customers') return <CustomersModule data={data} />
        if (['accounting', 'finance'].includes(normalized)) return <AccountingModule data={data} />
        if (['logistics', 'delivery'].includes(normalized)) return <DeliveryModule data={data} />
        if (['stores', 'location'].includes(normalized)) return <LocationModule data={data} />
        if (['marketing-suite', 'marketing'].includes(normalized)) return <MarketingModule data={data} />
        if (normalized === 'messaging') return <MessagingModule data={data} />
        if (normalized === 'monitoring') return <MonitoringModule data={data} />
        return <HonestGapModule moduleId={moduleId} />
      }}
    </WorkspaceShell>
  )
}

export function CoreOperationsLoginPage() {
  return (
    <AuthSurface title="Core.Operations sign in" description="Use the seeded live tenant account to access the real core-operations-backend from this console.">
      {(session, controls) => (
        <section className="page-grid">
          <NoticeBanner tone="success">Signed in as {session.email} · role {session.role} · tenant {session.tenantId || 'scoped server-side'}.</NoticeBanner>
          <div className="module-grid">
            <article className="panel" style={{ display: 'grid', gap: 12 }}>
              <h2 style={{ margin: 0 }}>Go live</h2>
              <p style={{ margin: 0, color: '#cbd5e1' }}>Open the dashboard or jump straight into marketing, inventory, sales, customers, accounting, logistics, or location using the sidebar.</p>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                <a className="btn btn-primary" href="/dashboard">Open dashboard</a>
                <a className="btn btn-secondary" href="/marketing">Open marketing</a>
                <a className="btn btn-secondary" href="/modules/inventory">Open inventory</a>
              </div>
            </article>
            <article className="panel" style={{ display: 'grid', gap: 12 }}>
              <h2 style={{ margin: 0 }}>Session</h2>
              <p style={{ margin: 0, color: '#cbd5e1' }}>This browser now carries the live bearer token and tenant headers needed by the deployed backend.</p>
              <button type="button" className="btn btn-secondary" onClick={controls.logout}>Sign out</button>
            </article>
          </div>
        </section>
      )}
    </AuthSurface>
  )
}

export function CoreOperationsMarketingWorkspace() {
  return <CoreOperationsModulePage moduleId="marketing-suite" />
}

export function coreOperationsApiBase() {
  return CORE_OPS_API_BASE
}

export function coreOperationsApiPrefix() {
  return CORE_OPS_API_PREFIX
}

export const coreOperationsSessionStorageKey = CORE_OPS_SESSION_KEY
export const coreOperationsDeviceStorageKey = CORE_OPS_DEVICE_KEY
