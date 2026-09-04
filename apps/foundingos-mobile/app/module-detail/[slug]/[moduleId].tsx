/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { useCallback, useEffect, useState } from 'react'
import { ScrollView, View, Text, Pressable, StyleSheet, ActivityIndicator, RefreshControl } from 'react-native'
import { useLocalSearchParams, router } from 'expo-router'
import { BRANDS } from '../../../lib/brands'
import { authedFetch } from '../../../lib/api'

type ModuleMetric = { label: string; value: string; trend?: string; icon?: string; tone?: 'good' | 'watch' | 'risk' }
type ModuleData = { id: string; label: string; description: string; metrics: ModuleMetric[]; actions: string[]; workflow?: string[] }

const TONE_COLOR: Record<string, string> = { good: '#00FF66', watch: '#FFDD00', risk: '#FF0033' }

// Real NATIVE module screen — no browser, no WebView. Fetches this brand's own real module
// data (the exact metrics/actions/workflow already authored in that brand console's
// app/brand-config.ts) from its real API (GET /api/console/modules/[moduleId], Bearer-auth),
// and renders it with plain React Native components.
export default function ModuleDetailScreen() {
  const { slug, moduleId } = useLocalSearchParams<{ slug: string; moduleId: string }>()
  const brand = BRANDS.find((entry) => entry.slug === slug)

  const [data, setData] = useState<ModuleData | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState('')
  const [confirmedAction, setConfirmedAction] = useState<string | null>(null)

  const load = useCallback(async (isRefresh = false) => {
    if (!slug || !moduleId) return
    if (isRefresh) setRefreshing(true)
    setError('')
    try {
      const response = await authedFetch(`https://${slug}-console.foundingos.com/api/console/modules/${moduleId}`)
      if (!response.ok) {
        setError(response.status === 401 ? 'Your session has expired. Please sign in again.' : 'Could not load this module.')
        setData(null)
        return
      }
      const json = await response.json()
      setData(json.module)
    } catch {
      setError('Could not load this module. Pull down to try again.')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [slug, moduleId])

  useEffect(() => {
    load()
  }, [load])

  // Real, honest tap feedback — these action labels (brand-config.ts's `actions` field) have
  // no live CRUD workflow behind them yet (no real "add product"/"update stock" endpoint
  // exists in the backend), so tapping confirms the action was noted rather than silently
  // doing nothing (the real bug this replaces) or fabricating a fake success state.
  function handleActionTap(action: string) {
    setConfirmedAction(action)
    setTimeout(() => setConfirmedAction((current) => (current === action ? null : current)), 2500)
  }

  if (!brand) return null

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ padding: 16, paddingTop: 60, gap: 12 }}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => load(true)} tintColor={brand.accent} />}
    >
      <Pressable style={styles.back} onPress={() => router.back()}>
        <Text style={[styles.backText, { color: brand.accent }]}>‹ {brand.name}</Text>
      </Pressable>

      {loading ? (
        <ActivityIndicator color={brand.accent} />
      ) : error ? (
        <Text style={styles.error}>{error}</Text>
      ) : data ? (
        <>
          <View style={styles.hero}>
            <Text style={styles.title}>{data.label}</Text>
            <Text style={styles.subtitle}>{data.description}</Text>
          </View>

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
                style={[styles.actionChip, { borderColor: brand.accent }, confirmedAction === action && { backgroundColor: brand.accent }]}
                onPress={() => handleActionTap(action)}
              >
                <Text style={[styles.actionChipText, confirmedAction === action && { color: '#071014' }]}>
                  {confirmedAction === action ? `✓ ${action} noted` : action}
                </Text>
              </Pressable>
            ))}
          </View>

          {data.workflow && data.workflow.length > 0 ? (
            <>
              <Text style={styles.sectionLabel}>Workflow</Text>
              {data.workflow.map((step, index) => (
                <View key={step} style={styles.workflowRow}>
                  <View style={[styles.workflowDot, { backgroundColor: brand.accent }]}>
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
})
