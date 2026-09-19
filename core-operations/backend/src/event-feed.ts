/*
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { prisma } from './auth.js'
import { Prisma } from './generated/prisma/index.js'
import { generateAndStoreInsights, type FeedEvent } from './insights.js'

type StreamClient = { write: (chunk: string) => boolean }
const clients = new Set<StreamClient>()

const json = (value: unknown): Prisma.InputJsonValue => JSON.parse(JSON.stringify(value ?? {})) as Prisma.InputJsonValue
const text = (value: unknown) => String(value ?? '').trim()
const date = (value: unknown) => {
  if (!value) return undefined
  const parsed = new Date(String(value))
  if (Number.isNaN(parsed.getTime())) throw Object.assign(new Error('Event date filters must be valid ISO dates'), { status: 400 })
  return parsed
}

export type EventQuery = {
  source?: unknown
  type?: unknown
  types?: unknown
  actionId?: unknown
  sku?: unknown
  since?: unknown
  until?: unknown
  limit?: unknown
}

export function buildEventQuery(tenantId: string | undefined, query: EventQuery = {}): Prisma.EventFindManyArgs {
  const source = text(query.source)
  const type = text(query.type)
  const types = text(query.types).split(',').map((item) => item.trim()).filter(Boolean).slice(0, 20)
  const actionId = text(query.actionId)
  const sku = text(query.sku)
  const since = date(query.since)
  const until = date(query.until)
  const requestedLimit = Number(query.limit || 100)
  const limit = Number.isFinite(requestedLimit) ? Math.min(200, Math.max(1, Math.round(requestedLimit))) : 100
  const and: Prisma.EventWhereInput[] = []
  if (actionId) and.push({ payload: { path: ['actionId'], equals: actionId } })
  if (sku) and.push({ payload: { path: ['sku'], equals: sku } })
  return {
    where: {
      ...(tenantId ? { tenantId } : {}),
      ...(source ? { source } : {}),
      ...(type ? { type } : types.length ? { type: { in: types } } : {}),
      ...(since || until ? { createdAt: { ...(since ? { gte: since } : {}), ...(until ? { lte: until } : {}) } } : {}),
      ...(and.length ? { AND: and } : {}),
    },
    orderBy: { createdAt: 'desc' },
    take: limit,
  }
}

export const publishEvent = async (input: { tenantId?: string; type: string; source: string; payload?: unknown }) => {
  const event = await prisma.event.create({
    data: { tenantId: input.tenantId, type: input.type, source: input.source, payload: json(input.payload) },
  })
  const frame = `data: ${JSON.stringify(event)}\n\n`
  for (const client of clients) {
    try { client.write(frame) } catch { clients.delete(client) }
  }
  await generateAndStoreInsights(event as FeedEvent)
  return event
}

export const queryEvents = (tenantId: string | undefined, query: EventQuery = {}) =>
  prisma.event.findMany(buildEventQuery(tenantId, query))

export const listEvents = (tenantId: string | undefined, source?: string) =>
  queryEvents(tenantId, { source, limit: 200 })

type PatternEvent = { createdAt: Date; payload: unknown; type?: string; tenantId?: string | null }
export type PredictivePattern = {
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
}

export function summarizePatternEvents(signals: PatternEvent[], proposals: PatternEvent[], completions: PatternEvent[]) {
  const completionRate = proposals.length ? Math.round((completions.length / proposals.length) * 100) : 0
  const latestPayload = completions[0]?.payload && typeof completions[0].payload === 'object'
    ? completions[0].payload as Record<string, unknown>
    : null
  const lastOutcome = latestPayload?.outcome && typeof latestPayload.outcome === 'object'
    ? latestPayload.outcome as Record<string, unknown>
    : null
  return {
    similarSignals: signals.length,
    proposedActions: proposals.length,
    completedActions: completions.length,
    completionRate,
    lastCompletedAt: completions[0]?.createdAt.toISOString() ?? null,
    lastOutcome,
    narrative: completions.length
      ? `${completions.length} similar approved action${completions.length === 1 ? '' : 's'} completed previously${lastOutcome?.summary ? `; the latest ${String(lastOutcome.summary)}` : ''}.`
      : signals.length
        ? `${signals.length} similar signal${signals.length === 1 ? '' : 's'} observed, with no completed coordinated action yet.`
        : 'No comparable signal is recorded yet; this proposal establishes the first outcome baseline.',
  }
}

const eventKind = (event: PatternEvent) => {
  const payload = event.payload && typeof event.payload === 'object' ? event.payload as Record<string, unknown> : {}
  return String(payload.kind || '')
}

export function predictPatternOutcomes(
  kind: string,
  tenantEvents: PatternEvent[],
  cohortEvents: PatternEvent[],
  minimumCohortTenants = 3,
): PredictivePattern {
    const relevantTenantEvents = tenantEvents.filter((event) => eventKind(event) === kind)
    const relevantCohortEvents = cohortEvents.filter((event) => eventKind(event) === kind)
    const cohortTenantCount = new Set(relevantCohortEvents.map((event) => event.tenantId).filter(Boolean)).size
    const cohortIncluded = cohortTenantCount >= minimumCohortTenants
    const decisions = relevantTenantEvents.filter((event) => event.type === 'agent.action.completed' || event.type === 'agent.action.rejected')
    const cohortDecisions = cohortIncluded
      ? relevantCohortEvents.filter((event) => event.type === 'agent.action.completed' || event.type === 'agent.action.rejected')
      : []
    const assessments = [
      ...relevantTenantEvents.filter((event) => event.type === 'agent.action.outcome.assessed'),
      ...(cohortIncluded ? relevantCohortEvents.filter((event) => event.type === 'agent.action.outcome.assessed') : []),
    ]
    const evidence = [...decisions, ...cohortDecisions]
    const successfulOutcomes = evidence.filter((event) => event.type === 'agent.action.completed').length
    const issueOutcomes = evidence.filter((event) => event.type === 'agent.action.rejected').length
    const evidenceCount = successfulOutcomes + issueOutcomes
    const highImpactOutcomes = evidence.filter((event) => {
      if (event.type !== 'agent.action.completed' || !event.payload || typeof event.payload !== 'object') return false
      return Number((event.payload as Record<string, unknown>).estimatedValuePence || 0) >= 50_000
    }).length
    const highImpactOutcomeRate = successfulOutcomes ? Math.round((highImpactOutcomes / successfulOutcomes) * 100) : 0
    const smoothedSuccessRate = (successfulOutcomes + 1) / (evidenceCount + 2)
    const sampleStrength = Math.min(1, evidenceCount / 8)
    const accuracyValues = assessments.map((event) => {
      if (!event.payload || typeof event.payload !== 'object') return 0
      return Math.min(100, Math.max(0, Number((event.payload as Record<string, unknown>).accuracy || 0)))
    })
    const averageAccuracy = accuracyValues.length ? Math.round(accuracyValues.reduce((total, value) => total + value, 0) / accuracyValues.length) : 0
    const reliabilityAdjustment = accuracyValues.length ? Math.max(-5, Math.min(5, Math.round((averageAccuracy - 50) / 10))) : 0
    const confidence = Math.min(95, Math.max(5, Math.round(50 + (smoothedSuccessRate - 0.5) * 100 * sampleStrength + reliabilityAdjustment)))
    const reliabilityScore = Math.round((confidence * Math.min(1, Math.max(evidenceCount, assessments.length) / 14)) + (averageAccuracy * Math.min(1, assessments.length / 14))) / 2
    const refined = assessments.length >= 10 && evidenceCount >= 10
    const likelyNext = smoothedSuccessRate >= 0.6
      ? 'Approval usually leads to synchronized purchasing, inbound delivery, and finance records.'
      : smoothedSuccessRate <= 0.4
        ? 'Similar proposals often require revision or rejection before execution.'
        : 'Similar situations have mixed outcomes; review the trade-offs carefully before approval.'
    const confidenceLabel = evidenceCount >= 8 && Math.abs(smoothedSuccessRate - 0.5) >= 0.2
      ? 'strong'
      : evidenceCount >= 3
        ? 'moderate'
        : 'emerging'
    return {
      triggerPattern: 'A retail inventory threshold breach followed by a coordinated replenishment proposal.',
      likelyNext,
      likelyDownstreamEffects: [
        'Retail receives a governed purchase commitment.',
        'Logistics receives a linked inbound booking.',
        'Finance receives the matching supplier liability and cash exposure.',
      ],
      confidence,
      confidenceLabel,
      evidenceCount,
      successfulOutcomes,
      issueOutcomes,
      highImpactOutcomeRate,
      assessedOutcomes: assessments.length,
      averageAccuracy,
      reliabilityScore,
      refined,
      cohortEvidenceCount: cohortDecisions.length,
      cohortTenantCount: cohortIncluded ? cohortTenantCount : 0,
      cohortIncluded,
      basis: [
        `${decisions.length} tenant outcome${decisions.length === 1 ? '' : 's'}`,
        cohortIncluded
          ? `${cohortDecisions.length} anonymized outcome${cohortDecisions.length === 1 ? '' : 's'} across ${cohortTenantCount} tenants`
          : `cross-tenant cohort withheld until ${minimumCohortTenants} tenants contribute`,
        `${successfulOutcomes} successful and ${issueOutcomes} rejected outcome${issueOutcomes === 1 ? '' : 's'}`,
        `${highImpactOutcomeRate}% of successful precedents carried at least £500 of recorded impact`,
        assessments.length
          ? `${assessments.length} prediction assessment${assessments.length === 1 ? '' : 's'} averaged ${averageAccuracy}% accuracy`
          : 'no completed prediction assessments yet',
      ],
    }
}

export async function predictEventPattern(tenantId: string, kind: string) {
  const since = new Date(Date.now() - 180 * 24 * 60 * 60_000)
  const where = {
    type: { in: ['agent.action.completed', 'agent.action.rejected', 'agent.action.outcome.assessed'] },
    createdAt: { gte: since },
  }
  const [tenantEvents, cohortEvents] = await Promise.all([
    prisma.event.findMany({ where: { ...where, tenantId }, orderBy: { createdAt: 'desc' }, take: 200 }),
    prisma.event.findMany({ where: { ...where, tenantId: { not: tenantId } }, orderBy: { createdAt: 'desc' }, take: 500 }),
  ])
  return predictPatternOutcomes(kind, tenantEvents, cohortEvents)
}

export async function summarizeEventPattern(tenantId: string, kind: string, sku?: string) {
  const since = new Date(Date.now() - 180 * 24 * 60 * 60_000)
  const [signals, proposals, completions] = await Promise.all([
    queryEvents(tenantId, { type: 'inventory.threshold.breached', sku, since, limit: 100 }),
    queryEvents(tenantId, { type: 'agent.action.proposed', since, limit: 100 }),
    queryEvents(tenantId, { type: 'agent.action.completed', since, limit: 100 }),
  ])
  const matchingKind = (event: { payload: unknown }) => {
    const payload = event.payload && typeof event.payload === 'object' ? event.payload as Record<string, unknown> : {}
    return payload.kind === kind
  }
  return summarizePatternEvents(signals, proposals.filter(matchingKind), completions.filter(matchingKind))
}

export const registerEventStreamClient = (client: StreamClient) => {
  clients.add(client)
  return () => clients.delete(client)
}
