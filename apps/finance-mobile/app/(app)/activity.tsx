/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { useCallback, useEffect, useState } from 'react'
import { ScrollView, View, Text, StyleSheet, ActivityIndicator, RefreshControl } from 'react-native'
import { fetchOwnBrandMetric, type BrandMetric } from '../../lib/api'
import { BRAND } from '../../lib/brand'

// Real, live module screen — the same engagement data (totalEngagement, anomalyScore,
// category breakdown, last updated) shown on the web SuperDash, filtered to just FoundFinance,
// fetched from the real /api/superdash/brand-metrics endpoint on every pull-to-refresh.
export default function ActivityScreen() {
  const [metric, setMetric] = useState<BrandMetric | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState('')

  const load = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true)
    setError('')
    try {
      const row = await fetchOwnBrandMetric()
      setMetric(row)
    } catch {
      setError('Could not load live activity. Pull down to try again.')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={BRAND.accent} />
      </View>
    )
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ padding: 16, gap: 12 }}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => load(true)} tintColor={BRAND.accent} />}
    >
      <Text style={styles.intro}>Live engagement for {BRAND.name} — pull down to refresh.</Text>
      {error ? <Text style={styles.error}>{error}</Text> : null}
      {!metric && !error ? <Text style={styles.empty}>No activity yet.</Text> : null}

      {metric ? (
        <View style={[styles.card, { borderColor: BRAND.accent }]}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>{metric.brandName}</Text>
            <Text style={[styles.engagement, { color: BRAND.accent }]}>{metric.totalEngagement}</Text>
          </View>
          <Text style={styles.cardMeta}>Anomaly score: {metric.anomalyScore.toFixed(2)}</Text>
          <Text style={styles.cardMeta}>
            {Object.entries(metric.categoryBreakdown)
              .map(([key, value]) => `${key}: ${value}`)
              .join(' · ')}
          </Text>
          <Text style={styles.cardTime}>Updated {new Date(metric.lastUpdated).toLocaleString('en-GB')}</Text>
        </View>
      ) : null}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F2942' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#0F2942' },
  intro: { color: '#b9c2cf', fontSize: 13, marginBottom: 4 },
  error: { color: '#ff5470', fontSize: 13 },
  empty: { color: '#b9c2cf', fontSize: 13 },
  card: { backgroundColor: '#11161f', borderWidth: 1, borderRadius: 16, padding: 16, gap: 4 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardTitle: { color: '#ffffff', fontSize: 16, fontWeight: '700' },
  engagement: { fontSize: 20, fontWeight: '800' },
  cardMeta: { color: '#b9c2cf', fontSize: 12 },
  cardTime: { color: '#5b6472', fontSize: 11, marginTop: 4 },
})
