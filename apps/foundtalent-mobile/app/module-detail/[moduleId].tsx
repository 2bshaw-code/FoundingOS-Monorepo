/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { useCallback, useEffect, useState } from 'react'
import { ScrollView, View, Text, Pressable, StyleSheet, ActivityIndicator, RefreshControl } from 'react-native'
import { useLocalSearchParams, router } from 'expo-router'
import { BRAND, GROWTH_CONSOLE_URL } from '../../lib/brand'
import { authedFetch } from '../../lib/api'
import { AIHintBanner } from '../../components/AIHintBanner'

type ModuleMetric = { label: string; value: string; trend?: string; icon?: string; tone?: 'good' | 'watch' | 'risk' }
type ModuleData = { id: string; label: string; description: string; metrics: ModuleMetric[]; actions: string[]; workflow?: string[] }
type RecentAction = { id: string; action: string; sessionId: string; note: string | null; createdAt: string }

const TONE_COLOR: Record<string, string> = { good: '#00FF66', watch: '#FFDD00', risk: '#FF0033' }

function timeAgo(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime()
  const mins = Math.max(0, Math.round(diffMs / 60000))
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hours = Math.round(mins / 60)
  if (hours < 24) return `${hours}h ago`
  return `${Math.round(hours / 24)}d ago`
}

// Real NATIVE module screen — no browser, no WebView. Fetches this brand's real module data
// (the exact metrics/actions/workflow already authored in brand-config.ts) plus any real
// actions already recorded against it from GET ${GROWTH_CONSOLE_URL}/api/console/modules/[moduleId],
// Bearer-authenticated. Tapping a Quick Action POSTs to the same route, writing a real,
// durable Postgres row — this is real state, not a local-only toast, so it's visible to
// anyone (mobile or web) looking at this module next.
export default function ModuleDetailScreen() {
  const { moduleId } = useLocalSearchParams<{ moduleId: string }>()

  const [data, setData] = useState<ModuleData | null>(null)
  const [recentActions, setRecentActions] = useState<RecentAction[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState('')
  const [submittingAction, setSubmittingAction] = useState<string | null>(null)
  const [confirmedAction, setConfirmedAction] = useState<string | null>(null)

  const load = useCallback(async (isRefresh = false) => {
    if (!moduleId) return
    if (isRefresh) setRefreshing(true)
    setError('')
    try {
      const response = await authedFetch(`${GROWTH_CONSOLE_URL}/api/console/modules/${moduleId}`)
      if (!response.ok) {
        setError(response.status === 401 ? 'Your session has expired. Please sign in again.' : 'Could not load this module.')
        setData(null)
        return
      }
      const json = await response.json()
      setData(json.module)
      setRecentActions(Array.isArray(json.recentActions) ? json.recentActions : [])
    } catch {
      setError('Could not load this module. Pull down to try again.')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [moduleId])

  useEffect(() => {
    load()
  }, [load])

  // Real write-back — POSTs to this brand's own module route, which persists a real Postgres
  // row (module_actions). On success the new action is prepended locally (optimistic) and the
  // confirmation chip flashes; on failure the user sees a real error instead of a fake "noted".
  async function handleActionTap(action: string) {
    if (!moduleId || submittingAction) return
    setSubmittingAction(action)
    try {
      const response = await authedFetch(`${GROWTH_CONSOLE_URL}/api/console/modules/${moduleId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      })
      if (!response.ok) {
        setError('Could not save this action. Check your connection and try again.')
        return
      }
      const json = await response.json()
      if (json.action) setRecentActions((current) => [json.action, ...current].slice(0, 10))
      setConfirmedAction(action)
      setTimeout(() => setConfirmedAction((current) => (current === action ? null : current)), 2500)
    } catch {
      setError('Could not save this action. Check your connection and try again.')
    } finally {
      setSubmittingAction(null)
    }
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ padding: 16, paddingTop: 60, gap: 12 }}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => load(true)} tintColor={BRAND.accent} />}
    >
      <Pressable style={styles.back} onPress={() => router.back()}>
        <Text style={[styles.backText, { color: BRAND.accent }]}>‹ {BRAND.name}</Text>
      </Pressable>

      {loading ? (
        <ActivityIndicator color={BRAND.accent} />
      ) : error ? (
        <Text style={styles.error}>{error}</Text>
      ) : data ? (
        <>
          <View style={styles.hero}>
            <Text style={styles.title}>{data.label}</Text>
            <Text style={styles.subtitle}>{data.description}</Text>
          </View>

          <AIHintBanner
            accent={BRAND.accent}
            description={`${data.label}: ${data.description}`}
            recommendedAction={data.actions[0]?.toLowerCase() ?? 'review this module'}
            onDoThisForMe={() => data.actions[0] && handleActionTap(data.actions[0])}
          />

          <View style={styles.metricGrid}>
            {data.metrics.map((metric) => (
              <View key={metric.label} style={[styles.metricCard, { borderColor: TONE_COLOR[metric.tone ?? 'good'] }]}>
                <Text style={styles.metricLabel}>{metric.icon ? `${metric.icon} ` : ''}{metric.label}</Text>
                <Text style={styles.metricValue}>{metric.value}</Text>
                {metric.trend ? <Text style={styles.metricTrend}>{metric.trend}</Text> : null}
              </View>
            ))}
          </View>

          <Text style={styles.sectionLabel}>Quick actions</Text>
          <View style={styles.actionGrid}>
            {data.actions.map((action) => (
              <Pressable
                key={action}
                style={[styles.actionChip, { borderColor: BRAND.accent }, confirmedAction === action && { backgroundColor: BRAND.accent }]}
                onPress={() => handleActionTap(action)}
                disabled={submittingAction === action}
              >
                {submittingAction === action ? (
                  <ActivityIndicator size="small" color={BRAND.accent} />
                ) : (
                  <Text style={[styles.actionChipText, confirmedAction === action && { color: '#071014' }]}>
                    {confirmedAction === action ? `✓ ${action} saved` : action}
                  </Text>
                )}
              </Pressable>
            ))}
          </View>

          {recentActions.length > 0 ? (
            <>
              <Text style={styles.sectionLabel}>Recent activity</Text>
              {recentActions.map((entry) => (
                <View key={entry.id} style={styles.activityRow}>
                  <Text style={styles.activityText}>✓ {entry.action}</Text>
                  <Text style={styles.activityTime}>{timeAgo(entry.createdAt)}</Text>
                </View>
              ))}
            </>
          ) : null}

          {data.workflow && data.workflow.length > 0 ? (
            <>
              <Text style={styles.sectionLabel}>Workflow</Text>
              {data.workflow.map((step, index) => (
                <View key={step} style={styles.workflowRow}>
                  <View style={[styles.workflowDot, { backgroundColor: BRAND.accent }]}>
                    <Text style={styles.workflowDotText}>{index + 1}</Text>
                  </View>
                  <Text style={styles.workflowText}>{step}</Text>
                </View>
              ))}
            </>
          ) : null}
        </>
      ) : null}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F2942' },
  back: { marginBottom: 8 },
  backText: { fontSize: 15, fontWeight: '700' },
  hero: { marginBottom: 4 },
  title: { color: '#ffffff', fontSize: 24, fontWeight: '800' },
  subtitle: { color: '#b9c2cf', fontSize: 14, marginTop: 6 },
  error: { color: '#ff5470', fontSize: 13 },
  metricGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 8 },
  metricCard: { flexGrow: 1, minWidth: 140, backgroundColor: '#11161f', borderWidth: 1, borderRadius: 14, padding: 14, gap: 4 },
  metricLabel: { color: '#b9c2cf', fontSize: 12, fontWeight: '600' },
  metricValue: { color: '#ffffff', fontSize: 20, fontWeight: '800' },
  metricTrend: { color: '#5b6472', fontSize: 11 },
  sectionLabel: { color: '#b9c2cf', fontSize: 13, fontWeight: '600', marginTop: 10 },
  actionGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  actionChip: { borderWidth: 1, borderRadius: 999, paddingVertical: 8, paddingHorizontal: 14 },
  actionChipText: { color: '#ffffff', fontSize: 13, fontWeight: '600' },
  workflowRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  workflowDot: { width: 22, height: 22, borderRadius: 11, alignItems: 'center', justifyContent: 'center' },
  workflowDotText: { color: '#071014', fontSize: 12, fontWeight: '800' },
  workflowText: { color: '#ffffff', fontSize: 14, flex: 1 },
  activityRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 6, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.06)' },
  activityText: { color: '#ffffff', fontSize: 13, fontWeight: '600' },
  activityTime: { color: '#5b6472', fontSize: 11 },
})
