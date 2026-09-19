/*
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { useCallback, useEffect, useState } from 'react'
import { RefreshControl, StyleSheet, View } from 'react-native'
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
  quantumSpace,
} from '../../../components/QuantumUI'

type ModuleTone = 'good' | 'watch' | 'risk' | 'info'
type ModuleMetric = { label: string; value: string; tone?: ModuleTone }
type ModuleItem = { id: string; title: string; subtitle?: string; meta?: string; tone?: ModuleTone }
type ModuleView = {
  title: string
  description: string
  metrics: ModuleMetric[]
  items: ModuleItem[]
  emptyLabel: string
  ctaLabel: string
  ctaRoute: string
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

async function loadCoreOperationsModule(moduleId: string): Promise<ModuleView> {
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
    }
  }
  if (moduleId === 'marketing') {
    const { campaigns, metrics } = await fetchMarketingWorkspace()
    return {
      title: 'Marketing',
      description: 'Live campaigns and performance across every connected channel.',
      metrics: [
        { label: 'Campaigns', value: String(metrics.campaigns), tone: 'info' },
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
    return {
      title: 'Applicants',
      description: 'Every candidate across every open role, with current stage.',
      metrics: [
        { label: 'Total', value: String(candidates.length), tone: 'info' },
        { label: 'In interview', value: String(candidates.filter((c) => c.stage === 'Interview').length), tone: 'watch' },
      ],
      items: candidates.map((c) => ({
        id: c.id,
        title: c.name,
        subtitle: c.job?.title ?? 'Role unavailable',
        meta: c.stage,
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
          {view.items.length === 0 ? (
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
})
