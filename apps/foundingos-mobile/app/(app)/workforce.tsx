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
  QuantumFormField,
  QuantumMetric,
  QuantumNotice,
  QuantumPasswordInput,
  QuantumPill,
  QuantumScreen,
  QuantumSectionHeader,
  QuantumText,
  QuantumTextInput,
  quantumSpace,
  useActiveQuantumTheme,
} from '../../components/QuantumUI'
import {
  Candidate,
  CandidateStage,
  Job,
  WorkforceAction,
  WorkforceActionStatus,
  createCandidate,
  createJob,
  decideWorkforceAction,
  executeWorkforceAction,
  getSession,
  listCandidates,
  listJobs,
  listWorkforceActions,
  login as workforceLogin,
  proposeShortlistingAction,
  reverseWorkforceActionExecution,
} from '../../lib/core-workforce-api'
import { getSession as getCoreOpsSession } from '../../lib/core-operations-api'
import { enqueueOutboxAction } from '../../lib/outbox-sync'
import { useQuantumStore } from '../../lib/store'

const ACTION_STATUS_LABEL: Record<WorkforceActionStatus, string> = {
  proposed: 'Suggested',
  approved: 'Awaiting execution',
  rejected: 'Rejected',
  executing: 'Executing',
  completed: 'Executed',
  reversed: 'Reversed',
}

const STAGE_ORDER: CandidateStage[] = ['Applied', 'Screening', 'Interview', 'Offer', 'Hired', 'Rejected']

function formatRelativeTime(iso: string) {
  const diffMs = Date.now() - new Date(iso).getTime()
  const minutes = Math.round(diffMs / 60000)
  if (minutes < 1) return 'just now'
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.round(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  return `${Math.round(hours / 24)}d ago`
}

export default function WorkforceScreen() {
  const theme = useActiveQuantumTheme()
  const activeBrandSlug = useQuantumStore((state) => state.activeBrandSlug)
  const [connected, setConnected] = useState(false)
  const [coreOpsEmail, setCoreOpsEmail] = useState<string | null>(null)
  const [reconnectPassword, setReconnectPassword] = useState('')
  const [reconnecting, setReconnecting] = useState(false)
  const [reconnectError, setReconnectError] = useState('')
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [jobs, setJobs] = useState<Job[]>([])
  const [candidates, setCandidates] = useState<Candidate[]>([])
  const [actions, setActions] = useState<WorkforceAction[]>([])
  const [busyId, setBusyId] = useState<string | null>(null)
  const [notice, setNotice] = useState('')
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null)
  const [newJobTitle, setNewJobTitle] = useState('')
  const [newCandidateName, setNewCandidateName] = useState('')
  const [newCandidateEmail, setNewCandidateEmail] = useState('')

  const load = useCallback(async () => {
    const session = await getSession()
    setConnected(Boolean(session))
    if (!session) {
      // The Core.Workforce backend has its own independent auth/database. If the
      // parallel Workforce login attempted at Core.Operations sign-in time didn't
      // land (e.g. this account has no Core.Workforce identity, or the app was
      // restarted and only the Core.Operations session was restored), surface a
      // real reconnect form pre-filled with the known email rather than a dead end.
      const coreOpsSession = await getCoreOpsSession()
      setCoreOpsEmail(coreOpsSession?.email ?? null)
      setLoading(false)
      return
    }
    const [jobList, candidateList, actionList] = await Promise.all([
      listJobs().catch(() => []),
      listCandidates().catch(() => []),
      listWorkforceActions().catch(() => []),
    ])
    setJobs(jobList)
    setCandidates(candidateList)
    setActions(actionList)
    setLoading(false)
  }, [])

  const handleReconnect = async () => {
    if (!coreOpsEmail || !reconnectPassword.trim()) {
      setReconnectError('Enter your password to reconnect Core.Workforce.')
      return
    }
    setReconnecting(true)
    setReconnectError('')
    const result = await workforceLogin(coreOpsEmail, reconnectPassword.trim())
    setReconnecting(false)
    if (!result.ok) {
      setReconnectError(result.error)
      return
    }
    setReconnectPassword('')
    setLoading(true)
    await load()
  }

  useEffect(() => {
    load()
  }, [load])

  const showNotice = (text: string) => {
    setNotice(text)
    setTimeout(() => setNotice(''), 3500)
  }

  const runAction = async (action: WorkforceAction, outboxType: string, call: () => Promise<WorkforceAction>) => {
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

  const handleCreateJob = async () => {
    if (!newJobTitle.trim()) {
      showNotice('Enter a role title first.')
      return
    }
    try {
      await createJob({ title: newJobTitle.trim(), status: 'open' })
      setNewJobTitle('')
      await load()
      showNotice('Role created.')
    } catch (err: any) {
      showNotice(err?.message || 'Could not create role.')
    }
  }

  const handleAddCandidate = async (jobId: string) => {
    if (!newCandidateName.trim() || !newCandidateEmail.trim()) {
      showNotice('Enter the candidate name and email.')
      return
    }
    try {
      await createCandidate({ jobId, name: newCandidateName.trim(), email: newCandidateEmail.trim(), stage: 'Applied' })
      setNewCandidateName('')
      setNewCandidateEmail('')
      await load()
      showNotice('Candidate added to the pipeline.')
    } catch (err: any) {
      showNotice(err?.message || 'Could not add candidate.')
    }
  }

  const handleProposeShortlist = async (candidate: Candidate) => {
    const currentIndex = STAGE_ORDER.indexOf(candidate.stage)
    const nextStage = STAGE_ORDER[Math.min(currentIndex + 1, STAGE_ORDER.length - 2)]
    setBusyId(candidate.id)
    try {
      await proposeShortlistingAction({ jobId: candidate.jobId, candidateId: candidate.id, targetStage: nextStage })
      await load()
      showNotice('Shortlisting action proposed — awaiting approval.')
    } catch (err: any) {
      showNotice(err?.message || 'Could not propose shortlisting.')
    } finally {
      setBusyId(null)
    }
  }

  const openJobs = useMemo(() => jobs.filter((job) => job.status === 'open'), [jobs])
  const jobsById = useMemo(() => new Map(jobs.map((job) => [job.id, job])), [jobs])
  const pipelineByStage = useMemo(() => {
    const map = new Map<CandidateStage, Candidate[]>()
    STAGE_ORDER.forEach((stage) => map.set(stage, []))
    candidates
      .filter((candidate) => !selectedJobId || candidate.jobId === selectedJobId)
      .forEach((candidate) => map.get(candidate.stage)?.push(candidate))
    return map
  }, [candidates, selectedJobId])

  const priorityActions = actions.filter((action) => action.status === 'proposed' || action.status === 'approved')
  const actionCounts = {
    proposed: actions.filter((action) => action.status === 'proposed').length,
    approved: actions.filter((action) => action.status === 'approved').length,
    completed: actions.filter((action) => action.status === 'completed').length,
  }

  const renderActionCard = (action: WorkforceAction) => (
    <QuantumCard key={action.id} accent={theme.accent}>
      <View style={styles.rowBetween}>
        <QuantumText variant="h3" style={styles.flex}>{action.title}</QuantumText>
        <QuantumText variant="caption" color={theme.accent}>{ACTION_STATUS_LABEL[action.status]}</QuantumText>
      </View>
      <QuantumText>{action.summary}</QuantumText>
      <QuantumText variant="caption" color={theme.subtextColor}>
        {formatRelativeTime(action.createdAt)} · {action.requiresApproval ? 'Human approval required' : 'Auto-governed'}
      </QuantumText>
      <View style={styles.actionRow}>
        {action.status === 'proposed' ? (
          <>
            <Pressable disabled={busyId === action.id} onPress={() => runAction(action, 'WORKFORCE_ACTION_DECISION_APPROVE', () => decideWorkforceAction(action.id, 'approve'))}>
              <QuantumText variant="caption" color={theme.accent}>Approve</QuantumText>
            </Pressable>
            <Pressable disabled={busyId === action.id} onPress={() => runAction(action, 'WORKFORCE_ACTION_DECISION_REJECT', () => decideWorkforceAction(action.id, 'reject'))}>
              <QuantumText variant="caption" color="#FF5470">Reject</QuantumText>
            </Pressable>
          </>
        ) : null}
        {action.status === 'approved' ? (
          <Pressable disabled={busyId === action.id} onPress={() => runAction(action, 'WORKFORCE_ACTION_EXECUTE', () => executeWorkforceAction(action.id))}>
            <QuantumText variant="caption" color={theme.accent}>Execute</QuantumText>
          </Pressable>
        ) : null}
        {action.status === 'completed' ? (
          <Pressable disabled={busyId === action.id} onPress={() => runAction(action, 'WORKFORCE_ACTION_REVERSE', () => reverseWorkforceActionExecution(action.id))}>
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
        <QuantumText variant="overline" color={theme.accent}>Core.Workforce</QuantumText>
        <QuantumText variant="h1">Hiring & Pipeline</QuantumText>
        <QuantumText color={theme.subtextColor}>
          Open roles, live applicant pipeline, and governed shortlisting actions — every stage move goes through approve, execute, and reversible audit like every other suite.
        </QuantumText>
      </QuantumCard>

      {notice ? <QuantumNotice tone="info">{notice}</QuantumNotice> : null}

      {!connected ? (
        coreOpsEmail ? (
          <QuantumCard accent={theme.accent}>
            <QuantumText variant="h3">Reconnect Core.Workforce</QuantumText>
            <QuantumText color={theme.subtextColor}>
              Core.Workforce uses its own sign-in. Confirm your password once to link {coreOpsEmail} to this suite.
            </QuantumText>
            <QuantumFormField label="Password">
              <QuantumPasswordInput placeholder="••••••••" value={reconnectPassword} onChangeText={setReconnectPassword} />
            </QuantumFormField>
            {reconnectError ? <QuantumNotice tone="danger">{reconnectError}</QuantumNotice> : null}
            <QuantumButton onPress={handleReconnect} disabled={reconnecting}>
              {reconnecting ? <ActivityIndicator color={theme.bgPrimary} /> : 'Reconnect'}
            </QuantumButton>
          </QuantumCard>
        ) : (
          <View style={{ gap: quantumSpace.sm }}>
            <QuantumNotice tone="warning">Sign in with your FoundingOS account on the login screen to connect Core.Workforce.</QuantumNotice>
            <QuantumButton onPress={() => router.replace('/')}>Sign in</QuantumButton>
          </View>
        )
      ) : (
        <>
          <View style={styles.metricRow}>
            <QuantumMetric label="Open roles" value={openJobs.length} tone="info" />
            <QuantumMetric label="Candidates" value={candidates.length} tone="good" />
            <QuantumMetric label="Awaiting decision" value={actionCounts.proposed} tone={actionCounts.proposed ? 'watch' : 'good'} />
          </View>

          <QuantumSectionHeader label="Decision queue" />
          {priorityActions.length === 0 ? (
            <QuantumNotice>No shortlisting actions currently need approval or execution.</QuantumNotice>
          ) : (
            priorityActions.map(renderActionCard)
          )}

          <QuantumSectionHeader label="Open roles" />
          {jobs.length === 0 ? (
            <QuantumNotice>No roles yet. Add the first open role below.</QuantumNotice>
          ) : (
            <View style={styles.filterRow}>
              <QuantumPill active={!selectedJobId} accent={theme.accent} onPress={() => setSelectedJobId(null)}>All roles</QuantumPill>
              {jobs.map((job) => (
                <QuantumPill key={job.id} active={selectedJobId === job.id} accent={theme.accent} onPress={() => setSelectedJobId(job.id)}>
                  {job.title}
                </QuantumPill>
              ))}
            </View>
          )}

          <QuantumCard accent={theme.accent}>
            <QuantumText variant="h3">Add a role</QuantumText>
            <QuantumFormField label="Role title">
              <QuantumTextInput placeholder="e.g. Retail Ops Lead" value={newJobTitle} onChangeText={setNewJobTitle} />
            </QuantumFormField>
            <QuantumButton onPress={handleCreateJob}>Create role</QuantumButton>
          </QuantumCard>

          {selectedJobId ? (
            <QuantumCard accent={theme.accent}>
              <QuantumText variant="h3">Add a candidate to {jobsById.get(selectedJobId)?.title}</QuantumText>
              <QuantumFormField label="Name">
                <QuantumTextInput placeholder="Full name" value={newCandidateName} onChangeText={setNewCandidateName} />
              </QuantumFormField>
              <QuantumFormField label="Email">
                <QuantumTextInput placeholder="candidate@example.com" autoCapitalize="none" keyboardType="email-address" value={newCandidateEmail} onChangeText={setNewCandidateEmail} />
              </QuantumFormField>
              <QuantumButton onPress={() => handleAddCandidate(selectedJobId)}>Add candidate</QuantumButton>
            </QuantumCard>
          ) : null}

          <QuantumSectionHeader label="Pipeline" />
          {candidates.length === 0 ? (
            <QuantumNotice>No candidates yet. Add one above to see the pipeline move through stages.</QuantumNotice>
          ) : (
            STAGE_ORDER.map((stage) => {
              const stageCandidates = pipelineByStage.get(stage) || []
              if (stageCandidates.length === 0) return null
              return (
                <View key={stage}>
                  <QuantumText variant="caption" color={theme.subtextColor} style={styles.stageLabel}>{stage.toUpperCase()} · {stageCandidates.length}</QuantumText>
                  {stageCandidates.map((candidate) => (
                    <QuantumCard key={candidate.id} accent={theme.accent}>
                      <View style={styles.rowBetween}>
                        <QuantumText variant="h3" style={styles.flex}>{candidate.name}</QuantumText>
                        <QuantumText variant="caption" color={theme.subtextColor}>{jobsById.get(candidate.jobId)?.title ?? 'Unknown role'}</QuantumText>
                      </View>
                      <QuantumText color={theme.subtextColor}>{candidate.email}</QuantumText>
                      {stage !== 'Hired' && stage !== 'Rejected' ? (
                        <View style={styles.actionRow}>
                          <Pressable disabled={busyId === candidate.id} onPress={() => handleProposeShortlist(candidate)}>
                            <QuantumText variant="caption" color={theme.accent}>Propose shortlist to next stage</QuantumText>
                          </Pressable>
                        </View>
                      ) : null}
                    </QuantumCard>
                  ))}
                </View>
              )
            })
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
  stageLabel: { marginTop: quantumSpace.md, marginBottom: quantumSpace.xs, fontWeight: '700' },
})
