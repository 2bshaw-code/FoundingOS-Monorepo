/*
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { router } from 'expo-router'
import { useCallback, useEffect, useMemo, useState } from 'react'
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
  quantumSpace,
  useActiveQuantumTheme,
} from '../../../components/QuantumUI'
import {
  AgentAction,
  AgentActionStatus,
  decideAgentAction,
  executeAgentAction,
  getSession,
  listAgentActions,
  reverseAgentActionExecution,
} from '../../../lib/core-operations-api'
import { enqueueOutboxAction } from '../../../lib/outbox-sync'
import { useQuantumStore } from '../../../lib/store'

const STATUS_LABEL: Record<AgentActionStatus, string> = {
  proposed: 'Suggested',
  approved: 'Awaiting execution',
  rejected: 'Rejected',
  executing: 'Executing',
  completed: 'Executed',
}

const FILTERS: Array<{ label: string; status?: AgentActionStatus }> = [
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
  const [connected, setConnected] = useState(false)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [actions, setActions] = useState<AgentAction[]>([])
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>(FILTERS[0])
  const [busyId, setBusyId] = useState<string | null>(null)
  const [notice, setNotice] = useState('')

  const load = useCallback(async () => {
    const session = await getSession()
    setConnected(Boolean(session))
    if (!session) {
      setLoading(false)
      return
    }
    setActions(await listAgentActions().catch(() => []))
    setLoading(false)
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const showNotice = (text: string) => {
    setNotice(text)
    setTimeout(() => setNotice(''), 3500)
  }

  const run = async (action: AgentAction, outboxType: string, call: () => Promise<AgentAction>) => {
    setBusyId(action.id)
    try {
      await call()
      await load()
      showNotice('Done. Recorded in the audit trail.')
    } catch (err: any) {
      if (err?.status && err.status < 500) {
        showNotice(err.message || 'That action could not be completed.')
      } else {
        await enqueueOutboxAction(outboxType, activeBrandSlug, { actionId: action.id })
        showNotice('Offline — queued for secure sync.')
      }
    } finally {
      setBusyId(null)
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

  const renderActionCard = (action: AgentAction) => (
    <QuantumCard key={action.id} accent={theme.accent}>
      <View style={styles.rowBetween}>
        <QuantumText variant="h3" style={styles.flex}>{action.title || action.kind}</QuantumText>
        <QuantumText variant="caption" color={theme.accent}>{STATUS_LABEL[action.status]}</QuantumText>
      </View>
      <QuantumText>{action.summary}</QuantumText>
      <QuantumText variant="caption" color={theme.subtextColor}>
        {formatRelativeTime(action.createdAt)} · {action.requiresApproval ? 'Human approval required' : 'Auto-governed'}
      </QuantumText>
      {action.estimatedValuePence ? <QuantumText variant="caption" color={theme.accent}>Estimated impact {formatPence(action.estimatedValuePence)}</QuantumText> : null}
      <View style={styles.actionRow}>
        {action.status === 'proposed' ? (
          <>
            <Pressable disabled={busyId === action.id} onPress={() => run(action, 'GOVERNED_ACTION_DECISION_APPROVE', () => decideAgentAction(action.id, 'approve'))}>
              <QuantumText variant="caption" color={theme.accent}>Approve</QuantumText>
            </Pressable>
            <Pressable disabled={busyId === action.id} onPress={() => run(action, 'GOVERNED_ACTION_DECISION_REJECT', () => decideAgentAction(action.id, 'reject'))}>
              <QuantumText variant="caption" color="#FF5470">Reject</QuantumText>
            </Pressable>
          </>
        ) : null}
        {action.status === 'approved' ? (
          <Pressable disabled={busyId === action.id} onPress={() => run(action, 'GOVERNED_ACTION_EXECUTE', () => executeAgentAction(action.id))}>
            <QuantumText variant="caption" color={theme.accent}>Execute</QuantumText>
          </Pressable>
        ) : null}
        {action.status === 'completed' && action.execution?.status === 'completed' ? (
          <Pressable disabled={busyId === action.id} onPress={() => run(action, 'GOVERNED_ACTION_REVERSE', () => reverseAgentActionExecution(action.id))}>
            <QuantumText variant="caption" color="#FF5470">Undo</QuantumText>
          </Pressable>
        ) : null}
      </View>
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
        <QuantumText variant="overline" color={theme.accent}>Core.Operations</QuantumText>
        <QuantumText variant="h1">Work & Approvals</QuantumText>
        <QuantumText color={theme.subtextColor}>
          Governed AI actions grouped by what needs a decision now, what is waiting for execution, and what is already part of the audit history.
        </QuantumText>
      </QuantumCard>

      <View style={styles.metricRow}>
        <QuantumMetric label="Suggested" value={counts.proposed} tone="info" />
        <QuantumMetric label="Awaiting execution" value={counts.approved} tone="watch" />
        <QuantumMetric label="Executed" value={counts.completed} tone="good" />
        <QuantumMetric label="Rejected" value={counts.rejected} tone="risk" />
      </View>

      {notice ? <QuantumNotice tone="info">{notice}</QuantumNotice> : null}

      {!connected ? (
        <View style={{ gap: quantumSpace.sm }}>
          <QuantumNotice tone="warning">Sign in with your Core.Operations account to see governed actions.</QuantumNotice>
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
})
