/*
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { useCallback, useEffect, useState } from 'react'
import { ActivityIndicator, RefreshControl, StyleSheet, View } from 'react-native'
import { useLocalSearchParams, router } from 'expo-router'
import { BRANDS } from '../../../lib/brands'
import { authedFetch } from '../../../lib/api'
import { AIHintBanner } from '../../../components/AIHintBanner'
import { QuantumBackButton } from '../../../components/QuantumBackButton'
import { QuantumButton, QuantumCard, QuantumLoadingScreen, QuantumNotice, QuantumScreen, QuantumSectionHeader, QuantumText, getSemanticColor, quantumSpace } from '../../../components/QuantumUI'
import { enqueueOutboxAction } from '../../../lib/outbox-sync'

type ModuleMetric = { label: string; value: string; trend?: string; icon?: string; tone?: 'good' | 'watch' | 'risk' }
type ModuleData = { id: string; label: string; description: string; metrics: ModuleMetric[]; actions: string[]; workflow?: string[] }
type RecentAction = { id: string; action: string; sessionId: string; note: string | null; createdAt: string }

const moduleLanguage: Record<string, { description: string; actions: string[]; workflow: string[] }> = {
  orders: { description: 'Create, confirm, dispatch, and complete customer orders from one shared queue.', actions: ['Create order', 'Confirm order', 'Send WhatsApp update'], workflow: ['Capture the customer request', 'Confirm stock and payment', 'Dispatch and publish the delivery event'] },
  inventory: { description: 'See stock cover, record movements, and act before products run out.', actions: ['Receive stock', 'Record sale', 'Create supplier order'], workflow: ['Review low-stock products', 'Confirm the required quantity', 'Record the movement in the Event Feed'] },
  deliveries: { description: 'Assign, dispatch, and recover deliveries without losing the customer promise.', actions: ['Assign driver', 'Start delivery', 'Confirm delivered'], workflow: ['Assign an owner and vehicle', 'Share the delivery status', 'Confirm proof and notify Finance'] },
  invoicing: { description: 'Send invoices, collect payment, and reconcile cash against completed work.', actions: ['Send invoice', 'Send payment reminder', 'Mark paid'], workflow: ['Create from the completed order', 'Send the payment link', 'Reconcile the receipt'] },
  campaigns: { description: 'Turn customer and order data into measurable campaigns across messaging and social channels.', actions: ['Create campaign', 'Generate content', 'Schedule campaign'], workflow: ['Choose the audience and outcome', 'Approve channel-ready content', 'Measure orders and revenue'] },
  candidates: { description: 'Move the strongest people through hiring with clear ownership and next steps.', actions: ['Add candidate', 'Schedule interview', 'Prepare offer'], workflow: ['Review role match', 'Coordinate the interview', 'Start onboarding after acceptance'] },
  patients: { description: 'Coordinate patient requests, appointments, and follow-up in one safe operational view.', actions: ['Add patient', 'Book appointment', 'Send reminder'], workflow: ['Capture the request', 'Confirm the appointment', 'Record the outcome and follow-up'] },
}

function titleCase(value: string) {
  return value.split('-').map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(' ')
}

function buildDemoModule(moduleId: string): ModuleData {
  const language = moduleLanguage[moduleId] ?? {
    description: `Manage ${titleCase(moduleId).toLowerCase()} records, decisions, and activity from the shared FoundingOS workspace.`,
    actions: [`Create ${titleCase(moduleId)} record`, 'Review priorities', 'Send WhatsApp update'],
    workflow: ['Review the current queue', 'Take the next accountable action', 'Publish the result to the Event Feed'],
  }
  return {
    id: moduleId,
    label: titleCase(moduleId),
    description: language.description,
    metrics: [
      { label: 'Active', value: '24', trend: '+8% this week', icon: '●', tone: 'good' },
      { label: 'Needs attention', value: '3', trend: '2 high priority', icon: '!', tone: 'watch' },
      { label: 'Completed', value: '87%', trend: '+6% vs last week', icon: '✓', tone: 'good' },
    ],
    actions: language.actions,
    workflow: language.workflow,
  }
}

function timeAgo(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime()
  const mins = Math.max(0, Math.round(diffMs / 60000))
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hours = Math.round(mins / 60)
  if (hours < 24) return `${hours}h ago`
  return `${Math.round(hours / 24)}d ago`
}

export default function ModuleDetailScreen() {
  const { slug, moduleId } = useLocalSearchParams<{ slug: string; moduleId: string }>()
  const brand = BRANDS.find((entry) => entry.slug === slug)
  const [data, setData] = useState<ModuleData | null>(null)
  const [recentActions, setRecentActions] = useState<RecentAction[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState('')
  const [submittingAction, setSubmittingAction] = useState<string | null>(null)
  const [confirmedAction, setConfirmedAction] = useState<string | null>(null)

  const load = useCallback(async (isRefresh = false) => {
    if (!slug || !moduleId) return
    if (isRefresh) setRefreshing(true)
    setError('')
    try {
      const response = await authedFetch(`https://${slug}-console.foundingos.com/api/console/modules/${moduleId}`)
      if (!response.ok) {
        setError(response.status === 401 ? 'Your session has expired. Safe demo data is shown until you sign in again.' : 'Live sync is unavailable. Safe demo data is active.')
        setData(buildDemoModule(moduleId))
        return
      }
      const json = await response.json()
      setData(json.module ?? buildDemoModule(moduleId))
      setRecentActions(Array.isArray(json.recentActions) ? json.recentActions : [])
    } catch {
      setData(buildDemoModule(moduleId))
      setError('Live sync is unavailable. Safe demo data is active and actions will use the offline outbox.')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [slug, moduleId])

  useEffect(() => {
    load()
  }, [load])

  // Real write-back — POSTs to the same brand-specific console route (real Postgres row via
  // module_actions), same as every brand-specific mobile app, so an action taken from the
  // umbrella app is indistinguishable from one taken in that brand's own app or on the web.
  async function handleActionTap(action: string) {
    if (!slug || !moduleId || submittingAction) return
    setSubmittingAction(action)
    try {
      const response = await authedFetch(`https://${slug}-console.foundingos.com/api/console/modules/${moduleId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      })
      if (!response.ok) {
        setError('Could not save this action. Check your connection and try again.')
        return
      }
      const json = await response.json()
      const savedAction: RecentAction = json.action ?? { id: `offline-${Date.now()}`, action, sessionId: 'offline', note: 'Waiting for sync', createdAt: new Date().toISOString() }
      if (!json.action) await enqueueOutboxAction(`MODULE_${action.toUpperCase().replaceAll(' ', '_')}`, slug, { moduleId, action, source: 'mobile-workspace' })
      setRecentActions((current) => [savedAction, ...current].slice(0, 10))
      setConfirmedAction(action)
      setTimeout(() => setConfirmedAction((current) => (current === action ? null : current)), 2500)
    } catch {
      await enqueueOutboxAction(`MODULE_${action.toUpperCase().replaceAll(' ', '_')}`, slug, { moduleId, action, source: 'mobile-workspace' })
      setRecentActions((current) => [{ id: `offline-${Date.now()}`, action, sessionId: 'offline', note: 'Waiting for sync', createdAt: new Date().toISOString() }, ...current].slice(0, 10))
      setConfirmedAction(action)
      setError('Live sync is unavailable. This action is safely waiting in the offline outbox.')
    } finally {
      setSubmittingAction(null)
    }
  }

  if (!brand) return null
  if (loading) return <QuantumLoadingScreen />

  return (
    <QuantumScreen refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => load(true)} tintColor={brand.accent} />}>
      <QuantumBackButton label={`‹ ${brand.name}`} fallbackHref={`/brand-detail/${brand.slug}`} />
      {error ? <QuantumNotice tone="danger">{error}</QuantumNotice> : data ? (
        <>
          <QuantumCard accent={brand.accent}>
            <QuantumText variant="overline" color={brand.accent}>{brand.name}</QuantumText>
            <QuantumText variant="h1">{data.label}</QuantumText>
            <QuantumText color="#D8D8D8">{data.description}</QuantumText>
          </QuantumCard>

          <AIHintBanner
            accent={brand.accent}
            description={`${data.label}: ${data.description}`}
            recommendedAction={data.actions[0]?.toLowerCase() ?? 'review this module'}
            onDoThisForMe={() => data.actions[0] && handleActionTap(data.actions[0])}
          />

          <QuantumSectionHeader label="Metrics" />
          <View style={styles.metricGrid}>
            {data.metrics.map((metric) => (
              <QuantumCard key={metric.label} accent={getSemanticColor(metric.tone ?? 'good')} style={styles.metricCard}>
                <QuantumText variant="caption" color="#D8D8D8">{metric.icon ? `${metric.icon} ` : ''}{metric.label}</QuantumText>
                <QuantumText variant="h2">{metric.value}</QuantumText>
                {metric.trend ? <QuantumText variant="caption" color="#7F7F7F">{metric.trend}</QuantumText> : null}
              </QuantumCard>
            ))}
          </View>

          <QuantumSectionHeader label="Quick actions" />
          <View style={styles.grid}>
            {data.actions.map((action) => (
              <QuantumButton
                key={action}
                tone={confirmedAction === action ? 'primary' : 'secondary'}
                onPress={() => handleActionTap(action)}
                disabled={submittingAction === action}
              >
                {confirmedAction === action ? `✓ ${action} saved` : submittingAction === action ? '…' : action}
              </QuantumButton>
            ))}
          </View>

          {recentActions.length > 0 ? (
            <>
              <QuantumSectionHeader label="Recent activity" />
              {recentActions.map((entry) => (
                <QuantumCard key={entry.id} accent={brand.accent}>
                  <View style={styles.workflowRow}>
                    <QuantumText>✓ {entry.action}</QuantumText>
                    <QuantumText variant="caption" color="#7F7F7F">{timeAgo(entry.createdAt)}</QuantumText>
                  </View>
                </QuantumCard>
              ))}
            </>
          ) : null}

          {data.workflow?.length ? (
            <>
              <QuantumSectionHeader label="Workflow" />
              {data.workflow.map((step, index) => (
                <QuantumCard key={step} accent={brand.accent}>
                  <View style={styles.workflowRow}>
                    <QuantumText variant="h3" color={brand.accent}>{index + 1}</QuantumText>
                    <QuantumText>{step}</QuantumText>
                  </View>
                </QuantumCard>
              ))}
            </>
          ) : null}
        </>
      ) : (
        <ActivityIndicator color={brand.accent} />
      )}
    </QuantumScreen>
  )
}

const styles = StyleSheet.create({
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: quantumSpace.sm },
  metricGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: quantumSpace.md },
  metricCard: { flexGrow: 1, flexBasis: '47%', minWidth: 148 },
  workflowRow: { flexDirection: 'row', alignItems: 'center', gap: quantumSpace.md },
})
