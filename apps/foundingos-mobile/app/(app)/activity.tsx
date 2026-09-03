/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { useCallback, useEffect, useState } from 'react'
import { ScrollView, View, Text, StyleSheet, ActivityIndicator, RefreshControl } from 'react-native'
import { fetchBrandMetrics, type BrandMetric } from '../../lib/api'
import { BRANDS, FOUNDINGOS_ACCENT } from '../../lib/brands'

function accentFor(brandName: string): string {
  const match = BRANDS.find((b) => brandName.toLowerCase().includes(b.name.replace(/^Found/, '').toLowerCase()))
  return match?.accent ?? FOUNDINGOS_ACCENT
}

// Real, live module screen — this is genuinely the same engagement data (totalEngagement,
// anomalyScore, category breakdown, last updated) shown on the web SuperDash, fetched from
// the real /api/superdash/brand-metrics endpoint on every pull-to-refresh. No mock numbers.
export default function ActivityScreen() {
  const [metrics, setMetrics] = useState<BrandMetric[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState('')

  const load = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true)
    setError('')
    try {
      const rows = await fetchBrandMetrics()
      setMetrics(rows)
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
        <ActivityIndicator color={FOUNDINGOS_ACCENT} />
      </View>
    )
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ padding: 16, gap: 12 }}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => load(true)} tintColor={FOUNDINGOS_ACCENT} />}
    >
      <Text style={styles.intro}>Live engagement across every brand — pull down to refresh.</Text>
      {error ? <Text style={styles.error}>{error}</Text> : null}
      {metrics.length === 0 && !error ? <Text style={styles.empty}>No activity yet.</Text> : null}

      {metrics.map((brand) => (
        <View key={brand.brandName} style={[styles.card, { borderColor: accentFor(brand.brandName) }]}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>{brand.brandName}</Text>
            <Text style={[styles.engagement, { color: accentFor(brand.brandName) }]}>{brand.totalEngagement}</Text>
          </View>
          <Text style={styles.cardMeta}>Anomaly score: {brand.anomalyScore.toFixed(2)}</Text>
          <Text style={styles.cardMeta}>
            {Object.entries(brand.categoryBreakdown)
              .map(([key, value]) => `${key}: ${value}`)
              .join(' · ')}
          </Text>
          <Text style={styles.cardTime}>Updated {new Date(brand.lastUpdated).toLocaleString('en-GB')}</Text>
        </View>
      ))}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#05060a' },
  center: { flex: 1, backgroundColor: '#05060a', alignItems: 'center', justifyContent: 'center' },
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
