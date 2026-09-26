/*
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { router } from 'expo-router'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { ActivityIndicator, Pressable, RefreshControl, StyleSheet, View } from 'react-native'
import {
  QuantumButton,
  QuantumCard,
  QuantumMetric,
  QuantumNotice,
  QuantumPill,
  QuantumScreen,
  QuantumSectionHeader,
  QuantumText,
  quantumColors,
  quantumSpace,
  useActiveQuantumTheme,
} from '../../../components/QuantumUI'
import {
  ApprovalsQueueItem,
  ApprovalsQueueStatus,
  approveQueueItem,
  executeQueueItem,
  fetchApprovalsQueue,
  fetchQueueItemTrail,
  outboxActionType,
  rejectQueueItem,
  reverseQueueItem,
} from '../../../lib/approvals-queue'
import { AgentActionTrailEvent } from '../../../lib/core-operations-api'
import { enqueueOutboxAction } from '../../../lib/outbox-sync'
import { useQuantumStore } from '../../../lib/store'
import { useActionFeedback } from '../../../lib/use-action-feedback'
import { logAction } from '../../../lib/action-logger'
import { canPerformAction } from '../../../lib/permissions'
import { FoundAiAutopilotCard } from '../../../components/FoundAi'

const STATUS_LABEL: Record<ApprovalsQueueStatus, string> = {
  proposed: 'Suggested',
  approved: 'Awaiting execution',
  rejected: 'Rejected',
  executing: 'Executing',
  completed: 'Executed',
  reversed: 'Reversed',
}

const SOURCE_LABEL: Record<ApprovalsQueueItem['source'], string> = {
  core_operations: 'Core.Operations',
  core_workforce: 'Core.Workforce',
}

const FILTERS: Array<{ label: string; status?: ApprovalsQueueStatus }> = [
  { label: 'All' },
  { label: 'Suggested', status: 'proposed' },
  { label: 'Awaiting execution', status: 'approved' },
  { label: 'Executed', status: 'completed' },
  { label: 'Rejected', status: 'rejected' },
]

function formatPence(pence: number | null | undefined) {
  if (!pence) return '£0'
  return `£${(pence / 100).toLocaleString('en-GB', { maximumFractionDigits: 0 })}`
}

function formatRelativeTime(iso: string) {
  const diffMs = Date.now() - new Date(iso).getTime()
  const minutes = Math.round(diffMs / 60000)
  if (minutes < 1) return 'just now'
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.round(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  return `${Math.round(hours / 24)}d ago`
}

export default function WorkflowsScreen() {
  const theme = useActiveQuantumTheme()
  const activeBrandSlug = useQuantumStore((state) => state.activeBrandSlug)
  const isOnline = useQuantumStore((state) => state.isOnline)
  const role = useQuantumStore((state) => state.role)
  // Phase 26 — client-side UX gate only; the backend re-checks the real
  // session role on every request and rolls back on a real 403 regardless.
  const canDecide = canPerformAction(role, 'approveOrReject')
  const [connected, setConnected] = useState(false)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [actions, setActions] = useState<ApprovalsQueueItem[]>([])
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>(FILTERS[0])
  const [busyId, setBusyId] = useState<string | null>(null)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [trail, setTrail] = useState<AgentActionTrailEvent[]>([])
  const [trailLoading, setTrailLoading] = useState(false)
  const { feedback, showSuccess, showOffline, showError } = useActionFeedback()
  // Guards against a double-tap firing the same action twice before the
  // first tap's state update (busyId) has re-rendered and disabled it.
  const inFlight = useRef<Set<string>>(new Set())

  const load = useCallback(async () => {
    const result = await fetchApprovalsQueue()
    setConnected(result.coreOperationsConnected || result.coreWorkforceConnected)
    setActions(result.items)
    setLoading(false)
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const run = async (action: ApprovalsQueueItem, kind: 'APPROVE' | 'REJECT' | 'EXECUTE' | 'REVERSE', call: () => Promise<unknown>) => {
    const key = `${action.id}:${kind}`
    if (inFlight.current.has(key)) return
    inFlight.current.add(key)
    setBusyId(action.id)
    // Optimistic UI: reflect the decision immediately so approving/rejecting
    // feels instant, then reconcile with the server in the background. Only
    // rolled back if the server genuinely rejects the action (4xx) — a
    // network failure keeps the optimistic state since it's queued to sync.
    const optimisticStatus: ApprovalsQueueStatus | null =
      kind === 'APPROVE' ? 'approved' : kind === 'REJECT' ? 'rejected' : kind === 'EXECUTE' ? 'completed' : kind === 'REVERSE' ? 'reversed' : null
    const previous = actions
    if (optimisticStatus) {
      setActions((current) => current.map((item) => (item.id === action.id ? { ...item, status: optimisticStatus } : item)))
    }
    try {
      await call()
      logAction('approval_action', 'success', { kind, actionId: action.id })
      showSuccess('Done. Recorded in the audit trail.')
      load()
    } catch (err: any) {
      if (err?.status && err.status < 500) {
        setActions(previous)
        logAction('approval_action', 'failure', { kind, actionId: action.id, status: err.status })
        showError(err, () => run(action, kind, call))
      } else {
        await enqueueOutboxAction(outboxActionType(action, kind), activeBrandSlug, { actionId: action.id })
        logAction('approval_action', 'failure', { kind, actionId: action.id, queued: true })
        showOffline()
      }
    } finally {
      setBusyId(null)
      inFlight.current.delete(key)
    }
  }

  const visible = useMemo(
    () => (filter.status ? actions.filter((action) => action.status === filter.status) : actions),
    [actions, filter]
  )
  const priority = visible.filter((action) => action.status === 'proposed' || action.status === 'approved')
  const history = visible.filter((action) => !priority.includes(action))
  const counts = {
    proposed: actions.filter((action) => action.status === 'proposed').length,
    approved: actions.filter((action) => action.status === 'approved').length,
    completed: actions.filter((action) => action.status === 'completed').length,
    rejected: actions.filter((action) => action.status === 'rejected').length,
  }

  const toggleEvidence = async (action: ApprovalsQueueItem) => {
    if (expandedId === action.id) {
      setExpandedId(null)
      return
    }
    setExpandedId(action.id)
    setTrail([])
    setTrailLoading(true)
    try {
      setTrail(await fetchQueueItemTrail(action))
    } finally {
      setTrailLoading(false)
    }
  }

  const renderActionCard = (action: ApprovalsQueueItem) => (
    <QuantumCard key={`${action.source}:${action.id}`} accent={theme.accent}>
      <View style={styles.rowBetween}>
        <QuantumText variant="h3" style={styles.flex}>{action.title}</QuantumText>
        <QuantumText variant="caption" color={theme.accent}>{STATUS_LABEL[action.status]}</QuantumText>
      </View>
      <QuantumText>{action.summary}</QuantumText>
      <QuantumText variant="caption" color={theme.subtextColor}>
        {SOURCE_LABEL[action.source]} · {formatRelativeTime(action.createdAt)} · {action.requiresApproval ? 'Human approval required' : 'Auto-governed'}
      </QuantumText>
      {action.estimatedValuePence ? <QuantumText variant="caption" color={theme.accent}>Estimated impact {formatPence(action.estimatedValuePence)}</QuantumText> : null}
      {!canDecide ? (
        <QuantumText variant="caption" color={theme.subtextColor}>Your role can view this queue but not decide on it.</QuantumText>
      ) : null}
      <View style={styles.actionRow}>
        {action.status === 'proposed' && canDecide ? (
          <>
            <Pressable disabled={busyId === action.id} onPress={() => run(action, 'APPROVE', () => approveQueueItem(action))}>
              <QuantumText variant="caption" color={theme.accent}>Approve</QuantumText>
            </Pressable>
            <Pressable disabled={busyId === action.id} onPress={() => run(action, 'REJECT', () => rejectQueueItem(action))}>
              <QuantumText variant="caption" color="#FF5470">Reject</QuantumText>
            </Pressable>
          </>
        ) : null}
        {action.status === 'approved' && canDecide ? (
          <Pressable disabled={busyId === action.id} onPress={() => run(action, 'EXECUTE', () => executeQueueItem(action))}>
            <QuantumText variant="caption" color={theme.accent}>Execute</QuantumText>
          </Pressable>
        ) : null}
        {action.canUndo && canDecide ? (
          <Pressable disabled={busyId === action.id} onPress={() => run(action, 'REVERSE', () => reverseQueueItem(action))}>
            <QuantumText variant="caption" color="#FF5470">Undo</QuantumText>
          </Pressable>
        ) : null}
        <Pressable onPress={() => toggleEvidence(action)}>
          <QuantumText variant="caption" color={theme.accent}>{expandedId === action.id ? 'Hide evidence' : 'View evidence'}</QuantumText>
        </Pressable>
      </View>
      {expandedId === action.id ? (
        <View style={styles.trailBox}>
          {!action.hasEvidenceTrail ? (
            <QuantumText variant="caption" color={theme.subtextColor}>
              Not yet available — Core.Workforce doesn't have a per-action audit trail yet. Every decision is still recorded, just not shown here.
            </QuantumText>
          ) : trailLoading ? (
            <ActivityIndicator color={theme.accent} />
          ) : trail.length === 0 ? (
            <QuantumText variant="caption" color={theme.subtextColor}>No audit events recorded yet.</QuantumText>
          ) : (
            trail.map((event) => (
              <View key={event.id} style={styles.rowBetween}>
                <QuantumText variant="caption" style={styles.flex}>{event.type}</QuantumText>
                <QuantumText variant="caption" color={theme.subtextColor}>{formatRelativeTime(event.createdAt)}</QuantumText>
              </View>
            ))
          )}
        </View>
      ) : null}
    </QuantumCard>
  )

  if (loading) {
    return (
      <QuantumScreen scroll={false} contentStyle={styles.center}>
        <ActivityIndicator color={theme.accent} />
      </QuantumScreen>
    )
  }

  return (
    <QuantumScreen refreshControl={<RefreshControl refreshing={refreshing} onRefresh={async () => { setRefreshing(true); await load(); setRefreshing(false) }} tintColor={theme.accent} />}>
      <QuantumCard accent={theme.accent}>
        <QuantumText variant="overline" color={theme.accent}>Core.Operations · Core.Workforce</QuantumText>
        <QuantumText variant="h1">Approvals</QuantumText>
        <QuantumText color={theme.subtextColor}>
          FoundAI runs routine work on Autopilot and brings you only the decisions that need a human. Approve or decline here — everything is recorded in the audit trail.
        </QuantumText>
      </QuantumCard>

      <FoundAiAutopilotCard />

      <View style={styles.trustStrip}>
        <QuantumText variant="overline" color={quantumColors.neutral300}>What this can and can't do</QuantumText>
        <QuantumText variant="caption" color={theme.subtextColor}>
          Can: approve, reject, execute, and undo AI-proposed actions from Core.Operations and Core.Workforce, with a full audit trail.{'\n'}
          Autopilot: FoundAI acts on its own only for the kinds of work you set to Auto (and within your spend limit). Everything else waits here for you.
        </QuantumText>
      </View>

      {!isOnline ? <QuantumNotice tone="warning">Working offline — changes will sync later.</QuantumNotice> : null}

      <View style={styles.metricRow}>
        <QuantumMetric label="Suggested" value={counts.proposed} tone="info" />
        <QuantumMetric label="Awaiting execution" value={counts.approved} tone="watch" />
        <QuantumMetric label="Executed" value={counts.completed} tone="good" />
        <QuantumMetric label="Rejected" value={counts.rejected} tone="risk" />
      </View>

      {feedback ? <QuantumNotice tone={feedback.tone} onRetry={feedback.onRetry}>{feedback.message}</QuantumNotice> : null}

      {!connected ? (
        <View style={{ gap: quantumSpace.sm }}>
          <QuantumNotice tone="warning">Sign in to see governed actions from Core.Operations and Core.Workforce.</QuantumNotice>
          <QuantumButton onPress={() => router.replace({ pathname: '/', params: { returnTo: '/(app)/(tabs)/workflows' } })}>Sign in</QuantumButton>
        </View>
      ) : (
        <>
          <View style={styles.filterRow}>
            {FILTERS.map((option) => (
              <QuantumPill key={option.label} active={filter.label === option.label} accent={theme.accent} onPress={() => setFilter(option)}>
                {option.label}
              </QuantumPill>
            ))}
          </View>

          <QuantumSectionHeader label="Decision queue" />
          {priority.length === 0 ? (
            <QuantumNotice>No actions currently need approval or execution.</QuantumNotice>
          ) : (
            priority.map(renderActionCard)
          )}

          <QuantumSectionHeader label={filter.status ? `${visible.length} matching action(s)` : 'Audit history'} />
          {filter.status ? (
            visible.length === 0 ? <QuantumNotice>No governed actions match this filter yet.</QuantumNotice> : visible.map(renderActionCard)
          ) : history.length === 0 ? (
            <QuantumNotice>No completed or rejected history yet.</QuantumNotice>
          ) : (
            history.map(renderActionCard)
          )}
        </>
      )}
    </QuantumScreen>
  )
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  rowBetween: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: quantumSpace.md },
  flex: { flex: 1 },
  metricRow: { flexDirection: 'row', flexWrap: 'wrap', gap: quantumSpace.sm },
  filterRow: { flexDirection: 'row', flexWrap: 'wrap', gap: quantumSpace.xs },
  actionRow: { flexDirection: 'row', flexWrap: 'wrap', gap: quantumSpace.lg, marginTop: quantumSpace.xs },
  trustStrip: { gap: quantumSpace.xs, paddingHorizontal: quantumSpace.xs },
  trailBox: { gap: quantumSpace.xs, marginTop: quantumSpace.xs, paddingTop: quantumSpace.xs, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: 'rgba(255,255,255,0.08)' },
})
