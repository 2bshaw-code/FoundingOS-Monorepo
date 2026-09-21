/*
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { useCallback, useEffect, useState } from 'react'
import { Pressable, RefreshControl, StyleSheet, View } from 'react-native'
import { useLocalSearchParams, router } from 'expo-router'
import { BRANDS } from '../../../lib/brands'
import {
  CoreOpsApiError,
  fetchAgentActionIntelligence,
  fetchMarketingWorkspace,
  fetchMessagingConnections,
  fetchMessagingParticipants,
  fetchMessagingReadiness,
  fetchOwnerOperations,
} from '../../../lib/core-operations-api'
import { buildCrmRecords, computeLeadScore, creditSafetyLookup, type CrmRecord } from '../../../lib/crm-api'
import { candidateCity, citiesInUse } from '../../../lib/talent-location'
import {
  CoreWorkforceApiError,
  listCandidates,
  listInterviews,
  listJobs,
} from '../../../lib/core-workforce-api'
import { QuantumBackButton } from '../../../components/QuantumBackButton'
import {
  QuantumButton,
  QuantumCard,
  QuantumLoadingScreen,
  QuantumNotice,
  QuantumScreen,
  QuantumSectionHeader,
  QuantumText,
  getSemanticColor,
  quantumColors,
  quantumRadius,
  quantumSpace,
} from '../../../components/QuantumUI'

type ModuleTone = 'good' | 'watch' | 'risk' | 'info'
type ModuleMetric = { label: string; value: string; tone?: ModuleTone }
type ModuleItem = { id: string; title: string; subtitle?: string; meta?: string; tone?: ModuleTone }
type AgingBucket = { bucket: string; count: number; amountPence: number }
type AgingWorstItem = { id: string; title: string; daysOverdue: number; amountPence: number }
type CalendarEntry = { id: string; day: number; title: string; status: string; tone: ModuleTone }
type FunnelStage = { stage: string; count: number }
type StockGaugeItem = { id: string; name: string; sku: string; stock: number; lowStockLevel: number }
type ModuleView = {
  title: string
  description: string
  metrics: ModuleMetric[]
  items: ModuleItem[]
  emptyLabel: string
  ctaLabel: string
  ctaRoute: string
  // Bespoke panel data. When set, the screen renders a purpose-built visual
  // (aging chart / calendar grid / funnel bars) in place of the generic list.
  aging?: { buckets: AgingBucket[]; worst: AgingWorstItem[] }
  calendar?: { month: string; daysInMonth: number; entries: CalendarEntry[] }
  funnel?: FunnelStage[]
  crm?: { records: CrmRecord[] }
  stock?: { items: StockGaugeItem[] }
}

function formatPence(pence: number | null | undefined): string {
  if (!pence) return '£0'
  return `£${(pence / 100).toLocaleString('en-GB', { maximumFractionDigits: 0 })}`
}

function formatDate(iso: string | null | undefined): string {
  if (!iso) return 'No date set'
  return new Date(iso).toLocaleString('en-GB', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })
}

function toneForStatus(status: string): ModuleTone {
  const value = status.toLowerCase()
  if (['completed', 'paid', 'delivered', 'hired', 'filled', 'active', 'open'].includes(value)) return 'good'
  if (['overdue', 'rejected', 'failed', 'cancelled', 'no_show'].includes(value)) return 'risk'
  return 'watch'
}

const AGING_BUCKET_LABELS = ['Current', '1-30 days', '31-60 days', '61-90 days', '90+ days']

function buildInvoiceAging(invoices: { id: string; number: string; totalPence: number; dueAt?: string | null; paidAt?: string | null }[]): ModuleView['aging'] {
  const now = Date.now()
  const buckets: AgingBucket[] = AGING_BUCKET_LABELS.map((bucket) => ({ bucket, count: 0, amountPence: 0 }))
  const worst: AgingWorstItem[] = []
  for (const invoice of invoices) {
    if (invoice.paidAt || !invoice.dueAt) continue
    const daysOverdue = Math.floor((now - new Date(invoice.dueAt).getTime()) / (24 * 60 * 60 * 1000))
    const index = daysOverdue <= 0 ? 0 : daysOverdue <= 30 ? 1 : daysOverdue <= 60 ? 2 : daysOverdue <= 90 ? 3 : 4
    buckets[index].count += 1
    buckets[index].amountPence += invoice.totalPence
    if (daysOverdue > 0) worst.push({ id: invoice.id, title: invoice.number, daysOverdue, amountPence: invoice.totalPence })
  }
  worst.sort((a, b) => b.daysOverdue - a.daysOverdue)
  return { buckets, worst: worst.slice(0, 5) }
}

// Ranks inventory by how close each item is to its reorder point (lowest
// headroom first), mirroring the web app's stock-take gauge so the mobile
// app surfaces the same replenishment priorities first.
function buildStockGauge(inventory: { id: string; name: string; sku: string; stock: number; lowStockLevel: number }[]): ModuleView['stock'] {
  const ranked = [...inventory].sort((a, b) => (a.stock - a.lowStockLevel) - (b.stock - b.lowStockLevel))
  return { items: ranked.slice(0, 8) }
}

function buildMarketingCalendar(campaigns: { id: string; name: string; status: string; scheduledAt?: string | null }[]): ModuleView['calendar'] {
  const reference = new Date()
  const daysInMonth = new Date(reference.getFullYear(), reference.getMonth() + 1, 0).getDate()
  const monthLabel = reference.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })
  const entries: CalendarEntry[] = campaigns
    .filter((c) => c.scheduledAt)
    .map((c) => ({
      id: c.id,
      day: new Date(c.scheduledAt as string).getDate(),
      title: c.name,
      status: c.status,
      tone: toneForStatus(c.status),
    }))
  return { month: monthLabel, daysInMonth, entries }
}

async function loadCoreOperationsModule(moduleId: string): Promise<ModuleView> {
  if (moduleId === 'crm') {
    const records = buildCrmRecords()
    const hot = records.filter((r) => computeLeadScore(r, records).tier === 'Hot').length
    const overdue = records.filter((r) => r.daysUntilFollowUp < 0).length
    return {
      title: 'CRM',
      description: 'Every contact with an explainable lead score, follow-up status, and a live company credit check.',
      metrics: [
        { label: 'Contacts', value: String(records.length), tone: 'info' },
        { label: '🔥 Hot leads', value: String(hot), tone: hot > 0 ? 'good' : 'watch' },
        { label: 'Follow-ups overdue', value: String(overdue), tone: overdue > 0 ? 'risk' : 'good' },
      ],
      items: [],
      emptyLabel: 'No contacts yet.',
      ctaLabel: 'Open Core.Operations',
      ctaRoute: '/(app)/home',
      crm: { records },
    }
  }
  if (moduleId === 'orders') {
    const { orders, metrics } = await fetchOwnerOperations()
    return {
      title: 'Orders',
      description: 'Live sales orders with payment and delivery status, pulled straight from the shared operations ledger.',
      metrics: [
        { label: 'Open orders', value: String(metrics.orders), tone: 'info' },
        { label: 'Revenue', value: formatPence(metrics.orderRevenuePence), tone: 'good' },
      ],
      items: orders.map((order) => ({
        id: order.id,
        title: order.reference,
        subtitle: `${order.status} · ${formatPence(order.totalPence)}`,
        meta: [order.paymentStatus, order.deliveryStatus].filter(Boolean).join(' · '),
        tone: toneForStatus(order.status),
      })),
      emptyLabel: 'No orders yet.',
      ctaLabel: 'Open Work & Approvals',
      ctaRoute: '/(app)/workflows',
    }
  }
  if (moduleId === 'invoices') {
    const { invoices, metrics } = await fetchOwnerOperations()
    return {
      title: 'Invoices',
      description: 'Receivables and payment collection status across every issued invoice.',
      metrics: [
        { label: 'Unpaid', value: String(metrics.unpaidInvoices), tone: metrics.unpaidInvoices > 0 ? 'watch' : 'good' },
        { label: 'Outstanding', value: formatPence(metrics.outstandingPence), tone: metrics.outstandingPence > 0 ? 'watch' : 'good' },
      ],
      items: invoices.map((invoice) => ({
        id: invoice.id,
        title: invoice.number,
        subtitle: `${invoice.status} · ${formatPence(invoice.totalPence)}`,
        meta: invoice.paidAt ? `Paid ${formatDate(invoice.paidAt)}` : `Due ${formatDate(invoice.dueAt)}`,
        tone: toneForStatus(invoice.status),
      })),
      emptyLabel: 'No invoices yet.',
      ctaLabel: 'Open Work & Approvals',
      ctaRoute: '/(app)/workflows',
      aging: buildInvoiceAging(invoices),
    }
  }
  if (moduleId === 'inventory') {
    const { inventory, metrics } = await fetchOwnerOperations()
    return {
      title: 'Inventory',
      description: 'Stock levels and low-stock alerts requiring replenishment attention.',
      metrics: [
        { label: 'Items tracked', value: String(metrics.inventoryItems), tone: 'info' },
        { label: 'Low stock', value: String(metrics.lowStock), tone: metrics.lowStock > 0 ? 'risk' : 'good' },
        { label: 'Value', value: formatPence(metrics.inventoryValuePence), tone: 'info' },
      ],
      items: inventory.map((item) => ({
        id: item.id,
        title: item.name,
        subtitle: `${item.sku} · ${item.category}`,
        meta: `${item.stock} in stock (alert below ${item.lowStockLevel})`,
        tone: item.stock <= item.lowStockLevel ? 'risk' : 'good',
      })),
      emptyLabel: 'No inventory items yet.',
      ctaLabel: 'Open Command Deck',
      ctaRoute: '/(app)/home',
      stock: buildStockGauge(inventory),
    }
  }
  if (moduleId === 'marketing') {
    const { campaigns, metrics } = await fetchMarketingWorkspace()
    const liveCount = campaigns.filter((c) => c.status.toLowerCase() === 'live').length
    return {
      title: 'Marketing',
      description: 'Live campaigns and performance across every connected channel.',
      metrics: [
        { label: 'Campaigns', value: String(metrics.campaigns), tone: 'info' },
        { label: 'Live now', value: String(liveCount), tone: liveCount > 0 ? 'good' : 'watch' },
        { label: 'Conversions', value: String(metrics.conversions), tone: 'good' },
        { label: 'Revenue', value: formatPence(metrics.revenuePence), tone: 'good' },
      ],
      items: campaigns.map((campaign) => ({
        id: campaign.id,
        title: campaign.name,
        subtitle: `${campaign.objective} · ${campaign.status}`,
        meta: `${campaign.impressions} impressions · ${campaign.conversions} conversions`,
        tone: toneForStatus(campaign.status),
      })),
      emptyLabel: 'No campaigns yet.',
      ctaLabel: 'Open Marketing Console',
      ctaRoute: '/(app)/marketing',
      calendar: buildMarketingCalendar(campaigns),
    }
  }
  // messaging
  const [readiness, connections, participants] = await Promise.all([
    fetchMessagingReadiness(),
    fetchMessagingConnections(),
    fetchMessagingParticipants(),
  ])
  return {
    title: 'Messaging',
    description: 'WhatsApp connection health and authorized participants for governed conversations.',
    metrics: [
      { label: 'Operational', value: readiness.operational ? 'Yes' : 'No', tone: readiness.operational ? 'good' : 'risk' },
      { label: 'Authorized', value: String(readiness.authorizedParticipants), tone: 'info' },
      { label: 'Failed (24h)', value: String(readiness.failedDeliveriesLast24Hours), tone: readiness.failedDeliveriesLast24Hours > 0 ? 'risk' : 'good' },
    ],
    items: [
      ...connections.map((c) => ({ id: `conn-${c.channel}`, title: c.displayName || c.channel, subtitle: c.channel, meta: c.active ? 'Active' : 'Inactive', tone: (c.active ? 'good' : 'watch') as ModuleTone })),
      ...participants.map((p) => ({ id: p.id, title: p.displayName || p.address, subtitle: `${p.channel} · ${p.role}`, meta: p.active ? 'Active' : 'Inactive', tone: (p.active ? 'good' : 'watch') as ModuleTone })),
    ],
    emptyLabel: 'No messaging connections yet.',
    ctaLabel: 'Open Automation',
    ctaRoute: '/(app)/automation',
  }
}

async function loadCoreWorkforceModule(moduleId: string): Promise<ModuleView> {
  if (moduleId === 'roles') {
    const jobs = await listJobs()
    return {
      title: 'Roles',
      description: 'Every open, filled, and closed role in the hiring pipeline.',
      metrics: [
        { label: 'Open', value: String(jobs.filter((j) => j.status === 'open').length), tone: 'info' },
        { label: 'Filled', value: String(jobs.filter((j) => j.status === 'filled').length), tone: 'good' },
      ],
      items: jobs.map((job) => ({
        id: job.id,
        title: job.title,
        subtitle: [job.department, job.location].filter(Boolean).join(' · '),
        meta: job.status,
        tone: toneForStatus(job.status),
      })),
      emptyLabel: 'No roles yet.',
      ctaLabel: 'Open Core.Workforce',
      ctaRoute: '/(app)/workforce',
    }
  }
  if (moduleId === 'applicants') {
    const candidates = await listCandidates()
    const cities = citiesInUse(candidates.map((c) => c.id))
    return {
      title: 'Applicants',
      description: 'Every candidate across every open role, with current stage and city (matches the web Talent location map).',
      metrics: [
        { label: 'Total', value: String(candidates.length), tone: 'info' },
        { label: 'In interview', value: String(candidates.filter((c) => c.stage === 'Interview').length), tone: 'watch' },
        { label: 'Cities', value: String(cities.length), tone: 'info' },
      ],
      items: candidates.map((c) => ({
        id: c.id,
        title: c.name,
        subtitle: c.job?.title ?? 'Role unavailable',
        meta: `${c.stage} · ${candidateCity(c.id)}`,
        tone: toneForStatus(c.stage),
      })),
      emptyLabel: 'No applicants yet.',
      ctaLabel: 'Open Core.Workforce',
      ctaRoute: '/(app)/workforce',
    }
  }
  if (moduleId === 'pipeline') {
    const candidates = await listCandidates()
    const stageOrder: string[] = ['Applied', 'Screening', 'Interview', 'Offer', 'Hired', 'Rejected']
    const counts = stageOrder.map((stage) => ({ stage, count: candidates.filter((c) => c.stage === stage).length }))
    return {
      title: 'Pipeline',
      description: 'Candidate volume at each stage of the hiring pipeline.',
      metrics: [{ label: 'Total candidates', value: String(candidates.length), tone: 'info' }],
      items: counts.map(({ stage, count }) => ({
        id: stage,
        title: stage,
        subtitle: `${count} candidate${count === 1 ? '' : 's'}`,
        tone: toneForStatus(stage),
      })),
      emptyLabel: 'No pipeline data yet.',
      ctaLabel: 'Open Core.Workforce',
      ctaRoute: '/(app)/workforce',
      funnel: counts,
    }
  }
  // interviews
  const interviews = await listInterviews()
  return {
    title: 'Interviews',
    description: 'Scheduled and completed interviews across the hiring pipeline.',
    metrics: [
      { label: 'Scheduled', value: String(interviews.filter((i) => i.status === 'scheduled').length), tone: 'watch' },
      { label: 'Completed', value: String(interviews.filter((i) => i.status === 'completed').length), tone: 'good' },
    ],
    items: interviews.map((interview) => ({
      id: interview.id,
      title: `Interview with ${interview.interviewer}`,
      subtitle: formatDate(interview.scheduledAt),
      meta: interview.status,
      tone: toneForStatus(interview.status),
    })),
    emptyLabel: 'No interviews scheduled yet.',
    ctaLabel: 'Open Core.Workforce',
    ctaRoute: '/(app)/workforce',
  }
}

async function loadCoreIntelligenceModule(moduleId: string): Promise<ModuleView> {
  const data = await fetchAgentActionIntelligence()
  if (moduleId === 'accuracy') {
    return {
      title: 'Accuracy',
      description: data.health.narrative,
      metrics: [
        { label: 'Prediction accuracy', value: `${Math.round(data.health.averagePredictionAccuracy * 100)}%`, tone: 'info' },
        { label: 'Assessed outcomes', value: String(data.health.totalAssessedOutcomes), tone: 'info' },
        { label: 'Confidence lift', value: `${Math.round(data.health.confidenceImprovement * 100)}%`, tone: 'good' },
      ],
      items: data.health.recurringDeviation
        ? [{ id: 'deviation', title: data.health.recurringDeviation.field, subtitle: `${data.health.recurringDeviation.count}x recurring`, meta: data.health.recurringDeviation.insight, tone: 'watch' }]
        : [],
      emptyLabel: 'No recurring deviations detected.',
      ctaLabel: 'Open Core.Intelligence',
      ctaRoute: '/(app)/intelligence',
    }
  }
  if (moduleId === 'learning') {
    return {
      title: 'Learning',
      description: data.snapshot.economicValue.narrative,
      metrics: [
        { label: 'Momentum', value: data.snapshot.learningMomentum.label, tone: 'good' },
        { label: 'Refined patterns', value: String(data.snapshot.refinedPatterns), tone: 'info' },
        { label: 'Cash preserved', value: formatPence(data.snapshot.economicValue.cashPreservedPence), tone: 'good' },
      ],
      items: data.snapshot.economicValue.methodology.map((line, index) => ({ id: `method-${index}`, title: line })),
      emptyLabel: 'No methodology recorded yet.',
      ctaLabel: 'Open Core.Intelligence',
      ctaRoute: '/(app)/intelligence',
    }
  }
  if (moduleId === 'signals') {
    return {
      title: 'Signals',
      description: 'Emerging signals surfaced across the governed action ledger.',
      metrics: [{ label: 'Active signals', value: String(data.emergingSignals.length), tone: 'info' }],
      items: data.emergingSignals.map((signal) => ({
        id: signal.id,
        title: signal.title,
        subtitle: signal.summary,
        meta: `Reliability ${Math.round(signal.reliability * 100)}%`,
        tone: signal.severity === 'material' ? 'risk' : signal.severity === 'positive' ? 'good' : 'watch',
      })),
      emptyLabel: 'No emerging signals right now.',
      ctaLabel: 'Open Core.Intelligence',
      ctaRoute: '/(app)/intelligence',
    }
  }
  // audit-trail
  return {
    title: 'Audit Trail',
    description: 'Every governed action stage — suggestion through execution and reversal — with full evidence.',
    metrics: [{ label: 'Recorded events', value: String(data.auditTrail.length), tone: 'info' }],
    items: data.auditTrail.map((entry) => ({
      id: entry.id,
      title: entry.actionTitle,
      subtitle: `${entry.stage.toUpperCase()} · ${entry.actor}`,
      meta: formatDate(entry.occurredAt),
      tone: entry.stage === 'reversed' ? 'watch' : entry.stage === 'rejected' ? 'risk' : 'good',
    })),
    emptyLabel: 'No audit events recorded yet.',
    ctaLabel: 'Open Guardian',
    ctaRoute: '/(app)/guardian',
  }
}

async function loadModule(brandSlug: string, moduleId: string): Promise<ModuleView> {
  if (brandSlug === 'core_workforce') return loadCoreWorkforceModule(moduleId)
  if (brandSlug === 'core_intelligence') return loadCoreIntelligenceModule(moduleId)
  return loadCoreOperationsModule(moduleId)
}

function InvoiceAgingPanel({ aging }: { aging: NonNullable<ModuleView['aging']> }) {
  const maxAmount = Math.max(1, ...aging.buckets.map((b) => b.amountPence))
  return (
    <QuantumCard accent={quantumColors.neutral200}>
      <QuantumText variant="h3">Aging by days overdue</QuantumText>
      <View style={styles.agingChart}>
        {aging.buckets.map((bucket) => {
          const heightPct = Math.max(4, Math.round((bucket.amountPence / maxAmount) * 100))
          const tone = bucket.bucket === 'Current' ? 'good' : bucket.bucket === '90+ days' ? 'risk' : 'watch'
          return (
            <View key={bucket.bucket} style={styles.agingCol}>
              <QuantumText variant="caption">{formatPence(bucket.amountPence)}</QuantumText>
              <View style={styles.agingBarTrack}>
                <View style={[styles.agingBarFill, { height: `${heightPct}%`, backgroundColor: getSemanticColor(tone) }]} />
              </View>
              <QuantumText variant="caption" color="#7F7F7F" align="center">{bucket.bucket}</QuantumText>
              <QuantumText variant="caption" color="#7F7F7F">{bucket.count} invoice{bucket.count === 1 ? '' : 's'}</QuantumText>
            </View>
          )
        })}
      </View>
      {aging.worst.length > 0 ? (
        <>
          <QuantumText variant="h3" style={styles.agingWorstHeading}>Most overdue</QuantumText>
          {aging.worst.map((invoice) => (
            <View key={invoice.id} style={styles.agingWorstRow}>
              <QuantumText style={styles.title}>{invoice.title}</QuantumText>
              <QuantumText color={quantumColors.danger}>{invoice.daysOverdue}d · {formatPence(invoice.amountPence)}</QuantumText>
            </View>
          ))}
        </>
      ) : null}
    </QuantumCard>
  )
}

function MarketingCalendarPanel({ calendar }: { calendar: NonNullable<ModuleView['calendar']> }) {
  const days = Array.from({ length: calendar.daysInMonth }, (_, i) => i + 1)
  const entriesByDay = new Map<number, CalendarEntry[]>()
  for (const entry of calendar.entries) {
    entriesByDay.set(entry.day, [...(entriesByDay.get(entry.day) ?? []), entry])
  }
  return (
    <QuantumCard accent={quantumColors.neutral200}>
      <QuantumText variant="h3">{calendar.month}</QuantumText>
      <View style={styles.calendarGrid}>
        {days.map((day) => {
          const dayEntries = entriesByDay.get(day) ?? []
          const isToday = day === new Date().getDate()
          return (
            <View key={day} style={[styles.calendarCell, isToday && styles.calendarCellToday]}>
              <QuantumText variant="caption" color={isToday ? quantumColors.neutral900 : '#7F7F7F'}>{day}</QuantumText>
              {dayEntries.slice(0, 2).map((entry) => (
                <View key={entry.id} style={[styles.calendarDot, { backgroundColor: getSemanticColor(entry.tone) }]} />
              ))}
            </View>
          )
        })}
      </View>
      {calendar.entries.length === 0 ? <QuantumNotice>No campaigns scheduled this month.</QuantumNotice> : (
        calendar.entries
          .slice()
          .sort((a, b) => a.day - b.day)
          .map((entry) => (
            <View key={entry.id} style={styles.agingWorstRow}>
              <QuantumText style={styles.title}>{entry.title}</QuantumText>
              <QuantumText color={getSemanticColor(entry.tone)}>Day {entry.day} · {entry.status}</QuantumText>
            </View>
          ))
      )}
    </QuantumCard>
  )
}

const TIER_EMOJI: Record<'Hot' | 'Warm' | 'Cold', string> = { Hot: '🔥', Warm: '🌤', Cold: '❄️' }
const TIER_TONE: Record<'Hot' | 'Warm' | 'Cold', ModuleTone> = { Hot: 'risk', Warm: 'watch', Cold: 'info' }

function formatPenceCompact(pence: number): string {
  return `£${(pence / 100).toLocaleString('en-GB', { maximumFractionDigits: 0 })}`
}

function CRMContactCard({ record, records, expanded, onToggle }: { record: CrmRecord; records: CrmRecord[]; expanded: boolean; onToggle: () => void }) {
  const { score, tier, factors } = computeLeadScore(record, records)
  const credit = creditSafetyLookup(record.company)
  const followUpLabel = record.daysUntilFollowUp < 0
    ? `${Math.abs(record.daysUntilFollowUp)}d overdue`
    : record.daysUntilFollowUp === 0
      ? 'Due today'
      : `Due in ${record.daysUntilFollowUp}d`
  return (
    <Pressable onPress={onToggle}>
      <QuantumCard accent={getSemanticColor(TIER_TONE[tier])}>
        <View style={styles.crmHeaderRow}>
          <View style={{ flex: 1 }}>
            <QuantumText style={styles.title}>{record.name}</QuantumText>
            <QuantumText variant="caption" color="#7F7F7F">{record.company}</QuantumText>
          </View>
          <View style={styles.crmScoreBadge}>
            <QuantumText variant="caption" color={getSemanticColor(TIER_TONE[tier])}>{TIER_EMOJI[tier]} {score} · {tier}</QuantumText>
          </View>
        </View>
        <QuantumText variant="caption" color="#D8D8D8">{record.status} · {formatPenceCompact(record.valuePence)} · Owner {record.owner}</QuantumText>
        <QuantumText variant="caption" color={record.daysUntilFollowUp < 0 ? quantumColors.danger : '#7F7F7F'}>{followUpLabel}</QuantumText>
        {expanded ? (
          <View style={styles.crmExpanded}>
            <QuantumText variant="h3" style={styles.agingWorstHeading}>Why this score</QuantumText>
            {factors.map((factor) => (
              <QuantumText key={factor} variant="caption" color="#D8D8D8">• {factor}</QuantumText>
            ))}
            <QuantumText variant="h3" style={styles.agingWorstHeading}>Credit safety (CreditSafe{credit.source === 'demo' ? ' · demo data' : ''})</QuantumText>
            <View style={styles.crmHeaderRow}>
              <QuantumText color={getSemanticColor(credit.band === 'Low risk' ? 'good' : credit.band === 'Medium risk' ? 'watch' : 'risk')}>
                {credit.score}/100 · {credit.band}
              </QuantumText>
              <QuantumText variant="caption" color="#7F7F7F">Limit {formatPenceCompact(credit.limitPence)}</QuantumText>
            </View>
          </View>
        ) : null}
      </QuantumCard>
    </Pressable>
  )
}

function CRMPipelinePanel({ records }: { records: CrmRecord[] }) {
  const [expandedId, setExpandedId] = useState<string | null>(null)
  return (
    <>
      {records.map((record) => (
        <CRMContactCard
          key={record.id}
          record={record}
          records={records}
          expanded={expandedId === record.id}
          onToggle={() => setExpandedId((current) => (current === record.id ? null : record.id))}
        />
      ))}
    </>
  )
}

// Mirrors the web app's stock-take gauge: a horizontal bar scaled to 3x the
// reorder point, with a threshold marker so operators can see headroom at a
// glance, plus an explicit alert when an item is below its reorder point.
function StockGaugePanel({ stock }: { stock: NonNullable<ModuleView['stock']> }) {
  return (
    <QuantumCard accent={quantumColors.neutral200}>
      <QuantumText variant="h3">Reorder priority</QuantumText>
      {stock.items.map((item) => {
        const scale = Math.max(1, item.lowStockLevel * 3)
        const pct = Math.max(4, Math.min(100, Math.round((item.stock / scale) * 100)))
        const thresholdPct = Math.min(96, Math.round((item.lowStockLevel / scale) * 100))
        const low = item.stock <= item.lowStockLevel
        return (
          <View key={item.id} style={styles.stockRow}>
            <View style={styles.stockHeader}>
              <QuantumText style={styles.title}>{item.name}</QuantumText>
              <QuantumText variant="caption" color="#7F7F7F">{item.sku}</QuantumText>
            </View>
            <View style={styles.stockGaugeTrack}>
              <View style={[styles.stockGaugeFill, { width: `${pct}%`, backgroundColor: getSemanticColor(low ? 'risk' : 'good') }]} />
              <View style={[styles.stockGaugeMarker, { left: `${thresholdPct}%` }]} />
            </View>
            <QuantumText variant="caption" color="#D8D8D8">{item.stock} on hand · reorder at {item.lowStockLevel}</QuantumText>
            {low ? <QuantumText variant="caption" color={getSemanticColor('risk')}>⚠️ Below reorder point — raise a purchase order</QuantumText> : null}
          </View>
        )
      })}
    </QuantumCard>
  )
}

function PipelineFunnelPanel({ funnel }: { funnel: FunnelStage[] }) {
  const maxCount = Math.max(1, ...funnel.map((f) => f.count))
  return (
    <QuantumCard accent={quantumColors.neutral200}>
      <QuantumText variant="h3">Candidate funnel</QuantumText>
      {funnel.map((stage) => {
        const widthPct = Math.max(6, Math.round((stage.count / maxCount) * 100))
        return (
          <View key={stage.stage} style={styles.funnelRow}>
            <QuantumText variant="caption" style={styles.funnelLabel}>{stage.stage}</QuantumText>
            <View style={styles.funnelTrack}>
              <View style={[styles.funnelBar, { width: `${widthPct}%` }]} />
            </View>
            <QuantumText variant="caption">{stage.count}</QuantumText>
          </View>
        )
      })}
    </QuantumCard>
  )
}

export default function ModuleDetailScreen() {
  const { slug, moduleId } = useLocalSearchParams<{ slug: string; moduleId: string }>()
  const brand = BRANDS.find((entry) => entry.slug === slug)
  const [view, setView] = useState<ModuleView | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState('')

  const load = useCallback(async (isRefresh = false) => {
    if (!slug || !moduleId) return
    if (isRefresh) setRefreshing(true)
    setError('')
    try {
      setView(await loadModule(slug, moduleId))
    } catch (err) {
      if ((err instanceof CoreOpsApiError || err instanceof CoreWorkforceApiError) && err.status === 401) {
        setError('This module requires a signed-in session.')
      } else {
        setError('Could not load live data. Pull down to try again.')
      }
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [slug, moduleId])

  useEffect(() => {
    load()
  }, [load])

  if (!brand) return null
  if (loading) return <QuantumLoadingScreen />

  return (
    <QuantumScreen refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => load(true)} tintColor={brand.accent} />}>
      <QuantumBackButton label={`‹ ${brand.name}`} fallbackHref={`/brand-detail/${brand.slug}`} />
      {error ? <QuantumNotice tone="danger">{error}</QuantumNotice> : null}
      {view ? (
        <>
          <QuantumCard accent={brand.accent}>
            <QuantumText variant="overline" color={brand.accent}>{brand.name}</QuantumText>
            <QuantumText variant="h1">{view.title}</QuantumText>
            <QuantumText color="#D8D8D8">{view.description}</QuantumText>
          </QuantumCard>

          <QuantumSectionHeader label="Metrics" />
          <View style={styles.metricGrid}>
            {view.metrics.map((metric) => (
              <QuantumCard key={metric.label} accent={getSemanticColor(metric.tone ?? 'info')} style={styles.metricCard}>
                <QuantumText variant="caption" color="#D8D8D8">{metric.label}</QuantumText>
                <QuantumText variant="h2">{metric.value}</QuantumText>
              </QuantumCard>
            ))}
          </View>

          <QuantumSectionHeader label={view.title} />
          {view.crm ? (
            view.crm.records.length === 0 ? <QuantumNotice>{view.emptyLabel}</QuantumNotice> : <CRMPipelinePanel records={view.crm.records} />
          ) : view.aging ? (
            <InvoiceAgingPanel aging={view.aging} />
          ) : view.calendar ? (
            <MarketingCalendarPanel calendar={view.calendar} />
          ) : view.funnel ? (
            <PipelineFunnelPanel funnel={view.funnel} />
          ) : view.stock ? (
            view.stock.items.length === 0 ? <QuantumNotice>{view.emptyLabel}</QuantumNotice> : <StockGaugePanel stock={view.stock} />
          ) : view.items.length === 0 ? (
            <QuantumNotice>{view.emptyLabel}</QuantumNotice>
          ) : (
            view.items.map((item) => (
              <QuantumCard key={item.id} accent={getSemanticColor(item.tone ?? 'info')}>
                <QuantumText style={styles.title}>{item.title}</QuantumText>
                {item.subtitle ? <QuantumText variant="caption">{item.subtitle}</QuantumText> : null}
                {item.meta ? <QuantumText variant="caption" color="#7F7F7F">{item.meta}</QuantumText> : null}
              </QuantumCard>
            ))
          )}

          <QuantumButton onPress={() => router.push(view.ctaRoute as never)}>{view.ctaLabel}</QuantumButton>
        </>
      ) : null}
    </QuantumScreen>
  )
}

const styles = StyleSheet.create({
  metricGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: quantumSpace.md },
  metricCard: { flexGrow: 1, flexBasis: '47%', minWidth: 148 },
  title: { fontWeight: '600' },
  agingChart: { flexDirection: 'row', justifyContent: 'space-between', gap: quantumSpace.sm, marginTop: quantumSpace.md, height: 140 },
  agingCol: { flex: 1, alignItems: 'center', justifyContent: 'flex-end', gap: quantumSpace.xs },
  agingBarTrack: { width: '100%', flex: 1, borderRadius: quantumRadius.sm, backgroundColor: quantumColors.neutral800, justifyContent: 'flex-end', overflow: 'hidden' },
  agingBarFill: { width: '100%', borderRadius: quantumRadius.sm },
  agingWorstHeading: { marginTop: quantumSpace.lg, marginBottom: quantumSpace.xs },
  agingWorstRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: quantumSpace.sm, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: quantumColors.neutral700 },
  calendarGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 4, marginTop: quantumSpace.md, marginBottom: quantumSpace.md },
  calendarCell: { width: '13%', aspectRatio: 1, borderRadius: quantumRadius.sm, backgroundColor: quantumColors.neutral800, alignItems: 'center', justifyContent: 'center', gap: 2 },
  calendarCellToday: { backgroundColor: quantumColors.success },
  calendarDot: { width: 5, height: 5, borderRadius: 3 },
  funnelRow: { flexDirection: 'row', alignItems: 'center', gap: quantumSpace.sm, marginTop: quantumSpace.sm },
  funnelLabel: { width: 84 },
  funnelTrack: { flex: 1, height: 14, borderRadius: quantumRadius.sm, backgroundColor: quantumColors.neutral800, overflow: 'hidden' },
  funnelBar: { height: '100%', borderRadius: quantumRadius.sm, backgroundColor: quantumColors.neutral200 },
  stockRow: { marginTop: quantumSpace.md, paddingTop: quantumSpace.md, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: quantumColors.neutral700, gap: quantumSpace.xs },
  stockHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  stockGaugeTrack: { height: 10, borderRadius: quantumRadius.sm, backgroundColor: quantumColors.neutral800, overflow: 'visible', justifyContent: 'center' },
  stockGaugeFill: { height: '100%', borderRadius: quantumRadius.sm },
  stockGaugeMarker: { position: 'absolute', top: -2, width: 2, height: 14, backgroundColor: quantumColors.neutral200 },
  crmHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  crmScoreBadge: { paddingHorizontal: quantumSpace.sm, paddingVertical: 2, borderRadius: quantumRadius.sm, backgroundColor: quantumColors.neutral800 },
  crmExpanded: { marginTop: quantumSpace.sm, paddingTop: quantumSpace.sm, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: quantumColors.neutral700, gap: 2 },
})
