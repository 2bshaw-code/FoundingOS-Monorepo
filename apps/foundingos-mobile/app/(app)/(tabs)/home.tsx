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
import {
  QuantumButton,
  QuantumCard,
  QuantumNotice,
  QuantumScreen,
  QuantumSectionHeader,
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
import { enqueueOutboxAction } from '../../../lib/outbox-sync'
import { useQuantumStore } from '../../../lib/store'
import { useActionFeedback } from '../../../lib/use-action-feedback'
import { AskFoundAiCard, FoundAiAutopilotCard, FoundAiWhatsAppCard } from '../../../components/FoundAi'
import { WorkspaceQuickAccess } from '../../../components/WorkspaceAccess'
import { signOut, useIsFounder } from '../../../lib/workspace-access'

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
  const isFounder = useIsFounder()

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
        <View style={styles.headerActions}>
          <Pressable style={styles.planButton} onPress={() => router.push('/(app)/upgrade' as never)}>
            <Text style={styles.planText}>Plan</Text>
          </Pressable>
          <Pressable style={styles.signOutButton} onPress={() => { void signOut() }}>
            <Text style={styles.signOutText}>Sign out</Text>
          </Pressable>
        </View>
      </View>

      <View style={styles.trustStrip}>
        <QuantumText variant="caption" color={quantumColors.neutral300}>
          FoundAI runs the routine work and brings you only what needs a human. Nothing here is simulated.
        </QuantumText>
      </View>

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
          <QuantumSectionHeader label="Needs your attention" />
          <View style={styles.panel}>
            <View style={styles.skeletonRow} />
            <View style={[styles.skeletonRow, styles.skeletonRowShort]} />
          </View>
          <QuantumSectionHeader label="Recent activity" />
          <View style={styles.panel}>
            <View style={styles.skeletonRow} />
          </View>
        </>
      ) : null}

      {connected && !loading ? (
        <>
          {isFounder ? (
            <Pressable onPress={() => router.push('/(app)/superdash' as never)} style={styles.superdash}>
              <Text style={styles.superdashEyebrow}>FOUNDER</Text>
              <Text style={styles.superdashTitle}>SuperDash →</Text>
              <Text style={styles.superdashCopy}>Subscriptions, revenue, upgrade requests and platform health</Text>
            </Pressable>
          ) : null}
          <QuantumSectionHeader label="Your workspaces" />
          <WorkspaceQuickAccess />
          <FoundAiWhatsAppCard onConnect={() => router.push('/(app)/onboarding')} />
          <FoundAiAutopilotCard compact onChanged={loadAll} />
          <AskFoundAiCard />
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
              <View style={styles.allCaughtUp}>
                <Text style={styles.allCaughtUpTitle}>You're all caught up.</Text>
                <Text style={styles.emptyText}>
                  Nothing needs a decision right now. Real actions from Core.Operations and Core.Workforce will show
                  up here the moment something needs your call.
                </Text>
              </View>
            ) : (
              needsAttention.map((item) => {
                const isBusy = busyId === item.id
                return (
                  <View key={`${item.source}:${item.id}`} style={styles.attentionCard}>
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
                  </View>
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
              <Text style={styles.emptyText}>
                Nothing has happened across your workspaces yet. Once your team starts working, real activity — not
                sample data — will show up here.
              </Text>
            ) : (
              events.slice(0, 10).map((event) => (
                <View key={event.id} style={styles.activityRow}>
                  <View style={styles.activityDot} />
                  <View style={styles.flex}>
                    <Text style={styles.activityText}>{event.type}</Text>
                    <Text style={styles.activityTime}>{formatRelativeTime(event.createdAt)} · {event.source}</Text>
                  </View>
                </View>
              ))
            )}
          </View>

          <QuantumSectionHeader label="Quick actions" />
          <View style={styles.quickGrid}>
            {quickActions.map((action) => (
              <QuantumCard key={action.label} accent={action.accent} style={styles.quickCard}>
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
  headerActions: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  superdash: { borderRadius: 18, borderWidth: 1, borderColor: '#38BDF8', backgroundColor: 'rgba(56,189,248,0.12)', padding: 16, gap: 2 },
  superdashEyebrow: { color: '#38BDF8', fontSize: 11, fontWeight: '800', letterSpacing: 1.4 },
  superdashTitle: { color: '#FFFFFF', fontSize: 20, fontWeight: '800' },
  superdashCopy: { color: '#A9B8C8', fontSize: 13 },
  planButton: { borderRadius: 999, borderWidth: 1, borderColor: '#38BDF866', paddingHorizontal: 12, paddingVertical: 7 },
  planText: { color: '#38BDF8', fontSize: 13, fontWeight: '700' },
  signOutButton: { borderRadius: 999, backgroundColor: 'rgba(255,255,255,0.08)', paddingHorizontal: 12, paddingVertical: 7 },
  signOutText: { color: '#E5E7EB', fontSize: 13, fontWeight: '700' },
  screen: { gap: quantumSpace.lg },
  stack: { gap: quantumSpace.sm },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
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
  skeletonRow: { height: 52, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.05)', marginBottom: quantumSpace.sm },
  skeletonRowShort: { width: '70%' },
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
  emptyText: { color: '#B8C8D8', fontSize: 15, lineHeight: 19 },
  allCaughtUp: { gap: 4 },
  allCaughtUpTitle: { color: quantumColors.success, fontSize: 15, fontWeight: '800' },
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
