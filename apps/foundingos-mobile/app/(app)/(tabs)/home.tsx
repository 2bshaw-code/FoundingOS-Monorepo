/*
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
// The "Today" tab. Rebuilt around three questions a founder actually asks each
// morning: what needs me right now, what happened recently, and where do I go
// next — instead of the old per-workspace command deck that duplicated the
// Workspaces tab and buried the actual decision queue.
import { router } from 'expo-router'
import { useCallback, useEffect, useRef, useState } from 'react'
import { Pressable, RefreshControl, StyleSheet, Text, View } from 'react-native'
import Animated, { FadeInDown, FadeOutUp, LinearTransition } from 'react-native-reanimated'
import {
  QuantumButton,
  QuantumCard,
  QuantumEmptyState,
  QuantumMetric,
  QuantumNotice,
  QuantumScreen,
  QuantumSectionHeader,
  QuantumSkeleton,
  QuantumSkeletonList,
  QuantumText,
  quantumColors,
  quantumRadius,
  quantumSpace,
} from '../../../components/QuantumUI'
import { getToken as getLegacyToken } from '../../../lib/api'
import {
  ApprovalsQueueItem,
  ApprovalsQueueStatus,
  approveQueueItem,
  executeQueueItem,
  fetchApprovalsQueue,
  outboxActionType,
  rejectQueueItem,
} from '../../../lib/approvals-queue'
import { PlatformEvent, TenantOnboarding, fetchEventFeed, fetchOnboarding, getSession } from '../../../lib/core-operations-api'
import { DEMO_EVENTS, DEMO_ONBOARDING } from '../../../lib/demo-data'
import { ENTRANCE_DURATION_MS, staggerDelay, useReducedMotionPreference } from '../../../lib/motion'
import { enqueueOutboxAction } from '../../../lib/outbox-sync'
import { useQuantumStore } from '../../../lib/store'
import { useActionFeedback } from '../../../lib/use-action-feedback'

const STATUS_LABEL: Record<ApprovalsQueueStatus, string> = {
  proposed: 'Suggested',
  approved: 'Awaiting execution',
  rejected: 'Rejected',
  executing: 'Executing',
  completed: 'Executed',
  reversed: 'Reversed',
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

const QUICK_ACTIONS: Array<{ label: string; caption: string; accent: string; onPress: () => void }> = [
  { label: 'Approvals', caption: 'Decision queue', accent: '#38BDF8', onPress: () => router.push('/workflows') },
  { label: 'Workspaces', caption: 'All 7 suites', accent: '#A78BFA', onPress: () => router.push('/brands') },
  { label: 'Sales pipeline', caption: 'Deals in motion', accent: '#26E07F', onPress: () => router.push('/crm') },
  { label: 'Search', caption: 'Find anything, fast', accent: '#FBBF24', onPress: () => router.push('/search') },
]

function pluralize(count: number, noun: string): string {
  return `${count} ${noun}${count === 1 ? '' : 's'}`
}

export default function TodayScreen() {
  const activeWorkspaceSlug = useQuantumStore((state) => state.activeBrandSlug)
  const pendingSyncCount = useQuantumStore((state) => state.pendingSyncCount)
  const isOnline = useQuantumStore((state) => state.isOnline)
  const demoMode = useQuantumStore((state) => state.demoMode)
  const reduceMotion = useReducedMotionPreference()

  const [connected, setConnected] = useState(false)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [queue, setQueue] = useState<ApprovalsQueueItem[]>([])
  const [events, setEvents] = useState<PlatformEvent[]>([])
  const [onboarding, setOnboarding] = useState<TenantOnboarding | null>(null)
  const [busyId, setBusyId] = useState<string | null>(null)
  const { feedback, showSuccess, showOffline, showError } = useActionFeedback()
  const inFlight = useRef<Set<string>>(new Set())

  const loadAll = useCallback(async () => {
    // Demo mode: skip both session checks and every network call, and serve
    // the canned dataset so the full Today experience — KPIs, decision
    // queue, activity feed — renders identically to a real signed-in
    // session with zero backend connection.
    if (useQuantumStore.getState().demoMode) {
      const queueResult = await fetchApprovalsQueue()
      setConnected(true)
      setQueue(queueResult.items)
      setEvents(DEMO_EVENTS)
      setOnboarding(DEMO_ONBOARDING)
      setLoading(false)
      return
    }

    const [session, legacyToken] = await Promise.all([getSession(), getLegacyToken()])
    // A legacy tester-login has no Core.Operations session but is still a real
    // sign-in — treat it as connected too, so this screen doesn't disagree
    // with the login flow and loop back.
    setConnected(Boolean(session) || Boolean(legacyToken))

    const [queueResult, eventsResult, onboardingResult] = await Promise.all([
      fetchApprovalsQueue(),
      session ? fetchEventFeed(10).catch(() => []) : Promise.resolve([]),
      session ? fetchOnboarding().catch(() => null) : Promise.resolve(null),
    ])
    setQueue(queueResult.items)
    setEvents(eventsResult)
    setOnboarding(onboardingResult)
    setLoading(false)
  }, [])

  useEffect(() => {
    loadAll()
  }, [loadAll])

  // A stale deep link or in-memory resume after a TestFlight update should send
  // the user to the real login screen, not leave them on a passive banner.
  useEffect(() => {
    if (!loading && !connected) {
      router.replace('/')
    }
  }, [loading, connected])

  const run = async (item: ApprovalsQueueItem, kind: 'APPROVE' | 'REJECT' | 'EXECUTE', call: () => Promise<unknown>) => {
    const key = `${item.id}:${kind}`
    if (inFlight.current.has(key)) return
    inFlight.current.add(key)
    setBusyId(item.id)
    // Optimistic UI: update the queue immediately so approve/reject/execute
    // feels instant. Reconciled with the server in the background; only
    // rolled back on a genuine rejection, not a network hiccup.
    const optimisticStatus: ApprovalsQueueStatus = kind === 'APPROVE' ? 'approved' : kind === 'REJECT' ? 'rejected' : 'completed'
    const previousQueue = queue
    setQueue((current) => current.map((queueItem) => (queueItem.id === item.id ? { ...queueItem, status: optimisticStatus } : queueItem)))
    try {
      await call()
      showSuccess('Done. Recorded in the audit trail.')
      loadAll()
    } catch (err: any) {
      if (err?.status && err.status < 500) {
        setQueue(previousQueue)
        showError(err, () => run(item, kind, call))
      } else {
        await enqueueOutboxAction(outboxActionType(item, kind), activeWorkspaceSlug, { actionId: item.id })
        showOffline()
      }
    } finally {
      setBusyId(null)
      inFlight.current.delete(key)
    }
  }

  const needsAttention = queue.filter((item) => item.status === 'proposed' || item.status === 'approved').slice(0, 4)
  const attentionCount = needsAttention.length + (connected && onboarding && onboarding.goLiveStatus !== 'live' ? 1 : 0)
  const setupIncomplete = connected && onboarding && onboarding.goLiveStatus !== 'live'

  // Real, derived-from-live-data KPIs for the command-center strip — never
  // fabricated. "Executed today" only counts completed items whose
  // createdAt falls in the last 24h, since ApprovalsQueueItem doesn't carry
  // a separate executedAt on the Workforce side.
  const executedToday = queue.filter(
    (item) => item.status === 'completed' && Date.now() - new Date(item.createdAt).getTime() < 24 * 60 * 60 * 1000,
  ).length
  const kpis = [
    { label: 'Needs attention', value: attentionCount, tone: attentionCount > 0 ? ('watch' as const) : ('good' as const) },
    { label: 'Executed today', value: executedToday, tone: 'good' as const },
    { label: 'Recent events', value: events.length, tone: 'info' as const },
  ]

  const quickActions = QUICK_ACTIONS.map((action) => {
    if (action.label === 'Approvals') {
      return { ...action, caption: queue.length > 0 ? `${pluralize(queue.length, 'item')} in queue` : 'Decision queue' }
    }
    return action
  })

  return (
    <QuantumScreen
      contentStyle={styles.screen}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={async () => { setRefreshing(true); await loadAll(); setRefreshing(false) }} tintColor="#38BDF8" />
      }
    >
      <View style={styles.header}>
        <View>
          <Pressable onLongPress={() => router.push('/debug-log')} delayLongPress={2000}>
            <Text style={styles.product}>FOUNDINGOS</Text>
          </Pressable>
          <Text style={styles.title}>Today</Text>
        </View>
        <View style={styles.headerRight}>
          {demoMode ? (
            <View style={styles.demoBadge}>
              <QuantumText variant="caption" color={quantumColors.neutral900} style={styles.demoBadgeText}>DEMO</QuantumText>
            </View>
          ) : null}
          <Pressable style={styles.profile} onPress={() => router.push('/search')}>
            <Text style={styles.profileText}>●</Text>
            {connected ? <View style={styles.online} /> : null}
          </Pressable>
        </View>
      </View>

      <View style={styles.trustStrip}>
        <QuantumText variant="caption" color={quantumColors.neutral300}>
          {demoMode
            ? 'Demo mode is on — everything below is illustrative sample data, not a live tenant.'
            : 'FoundingOS shows you what needs attention today. Nothing here is simulated.'}
        </QuantumText>
      </View>

      {connected && !loading ? (
        <View style={styles.kpiRow}>
          {kpis.map((kpi, i) => (
            <QuantumCard key={kpi.label} style={styles.kpiCard} index={i}>
              <QuantumMetric label={kpi.label} value={kpi.value} tone={kpi.tone} />
            </QuantumCard>
          ))}
        </View>
      ) : null}

      {!isOnline ? <QuantumNotice tone="warning">Working offline — changes will sync later.</QuantumNotice> : null}

      {feedback ? <QuantumNotice tone={feedback.tone} onRetry={feedback.onRetry}>{feedback.message}</QuantumNotice> : null}

      {!connected && !loading ? (
        <View style={styles.stack}>
          <QuantumNotice tone="warning">Sign in to see what needs your attention today.</QuantumNotice>
          <QuantumButton onPress={() => router.replace('/')}>Sign in</QuantumButton>
        </View>
      ) : null}

      {loading ? (
        <>
          <View style={styles.kpiRow}>
            {[0, 1, 2].map((i) => (
              <View key={i} style={styles.kpiCard}>
                <QuantumSkeleton style={styles.kpiSkeleton} />
              </View>
            ))}
          </View>
          <QuantumSectionHeader label="Needs your attention" />
          <QuantumSkeletonList count={2} />
          <QuantumSectionHeader label="Recent activity" />
          <QuantumSkeletonList count={2} />
        </>
      ) : null}

      {connected && !loading ? (
        <>
          <QuantumSectionHeader label={attentionCount > 0 ? `Needs your attention · ${attentionCount}` : 'Needs your attention'} />
          <View style={styles.panel}>
            {setupIncomplete ? (
              <Pressable onPress={() => router.push('/(app)/onboarding')} style={styles.attentionRow}>
                <View style={[styles.attentionDot, { backgroundColor: '#FBBF24' }]} />
                <View style={styles.flex}>
                  <Text style={styles.attentionTitle}>Finish setup to go live</Text>
                  <Text style={styles.attentionCaption}>Complete your business profile and connect WhatsApp. Tap to continue.</Text>
                </View>
              </Pressable>
            ) : null}
            {needsAttention.length === 0 && !setupIncomplete ? (
              <QuantumEmptyState
                glyph="✓"
                title="You're all caught up"
                subtitle="Nothing needs a decision right now. Real actions from Core.Operations and Core.Workforce will show up here the moment something needs your call."
              />
            ) : (
              needsAttention.map((item, i) => {
                const isBusy = busyId === item.id
                return (
                  <Animated.View
                    key={`${item.source}:${item.id}`}
                    style={styles.attentionCard}
                    entering={reduceMotion ? undefined : FadeInDown.delay(staggerDelay(i)).duration(ENTRANCE_DURATION_MS).springify().damping(18)}
                    exiting={reduceMotion ? undefined : FadeOutUp.duration(220)}
                    layout={reduceMotion ? undefined : LinearTransition.springify().damping(20).stiffness(200)}
                  >
                    <View style={styles.rowBetween}>
                      <Text style={styles.attentionTitle}>{item.title}</Text>
                      <Text style={styles.attentionStatus}>{STATUS_LABEL[item.status]}</Text>
                    </View>
                    <Text style={styles.attentionCaption}>{item.summary}</Text>
                    <View style={styles.actionButtonRow}>
                      {item.status === 'proposed' ? (
                        <>
                          <Pressable disabled={isBusy} style={[styles.actionButton, styles.approveButton]} onPress={() => run(item, 'APPROVE', () => approveQueueItem(item))}>
                            <Text style={styles.actionButtonText}>{isBusy ? '…' : 'Approve'}</Text>
                          </Pressable>
                          <Pressable disabled={isBusy} style={[styles.actionButton, styles.rejectButton]} onPress={() => run(item, 'REJECT', () => rejectQueueItem(item))}>
                            <Text style={styles.actionButtonText}>{isBusy ? '…' : 'Reject'}</Text>
                          </Pressable>
                        </>
                      ) : null}
                      {item.status === 'approved' ? (
                        <Pressable disabled={isBusy} style={[styles.actionButton, styles.approveButton]} onPress={() => run(item, 'EXECUTE', () => executeQueueItem(item))}>
                          <Text style={styles.actionButtonText}>{isBusy ? '…' : 'Execute'}</Text>
                        </Pressable>
                      ) : null}
                    </View>
                  </Animated.View>
                )
              })
            )}
            {queue.length > needsAttention.length || needsAttention.length > 0 ? (
              <Pressable onPress={() => router.push('/workflows')}>
                <Text style={styles.seeAllText}>See all in Approvals →</Text>
              </Pressable>
            ) : null}
          </View>

          <QuantumSectionHeader label="Recent activity" />
          <View style={styles.panel}>
            {events.length === 0 ? (
              <QuantumEmptyState
                glyph="◇"
                title="Nothing has happened yet"
                subtitle="Once your team starts working, real activity — not sample data — will show up here."
              />
            ) : (
              events.slice(0, 10).map((event, i) => (
                <Animated.View
                  key={event.id}
                  style={styles.activityRow}
                  entering={reduceMotion ? undefined : FadeInDown.delay(staggerDelay(i)).duration(ENTRANCE_DURATION_MS).springify().damping(18)}
                >
                  <View style={styles.activityDot} />
                  <View style={styles.flex}>
                    <Text style={styles.activityText}>{event.type}</Text>
                    <Text style={styles.activityTime}>{formatRelativeTime(event.createdAt)} · {event.source}</Text>
                  </View>
                </Animated.View>
              ))
            )}
          </View>

          <QuantumSectionHeader label="Quick actions" />
          <View style={styles.quickGrid}>
            {quickActions.map((action, i) => (
              <QuantumCard key={action.label} accent={action.accent} style={styles.quickCard} index={i}>
                <Text style={[styles.quickLabel, { color: action.accent }]}>{action.label}</Text>
                <Text style={styles.quickCaption}>{action.caption}</Text>
                <QuantumButton tone="secondary" onPress={action.onPress}>Open</QuantumButton>
              </QuantumCard>
            ))}
          </View>
        </>
      ) : null}

      {pendingSyncCount ? <Text style={styles.syncText}>{pendingSyncCount} action(s) waiting for secure sync</Text> : null}
    </QuantumScreen>
  )
}

const styles = StyleSheet.create({
  screen: { gap: quantumSpace.lg },
  stack: { gap: quantumSpace.sm },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  demoBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: quantumColors.warning,
  },
  demoBadgeText: { fontWeight: '900', letterSpacing: 0.6 },
  product: { color: '#38BDF8', fontSize: 13, fontWeight: '900', letterSpacing: 1.4 },
  title: { color: '#fff', fontSize: 30, fontWeight: '900', marginTop: 2 },
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
  trustStrip: { paddingHorizontal: 2 },
  kpiRow: { flexDirection: 'row', gap: quantumSpace.sm },
  kpiCard: { flex: 1 },
  kpiSkeleton: { height: 64, borderRadius: quantumRadius.lg, width: '100%' },
  flex: { flex: 1 },
  rowBetween: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: quantumSpace.md },
  panel: {
    borderRadius: quantumRadius.lg,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    backgroundColor: 'rgba(0, 26, 61, 0.78)',
    padding: quantumSpace.lg,
    gap: quantumSpace.md,
  },
  attentionRow: { flexDirection: 'row', gap: quantumSpace.sm, alignItems: 'flex-start' },
  attentionDot: { width: 10, height: 10, borderRadius: 5, marginTop: 5 },
  attentionCard: {
    borderRadius: quantumRadius.md,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    backgroundColor: 'rgba(255,255,255,0.03)',
    padding: quantumSpace.md,
    gap: quantumSpace.sm,
  },
  attentionTitle: { color: '#fff', fontSize: 16, fontWeight: '900' },
  attentionStatus: { color: '#38BDF8', fontSize: 13, fontWeight: '800' },
  attentionCaption: { color: '#D9E4EF', fontSize: 14, lineHeight: 18 },
  actionButtonRow: { flexDirection: 'row', flexWrap: 'wrap', gap: quantumSpace.sm },
  actionButton: {
    minHeight: 32,
    borderRadius: 999,
    paddingHorizontal: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  approveButton: { backgroundColor: '#26E07F', borderColor: '#26E07F' },
  rejectButton: { backgroundColor: '#FF5470', borderColor: '#FF5470' },
  actionButtonText: { color: '#05060A', fontSize: 13, fontWeight: '900' },
  seeAllText: { color: '#38BDF8', fontSize: 14, fontWeight: '800', textAlign: 'center' },
  activityRow: { flexDirection: 'row', gap: quantumSpace.sm, alignItems: 'flex-start' },
  activityDot: { width: 8, height: 8, borderRadius: 4, marginTop: 5, backgroundColor: '#38BDF8' },
  activityText: { color: '#fff', fontSize: 15, fontWeight: '700' },
  activityTime: { color: '#8AA0B5', fontSize: 13 },
  quickGrid: { gap: quantumSpace.md },
  quickCard: { gap: quantumSpace.xs },
  quickLabel: { fontSize: 17, fontWeight: '900' },
  quickCaption: { color: '#9FB3C8', fontSize: 14 },
  syncText: { color: '#BEE9FF', fontSize: 14, textAlign: 'center', fontWeight: '700' },
})
