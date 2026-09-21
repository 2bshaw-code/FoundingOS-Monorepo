/*
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { router } from 'expo-router'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { ActivityIndicator, Pressable, RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native'
import { QuantumMiniBars } from '../../components/QuantumMiniCharts'
import { QuantumButton, QuantumCard, QuantumNotice, QuantumScreen, QuantumText, quantumColors, quantumSpace } from '../../components/QuantumUI'
import { BRANDS, FOUNDINGOS_ACCENT } from '../../lib/brands'
import {
  AgentAction,
  AgentActionIntelligence,
  AgentActionTrailEvent,
  BusinessPulse,
  OwnerOperationsData,
  PlatformEvent,
  TenantOnboarding,
  decideAgentAction,
  executeAgentAction,
  fetchAgentActionIntelligence,
  fetchBusinessPulse,
  fetchEventFeed,
  fetchOnboarding,
  fetchOwnerOperations,
  getAgentActionTrail,
  getSession,
  listAgentActions,
  reverseAgentActionExecution,
} from '../../lib/core-operations-api'
import { enqueueOutboxAction } from '../../lib/outbox-sync'
import { useQuantumStore } from '../../lib/store'

const WORKSPACES = BRANDS.filter((workspace) => workspace.slug !== 'foundingos')

const STATUS_LABEL: Record<AgentAction['status'], string> = {
  proposed: 'Suggested',
  approved: 'Awaiting execution',
  rejected: 'Rejected',
  executing: 'Executing',
  completed: 'Executed',
}

const STATUS_COLOR: Record<AgentAction['status'], string> = {
  proposed: '#38BDF8',
  approved: '#FBBF24',
  rejected: '#FF5470',
  executing: '#A78BFA',
  completed: quantumColors.success,
}

function formatPence(pence: number | null | undefined): string {
  if (!pence) return '£0'
  return `£${(pence / 100).toLocaleString('en-GB', { maximumFractionDigits: 0 })}`
}

function formatRelativeTime(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime()
  const minutes = Math.round(diffMs / 60000)
  if (minutes < 1) return 'just now'
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.round(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  return `${Math.round(hours / 24)}d ago`
}

function isOpenOrder(status: string | null | undefined) {
  const normalized = String(status || '').toLowerCase()
  return normalized && !['completed', 'delivered', 'cancelled', 'closed', 'fulfilled'].includes(normalized)
}

function isUnpaidInvoice(status: string | null | undefined) {
  return !['paid', 'cancelled'].includes(String(status || '').toLowerCase())
}

function buildDailySeries<T>(
  items: T[],
  readDate: (item: T) => string | null | undefined,
  readValue: (item: T) => number,
  days = 7
) {
  const buckets = Array.from({ length: days }, (_, index) => {
    const date = new Date()
    date.setHours(0, 0, 0, 0)
    date.setDate(date.getDate() - (days - 1 - index))
    return { key: date.toISOString().slice(0, 10), value: 0 }
  })
  const bucketMap = new Map(buckets.map((bucket) => [bucket.key, bucket]))
  let hasPoint = false
  for (const item of items) {
    const rawDate = readDate(item)
    if (!rawDate) continue
    const parsed = new Date(rawDate)
    if (Number.isNaN(parsed.getTime())) continue
    const key = parsed.toISOString().slice(0, 10)
    const bucket = bucketMap.get(key)
    if (!bucket) continue
    bucket.value += readValue(item)
    hasPoint = true
  }
  return hasPoint ? buckets.map((bucket) => bucket.value) : []
}

function buildInventoryAlertSeries(operations: OwnerOperationsData | null) {
  if (!operations) return []
  const lowStockItems = operations.inventory
    .filter((item) => item.stock <= item.lowStockLevel)
    .sort((left, right) => new Date(right.updatedAt).getTime() - new Date(left.updatedAt).getTime())
    .slice(0, 7)
  return lowStockItems.map((item) => Math.max(1, item.lowStockLevel - item.stock + 1))
}

export default function FounderCommandDeck() {
  const role = useQuantumStore((state) => state.role)
  const activeWorkspaceSlug = useQuantumStore((state) => state.activeBrandSlug)
  const setActiveWorkspace = useQuantumStore((state) => state.setActiveBrand)
  const setCommandBarOpen = useQuantumStore((state) => state.setCommandBarOpen)
  const pendingSyncCount = useQuantumStore((state) => state.pendingSyncCount)

  const [connected, setConnected] = useState(false)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [pulse, setPulse] = useState<BusinessPulse | null>(null)
  const [operations, setOperations] = useState<OwnerOperationsData | null>(null)
  const [actions, setActions] = useState<AgentAction[]>([])
  const [events, setEvents] = useState<PlatformEvent[]>([])
  const [intelligence, setIntelligence] = useState<AgentActionIntelligence | null>(null)
  const [notice, setNotice] = useState('')
  const [busyActionId, setBusyActionId] = useState<string | null>(null)
  const [expandedActionId, setExpandedActionId] = useState<string | null>(null)
  const [trail, setTrail] = useState<AgentActionTrailEvent[]>([])
  const [trailLoading, setTrailLoading] = useState(false)
  const [onboarding, setOnboarding] = useState<TenantOnboarding | null>(null)

  const loadAll = useCallback(async () => {
    const session = await getSession()
    setConnected(Boolean(session))
    if (!session) {
      setLoading(false)
      return
    }
    const [actionsResult, pulseResult, operationsResult, eventsResult, intelligenceResult, onboardingResult] = await Promise.all([
      listAgentActions().catch(() => []),
      fetchBusinessPulse().catch(() => null),
      fetchOwnerOperations().catch(() => null),
      fetchEventFeed(15).catch(() => []),
      fetchAgentActionIntelligence().catch(() => null),
      fetchOnboarding().catch(() => null),
    ])
    setActions(actionsResult)
    setPulse(pulseResult)
    setOperations(operationsResult)
    setEvents(eventsResult)
    setIntelligence(intelligenceResult)
    setOnboarding(onboardingResult)
    setLoading(false)
  }, [])

  useEffect(() => {
    loadAll()
  }, [loadAll])

  // If this screen is ever reached without a valid session — a stale deep link, an
  // in-memory app resume after a TestFlight update, or any other edge case — send the
  // user straight to the real login screen instead of leaving them stuck on a passive
  // "not connected" banner that looks like the update didn't take effect.
  useEffect(() => {
    if (!loading && !connected) {
      router.replace('/')
    }
  }, [loading, connected])

  const showNotice = (text: string) => {
    setNotice(text)
    setTimeout(() => setNotice(''), 3500)
  }

  const withOfflineFallback = async (
    actionId: string,
    outboxType: string,
    payload: Record<string, unknown>,
    run: () => Promise<AgentAction>
  ) => {
    setBusyActionId(actionId)
    try {
      await run()
      await loadAll()
      showNotice('Done. Full evidence recorded in the audit trail.')
    } catch (err: any) {
      if (err?.status && err.status < 500 && err.status !== 0) {
        showNotice(err.message || 'That action could not be completed.')
      } else {
        await enqueueOutboxAction(outboxType, activeWorkspaceSlug, payload)
        showNotice('Offline — queued for secure sync and will apply automatically once reconnected.')
      }
    } finally {
      setBusyActionId(null)
    }
  }

  const handleDecision = (action: AgentAction, decision: 'approve' | 'reject') =>
    withOfflineFallback(action.id, `GOVERNED_ACTION_DECISION_${decision.toUpperCase()}`, { actionId: action.id, decision }, () =>
      decideAgentAction(action.id, decision)
    )

  const handleExecute = (action: AgentAction) =>
    withOfflineFallback(action.id, 'GOVERNED_ACTION_EXECUTE', { actionId: action.id }, () => executeAgentAction(action.id))

  const handleReverse = (action: AgentAction) =>
    withOfflineFallback(action.id, 'GOVERNED_ACTION_REVERSE', { actionId: action.id }, () => reverseAgentActionExecution(action.id))

  const handleViewEvidence = async (action: AgentAction) => {
    if (expandedActionId === action.id) {
      setExpandedActionId(null)
      return
    }
    setExpandedActionId(action.id)
    setTrail([])
    setTrailLoading(true)
    try {
      setTrail(await getAgentActionTrail(action.id))
    } catch {
      setTrail([])
    } finally {
      setTrailLoading(false)
    }
  }

  const activeWorkspace = BRANDS.find((workspace) => workspace.slug === activeWorkspaceSlug) ?? BRANDS[0]
  const pulseZero = pulse && !pulse.orderRevenuePence && !pulse.openOrders && !pulse.unpaidInvoices && !pulse.lowStock
  const actionableActions = actions.filter((action) => ['proposed', 'approved', 'completed'].includes(action.status)).slice(0, 4)

  const revenueSeries = useMemo(
    () => buildDailySeries(operations?.orders ?? [], (order) => order.createdAt, (order) => order.totalPence),
    [operations]
  )
  const openOrdersSeries = useMemo(
    () => buildDailySeries(operations?.orders.filter((order) => isOpenOrder(order.status)) ?? [], (order) => order.createdAt, () => 1),
    [operations]
  )
  const overdueInvoicesSeries = useMemo(
    () => buildDailySeries(
      operations?.invoices.filter((invoice) => isUnpaidInvoice(invoice.status)) ?? [],
      (invoice) => invoice.dueAt ?? invoice.createdAt,
      () => 1
    ),
    [operations]
  )
  const inventoryAlertSeries = useMemo(() => buildInventoryAlertSeries(operations), [operations])

  const focusedEvents = useMemo(() => {
    if (activeWorkspaceSlug === 'core_intelligence') {
      return events.filter((event) => event.type.includes('agent') || event.source.includes('agent') || event.source.includes('messaging')).slice(0, 8)
    }
    return events.slice(0, 8)
  }, [activeWorkspaceSlug, events])

  const renderKpiGrid = () => (
    <View style={styles.kpiGrid}>
      <QuantumCard accent="#22C55E" style={styles.kpiPanel}>
        <Text style={styles.kpiLabel}>Revenue (orders)</Text>
        <Text style={styles.kpiValue}>{formatPence(pulse?.orderRevenuePence)}</Text>
        <QuantumMiniBars
          values={revenueSeries}
          accent="#22C55E"
          emptyLabel="Trend data will appear after order activity is recorded."
          footerLabel={revenueSeries.length ? 'Last 7 days of real order value' : undefined}
        />
      </QuantumCard>
      <QuantumCard accent="#38BDF8" style={styles.kpiPanel}>
        <Text style={styles.kpiLabel}>Open orders</Text>
        <Text style={styles.kpiValue}>{pulse?.openOrders ?? 0}</Text>
        <QuantumMiniBars
          values={openOrdersSeries}
          accent="#38BDF8"
          emptyLabel="Trend data will appear after orders enter the live queue."
          footerLabel={openOrdersSeries.length ? 'Last 7 days of open-order intake' : undefined}
        />
      </QuantumCard>
      <QuantumCard accent="#FB7185" style={styles.kpiPanel}>
        <Text style={styles.kpiLabel}>Overdue payments</Text>
        <Text style={styles.kpiValue}>{pulse?.unpaidInvoices ?? 0}</Text>
        <Text style={styles.kpiSub}>{formatPence(pulse?.outstandingPence)} outstanding</Text>
        <QuantumMiniBars
          values={overdueInvoicesSeries}
          accent="#FB7185"
          emptyLabel="Trend data will appear after invoices age into real payment windows."
          footerLabel={overdueInvoicesSeries.length ? 'Last 7 days of unpaid invoice dates' : undefined}
        />
      </QuantumCard>
      <QuantumCard accent="#FBBF24" style={styles.kpiPanel}>
        <Text style={styles.kpiLabel}>Inventory alerts</Text>
        <Text style={styles.kpiValue}>{pulse?.lowStock ?? 0}</Text>
        <Text style={styles.kpiSub}>of {pulse?.inventoryItems ?? 0} items tracked</Text>
        <QuantumMiniBars
          values={inventoryAlertSeries}
          accent="#FBBF24"
          emptyLabel="Bar data will appear when live inventory drops below threshold."
          footerLabel={inventoryAlertSeries.length ? 'Current stock-gap severity across flagged items' : undefined}
        />
      </QuantumCard>
    </View>
  )

  const renderActionsQueue = () => (
    <View style={styles.panel}>
      {actionableActions.length === 0 ? (
        <Text style={styles.emptyText}>
          No governed actions right now. FoundingOS will queue replenishment, receivables, delivery, expense,
          campaign, and budget decisions here as real activity creates them.
        </Text>
      ) : (
        actionableActions.map((action) => {
          const isBusy = busyActionId === action.id
          const expanded = expandedActionId === action.id
          return (
            <View key={action.id} style={styles.actionCard}>
              <View style={styles.actionHeaderRow}>
                <View style={[styles.statusPill, { backgroundColor: `${STATUS_COLOR[action.status]}22`, borderColor: STATUS_COLOR[action.status] }]}>
                  <Text style={[styles.statusPillText, { color: STATUS_COLOR[action.status] }]}>{STATUS_LABEL[action.status]}</Text>
                </View>
                {action.requiresApproval ? <Text style={styles.approvalBadge}>Requires approval</Text> : null}
              </View>
              <Text style={styles.actionTitle}>{action.title || action.kind}</Text>
              <Text style={styles.actionSummary}>{action.summary}</Text>
              {action.estimatedValuePence ? <Text style={styles.actionValue}>Estimated impact: {formatPence(action.estimatedValuePence)}</Text> : null}

              <View style={styles.actionButtonRow}>
                {action.status === 'proposed' ? (
                  <>
                    <Pressable disabled={isBusy} style={[styles.actionButton, styles.approveButton]} onPress={() => handleDecision(action, 'approve')}>
                      <Text style={styles.actionButtonText}>{isBusy ? '…' : 'Approve'}</Text>
                    </Pressable>
                    <Pressable disabled={isBusy} style={[styles.actionButton, styles.rejectButton]} onPress={() => handleDecision(action, 'reject')}>
                      <Text style={styles.actionButtonText}>{isBusy ? '…' : 'Reject'}</Text>
                    </Pressable>
                  </>
                ) : null}
                {action.status === 'approved' ? (
                  <Pressable disabled={isBusy} style={[styles.actionButton, styles.approveButton]} onPress={() => handleExecute(action)}>
                    <Text style={styles.actionButtonText}>{isBusy ? '…' : 'Execute'}</Text>
                  </Pressable>
                ) : null}
                {action.status === 'completed' && action.execution?.status === 'completed' ? (
                  <Pressable disabled={isBusy} style={[styles.actionButton, styles.rejectButton]} onPress={() => handleReverse(action)}>
                    <Text style={styles.actionButtonText}>{isBusy ? '…' : 'Undo'}</Text>
                  </Pressable>
                ) : null}
                {action.execution?.status === 'reversed' ? <Text style={styles.reversedText}>Reversed</Text> : null}
                <Pressable style={[styles.actionButton, styles.evidenceButton]} onPress={() => handleViewEvidence(action)}>
                  <Text style={styles.evidenceButtonText}>{expanded ? 'Hide evidence' : 'View evidence'}</Text>
                </Pressable>
              </View>

              {expanded ? (
                <View style={styles.trailBox}>
                  {trailLoading ? (
                    <ActivityIndicator color="#38BDF8" />
                  ) : trail.length === 0 ? (
                    <Text style={styles.emptyText}>No audit events recorded yet.</Text>
                  ) : (
                    trail.map((event) => (
                      <View key={event.id} style={styles.trailRow}>
                        <Text style={styles.trailType}>{event.type}</Text>
                        <Text style={styles.trailTime}>{formatRelativeTime(event.createdAt)}</Text>
                      </View>
                    ))
                  )}
                </View>
              ) : null}
            </View>
          )
        })
      )}
    </View>
  )

  const renderWorkspaceFocus = () => {
    if (activeWorkspaceSlug === 'core_workforce') {
      return (
        <QuantumCard accent={activeWorkspace.accent}>
          <QuantumText variant="overline" color={activeWorkspace.accent}>Core.Workforce</QuantumText>
          <QuantumText variant="h2">Present in the shell, not yet connected</QuantumText>
          <QuantumText>
            Core.Workforce is visible in navigation now, but it is not connected to a real backend yet. No workforce records are fabricated here.
          </QuantumText>
          <QuantumNotice tone="warning">No jobs, candidates, or staffing metrics are shown until a real backend is live.</QuantumNotice>
        </QuantumCard>
      )
    }

    if (activeWorkspaceSlug === 'core_intelligence') {
      return (
        <View style={styles.stack}>
          <QuantumCard accent={activeWorkspace.accent}>
            <QuantumText variant="overline" color={activeWorkspace.accent}>Core.Intelligence live</QuantumText>
            <QuantumText variant="h2">Governed learning snapshot</QuantumText>
            <QuantumText>{intelligence?.snapshot.learningMomentum.narrative ?? 'Live intelligence appears here once you sign in.'}</QuantumText>
            {intelligence ? (
              <View style={styles.intelligenceRow}>
                <View style={styles.intelligenceMetric}>
                  <Text style={styles.metricLabel}>Accuracy</Text>
                  <Text style={styles.metricValue}>{intelligence.snapshot.recentAccuracyTrend.current}%</Text>
                </View>
                <View style={styles.intelligenceMetric}>
                  <Text style={styles.metricLabel}>Momentum</Text>
                  <Text style={styles.metricValue}>{intelligence.snapshot.learningMomentum.score}</Text>
                </View>
                <View style={styles.intelligenceMetric}>
                  <Text style={styles.metricLabel}>Signals</Text>
                  <Text style={styles.metricValue}>{intelligence.emergingSignals.length}</Text>
                </View>
              </View>
            ) : null}
            <QuantumButton onPress={() => router.push('/intelligence')}>Open Intelligence</QuantumButton>
          </QuantumCard>
          {intelligence?.emergingSignals.length ? (
            <QuantumCard accent={activeWorkspace.accent}>
              <QuantumText variant="h3">Latest advisory</QuantumText>
              <QuantumText>{intelligence.emergingSignals[0].summary}</QuantumText>
              <QuantumText variant="caption" color="#d9e4ef">{intelligence.emergingSignals[0].advisory}</QuantumText>
            </QuantumCard>
          ) : (
            <QuantumNotice tone="info">{intelligence?.snapshot.recentAccuracyTrend.narrative ?? 'No intelligence snapshot is available yet.'}</QuantumNotice>
          )}
        </View>
      )
    }

    if (activeWorkspaceSlug === 'core_operations') {
      return (
        <View style={styles.stack}>
          {renderKpiGrid()}
          <QuantumCard accent={activeWorkspace.accent}>
            <QuantumText variant="overline" color={activeWorkspace.accent}>Department launchers</QuantumText>
            <QuantumText variant="h3">Operations keeps the live system moving</QuantumText>
            <View style={styles.launcherRow}>
              <QuantumButton onPress={() => router.push('/workflows')}>Open approvals</QuantumButton>
              <QuantumButton tone="secondary" onPress={() => router.push('/marketing')}>Open marketing</QuantumButton>
              <QuantumButton tone="secondary" onPress={() => router.push('/crm')}>Open sales pipeline</QuantumButton>
            </View>
          </QuantumCard>
        </View>
      )
    }

    return (
      <View style={styles.stack}>
        {renderKpiGrid()}
        <View style={styles.launcherGrid}>
          <QuantumCard accent="#26E07F" style={styles.launcherCard}>
            <View style={styles.launcherHeaderRow}>
              <View style={[styles.workspaceIconBadge, styles.launcherIconBadge, { backgroundColor: '#26E07F22', borderColor: '#26E07F55' }]}>
                <Text style={[styles.workspaceIconGlyph, { color: '#26E07F', fontSize: 17 }]}>⚙</Text>
              </View>
              <QuantumText variant="h3">Core.Operations</QuantumText>
            </View>
            <QuantumText variant="caption">Live orders, inventory, approvals, and campaign controls.</QuantumText>
            <QuantumButton onPress={() => router.push('/workflows')}>Open work</QuantumButton>
          </QuantumCard>
          <QuantumCard accent="#38BDF8" style={styles.launcherCard}>
            <View style={styles.launcherHeaderRow}>
              <View style={[styles.workspaceIconBadge, styles.launcherIconBadge, { backgroundColor: '#38BDF822', borderColor: '#38BDF855' }]}>
                <Text style={[styles.workspaceIconGlyph, { color: '#38BDF8', fontSize: 17 }]}>◎</Text>
              </View>
              <QuantumText variant="h3">Sales pipeline</QuantumText>
            </View>
            <QuantumText variant="caption">Track deals from lead to won with a real kanban-style pipeline.</QuantumText>
            <QuantumButton onPress={() => router.push('/crm')}>Open pipeline</QuantumButton>
          </QuantumCard>
          <QuantumCard accent="#A78BFA" style={styles.launcherCard}>
            <View style={styles.launcherHeaderRow}>
              <View style={[styles.workspaceIconBadge, styles.launcherIconBadge, { backgroundColor: '#A78BFA22', borderColor: '#A78BFA55' }]}>
                <Text style={[styles.workspaceIconGlyph, { color: '#A78BFA', fontSize: 17 }]}>✦</Text>
              </View>
              <QuantumText variant="h3">Core.Intelligence</QuantumText>
            </View>
            <QuantumText variant="caption">Accuracy trends, learning momentum, emerging signals, and audit history.</QuantumText>
            <QuantumButton tone="secondary" onPress={() => router.push('/intelligence')}>Open intelligence</QuantumButton>
          </QuantumCard>
        </View>
      </View>
    )
  }

  return (
    <QuantumScreen
      contentStyle={styles.screen}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={async () => {
            setRefreshing(true)
            await loadAll()
            setRefreshing(false)
          }}
          tintColor="#38BDF8"
        />
      }
    >
      <View style={styles.commandHeader}>
        <View>
          <Text style={styles.product}>FOUNDINGOS</Text>
          <Text style={styles.title}>Founder Command Deck</Text>
          <Text style={styles.subtitle}>
            {role} view · {connected ? 'Core.Operations live' : 'Not connected'}
          </Text>
        </View>
        <Pressable style={styles.profile} onPress={() => setCommandBarOpen(true)}>
          <Text style={styles.profileText}>●</Text>
          {connected ? <View style={styles.online} /> : null}
        </Pressable>
      </View>

      {connected && onboarding && onboarding.goLiveStatus !== 'live' ? (
        <Pressable onPress={() => router.push('/(app)/onboarding')}>
          <QuantumNotice tone="info">
            Setup isn't finished yet — complete your business profile and connect WhatsApp to go live. Tap to continue.
          </QuantumNotice>
        </Pressable>
      ) : null}

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.workspaceRail}>
        <Pressable
          style={[styles.workspaceTab, activeWorkspaceSlug === 'foundingos' && styles.workspaceTabActive]}
          onPress={() => setActiveWorkspace('foundingos')}
        >
          <View style={[styles.workspaceIconBadge, { backgroundColor: `${FOUNDINGOS_ACCENT}22`, borderColor: `${FOUNDINGOS_ACCENT}55` }]}>
            <Text style={[styles.workspaceIconGlyph, { color: FOUNDINGOS_ACCENT }]}>⌂</Text>
          </View>
          <Text style={styles.workspaceTabLabel}>Overview</Text>
        </Pressable>
        {WORKSPACES.map((workspace) => (
          <Pressable
            key={workspace.slug}
            style={[
              styles.workspaceTab,
              activeWorkspaceSlug === workspace.slug && { borderColor: workspace.accent, backgroundColor: `${workspace.accent}18` },
            ]}
            onPress={() => setActiveWorkspace(workspace.slug)}
          >
            <View style={[styles.workspaceIconBadge, { backgroundColor: `${workspace.accent}22`, borderColor: `${workspace.accent}55` }]}>
              <Text style={[styles.workspaceIconGlyph, { color: workspace.accent }]}>{workspace.icon}</Text>
            </View>
            <Text style={styles.workspaceTabLabel}>{workspace.homeLabel}</Text>
          </Pressable>
        ))}
      </ScrollView>

      {notice ? <View style={styles.notice}><Text style={styles.noticeText}>{notice}</Text></View> : null}

      {!connected && !loading ? (
        <View style={styles.signInPrompt}>
          <QuantumNotice tone="warning">
            Sign in with your Core.Operations account to see live business data, Core.Intelligence signals, and the governed AI Actions Queue.
          </QuantumNotice>
          <QuantumButton onPress={() => router.replace('/')}>Sign in</QuantumButton>
        </View>
      ) : null}

      {loading ? (
        <View style={styles.loadingRow}>
          <ActivityIndicator color="#38BDF8" />
          <Text style={styles.loadingText}>Loading live business data…</Text>
        </View>
      ) : null}

      {connected && !loading ? (
        <>
          <View style={styles.sectionHeading}>
            <View>
              <Text style={styles.sectionTitle}>{activeWorkspace.name}</Text>
              <Text style={styles.sectionCaption}>{activeWorkspace.tagline}</Text>
            </View>
            <Text style={styles.live}>● LIVE</Text>
          </View>

          {renderWorkspaceFocus()}

          {pulseZero ? (
            <QuantumNotice tone="info">
              No transactions recorded yet for this tenant. Real numbers will appear here as soon as orders, invoices,
              inventory, or governed actions are recorded.
            </QuantumNotice>
          ) : null}

          {activeWorkspaceSlug !== 'core_workforce' ? (
            <>
              <View style={styles.sectionHeading}>
                <View>
                  <Text style={styles.sectionTitle}>Governed AI Actions Queue</Text>
                  <Text style={styles.sectionCaption}>Suggestion → simulation → approval → execution → outcome</Text>
                </View>
              </View>
              {renderActionsQueue()}
            </>
          ) : null}

          <View style={styles.sectionHeading}>
            <View>
              <Text style={styles.sectionTitle}>Shared Event Feed</Text>
              <Text style={styles.sectionCaption}>Real cross-suite activity</Text>
            </View>
          </View>
          <View style={styles.panel}>
            {focusedEvents.length === 0 ? (
              <Text style={styles.emptyText}>No cross-suite events yet.</Text>
            ) : (
              focusedEvents.map((event) => (
                <View key={event.id} style={styles.activityRow}>
                  <View style={[styles.activityDot, { backgroundColor: activeWorkspace.accent }]} />
                  <View style={styles.activityCopy}>
                    <Text style={styles.activityText}>{event.type}</Text>
                    <Text style={styles.activityTime}>
                      {formatRelativeTime(event.createdAt)} · {event.source}
                    </Text>
                  </View>
                </View>
              ))
            )}
          </View>
        </>
      ) : null}

      {pendingSyncCount ? <Text style={styles.syncText}>{pendingSyncCount} action(s) waiting for secure sync</Text> : null}
    </QuantumScreen>
  )
}

const styles = StyleSheet.create({
  screen: { gap: quantumSpace.lg },
  stack: { gap: quantumSpace.md },
  commandHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  product: { color: '#38BDF8', fontSize: 13, fontWeight: '900', letterSpacing: 1.4 },
  title: { color: '#fff', fontSize: 30, fontWeight: '900', marginTop: 2 },
  subtitle: { color: '#D9E4EF', fontSize: 15, marginTop: 6 },
  profile: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.14)',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.04)',
  },
  profileText: { color: '#38BDF8', fontSize: 18, fontWeight: '900' },
  online: {
    position: 'absolute',
    right: 9,
    top: 9,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: quantumColors.success,
  },
  workspaceRail: { gap: quantumSpace.sm, paddingRight: quantumSpace.lg },
  workspaceTab: {
    minHeight: 40,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: quantumSpace.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: quantumSpace.sm,
    backgroundColor: 'rgba(255,255,255,0.03)',
  },
  workspaceTabActive: {
    borderColor: '#38BDF8',
    backgroundColor: 'rgba(56, 189, 248, 0.14)',
  },
  workspaceDot: { width: 8, height: 8, borderRadius: 4 },
  workspaceIconBadge: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  workspaceIconGlyph: { fontSize: 14, fontWeight: '900' },
  launcherHeaderRow: { flexDirection: 'row', alignItems: 'center', gap: quantumSpace.sm },
  launcherIconBadge: { width: 32, height: 32, borderRadius: 16 },
  workspaceTabLabel: { color: '#fff', fontSize: 14, fontWeight: '800' },
  notice: {
    borderRadius: 12,
    backgroundColor: 'rgba(56, 189, 248, 0.12)',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.35)',
  },
  noticeText: { color: '#BEE9FF', fontSize: 14, fontWeight: '700', textAlign: 'center' },
  signInPrompt: { gap: quantumSpace.sm },
  loadingRow: { alignItems: 'center', justifyContent: 'center', gap: quantumSpace.sm, paddingVertical: 28 },
  loadingText: { color: '#D9E4EF', fontSize: 15 },
  sectionHeading: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: quantumSpace.md },
  sectionTitle: { color: '#fff', fontSize: 21, fontWeight: '900' },
  sectionCaption: { color: '#9FB3C8', fontSize: 14, marginTop: 4 },
  live: { color: '#38BDF8', fontSize: 13, fontWeight: '900', letterSpacing: 1 },
  kpiGrid: { gap: quantumSpace.md },
  kpiPanel: { gap: quantumSpace.sm },
  kpiLabel: { color: '#B6D7EA', fontSize: 14, fontWeight: '700' },
  kpiValue: { color: '#fff', fontSize: 28, fontWeight: '900' },
  kpiSub: { color: '#9FB3C8', fontSize: 14 },
  intelligenceRow: { flexDirection: 'row', gap: quantumSpace.sm, flexWrap: 'wrap' },
  intelligenceMetric: {
    flex: 1,
    minWidth: 88,
    padding: quantumSpace.sm,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  metricLabel: { color: '#9FB3C8', fontSize: 13, fontWeight: '700' },
  metricValue: { color: '#fff', fontSize: 22, fontWeight: '900', marginTop: 4 },
  launcherGrid: { gap: quantumSpace.md },
  launcherCard: { gap: quantumSpace.sm },
  launcherRow: { flexDirection: 'row', flexWrap: 'wrap', gap: quantumSpace.sm },
  panel: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    backgroundColor: 'rgba(0, 26, 61, 0.78)',
    padding: quantumSpace.lg,
    gap: quantumSpace.md,
  },
  emptyText: { color: '#B8C8D8', fontSize: 15, lineHeight: 19 },
  actionCard: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    backgroundColor: 'rgba(255,255,255,0.03)',
    padding: quantumSpace.md,
    gap: quantumSpace.sm,
  },
  actionHeaderRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: quantumSpace.sm },
  statusPill: { borderWidth: 1, borderRadius: 999, paddingHorizontal: 10, paddingVertical: 5 },
  statusPillText: { fontSize: 13, fontWeight: '900' },
  approvalBadge: { color: '#DDEFFF', fontSize: 13, fontWeight: '800' },
  actionTitle: { color: '#fff', fontSize: 18, fontWeight: '900' },
  actionSummary: { color: '#D9E4EF', fontSize: 15, lineHeight: 19 },
  actionValue: { color: '#9DE6BA', fontSize: 14, fontWeight: '800' },
  actionButtonRow: { flexDirection: 'row', flexWrap: 'wrap', gap: quantumSpace.sm, alignItems: 'center' },
  actionButton: {
    minHeight: 34,
    borderRadius: 999,
    paddingHorizontal: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  approveButton: { backgroundColor: '#26E07F', borderColor: '#26E07F' },
  rejectButton: { backgroundColor: '#FF5470', borderColor: '#FF5470' },
  evidenceButton: { borderColor: '#38BDF8', backgroundColor: 'transparent' },
  actionButtonText: { color: '#05060A', fontSize: 14, fontWeight: '900' },
  evidenceButtonText: { color: '#38BDF8', fontSize: 14, fontWeight: '900' },
  reversedText: { color: '#FCA5A5', fontSize: 14, fontWeight: '800' },
  trailBox: {
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.07)',
    padding: quantumSpace.md,
    gap: quantumSpace.sm,
  },
  trailRow: { flexDirection: 'row', justifyContent: 'space-between', gap: quantumSpace.md },
  trailType: { color: '#DDEFFF', fontSize: 14, fontWeight: '700', flex: 1 },
  trailTime: { color: '#8AA0B5', fontSize: 13, fontWeight: '700' },
  activityRow: { flexDirection: 'row', gap: quantumSpace.sm, alignItems: 'flex-start' },
  activityDot: { width: 10, height: 10, borderRadius: 5, marginTop: 4 },
  activityCopy: { flex: 1, gap: 2 },
  activityText: { color: '#fff', fontSize: 15, fontWeight: '700' },
  activityTime: { color: '#8AA0B5', fontSize: 13 },
  syncText: { color: '#BEE9FF', fontSize: 14, textAlign: 'center', fontWeight: '700' },
})
