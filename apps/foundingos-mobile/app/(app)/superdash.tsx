/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { useCallback, useEffect, useState } from 'react'
import { ScrollView, View, Text, StyleSheet, ActivityIndicator, RefreshControl } from 'react-native'
import { fetchSuperDashOverview, fetchBrandMetrics, type SuperDashOverview, type BrandMetric } from '../../lib/api'
import { FOUNDINGOS_ACCENT } from '../../lib/brands'

const TONE_COLOR: Record<string, string> = { good: '#00FF66', watch: '#FFDD00', risk: '#FF0033' }

// Real NATIVE SuperDashboard — no browser, no WebView. Pulls the exact same real data the
// web SuperDashboard renders: the brand performance matrix (marketing/accounting/service
// load/messaging/AI actions per brand), predictive insights, anomalies, and live cross-brand
// engagement (see apps/foundingos-console/app/api/superdash/overview and
// /api/superdash/brand-metrics) — rendered with real React Native components.
export default function SuperDashScreen() {
  const [overview, setOverview] = useState<SuperDashOverview | null>(null)
  const [metrics, setMetrics] = useState<BrandMetric[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState('')

  const load = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true)
    setError('')
    try {
      const [overviewData, metricsData] = await Promise.all([fetchSuperDashOverview(), fetchBrandMetrics()])
      if (!overviewData) {
        setError('Could not load SuperDashboard. Your session may have expired.')
      }
      setOverview(overviewData)
      setMetrics(metricsData)
    } catch {
      setError('Could not load SuperDashboard. Pull down to try again.')
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
      contentContainerStyle={{ padding: 16, gap: 14 }}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => load(true)} tintColor={FOUNDINGOS_ACCENT} />}
    >
      {error ? <Text style={styles.error}>{error}</Text> : null}

      {overview ? (
        <>
          <Text style={styles.sectionLabel}>Brand performance matrix</Text>
          {overview.brandRows.map((row) => (
            <View key={row.brand} style={[styles.card, { borderColor: TONE_COLOR[row.status] }]}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>{row.brand}</Text>
                <View style={[styles.statusDot, { backgroundColor: TONE_COLOR[row.status] }]} />
              </View>
              <View style={styles.statRow}>
                <Text style={styles.statText}>Marketing {row.marketing}%</Text>
                <Text style={styles.statText}>Accounting {row.accounting}%</Text>
              </View>
              <View style={styles.statRow}>
                <Text style={styles.statText}>Service load {row.serviceLoad} ({row.serviceLoad >= row.previousServiceLoad ? '▲' : '▼'} from {row.previousServiceLoad})</Text>
              </View>
              <View style={styles.statRow}>
                <Text style={styles.statText}>{row.messaging} messages</Text>
                <Text style={styles.statText}>{row.aiActions} AI actions</Text>
              </View>
            </View>
          ))}

          <Text style={styles.sectionLabel}>Predictive insights</Text>
          {overview.predictiveInsights.map((insight) => (
            <View key={insight} style={styles.insightCard}>
              <Text style={styles.insightText}>{insight}</Text>
            </View>
          ))}

          <Text style={styles.sectionLabel}>Anomalies</Text>
          {overview.anomalies.map((anomaly) => (
            <View key={anomaly.brand + anomaly.signal} style={[styles.card, { borderColor: TONE_COLOR[anomaly.tone] }]}>
              <Text style={styles.cardTitle}>{anomaly.brand}</Text>
              <Text style={styles.statText}>{anomaly.signal}</Text>
            </View>
          ))}

          <Text style={styles.sectionLabel}>30-day forecast</Text>
          <View style={[styles.card, { borderColor: FOUNDINGOS_ACCENT }]}>
            <Text style={styles.statText}>Revenue {overview.forecastByHorizon['30d'].combinedRevenueTrend}</Text>
            <Text style={styles.statText}>Service load {overview.forecastByHorizon['30d'].combinedServiceLoadTrend}</Text>
            <Text style={styles.statText}>Confidence {overview.forecastByHorizon['30d'].confidence}</Text>
          </View>
        </>
      ) : null}

      <Text style={styles.sectionLabel}>Live engagement</Text>
      {metrics.map((metric) => (
        <View key={metric.brandName} style={[styles.card, { borderColor: FOUNDINGOS_ACCENT }]}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>{metric.brandName}</Text>
            <Text style={[styles.engagement, { color: FOUNDINGOS_ACCENT }]}>{metric.totalEngagement}</Text>
          </View>
          <Text style={styles.statText}>Anomaly score {metric.anomalyScore.toFixed(2)}</Text>
        </View>
      ))}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F2942' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#0F2942' },
  error: { color: '#ff5470', fontSize: 13 },
  sectionLabel: { color: '#b9c2cf', fontSize: 13, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.4, marginTop: 6 },
  card: { backgroundColor: '#11161f', borderWidth: 1, borderRadius: 14, padding: 14, gap: 6 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardTitle: { color: '#ffffff', fontSize: 15, fontWeight: '700' },
  statusDot: { width: 10, height: 10, borderRadius: 5 },
  statRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 12 },
  statText: { color: '#b9c2cf', fontSize: 12 },
  insightCard: { backgroundColor: '#11161f', borderRadius: 12, padding: 12 },
  insightText: { color: '#ffffff', fontSize: 13 },
  engagement: { fontSize: 18, fontWeight: '800' },
})
