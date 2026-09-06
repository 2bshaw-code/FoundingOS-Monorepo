/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { useCallback, useEffect, useState } from 'react'
import { RefreshControl, StyleSheet, View } from 'react-native'
import { fetchBrandMetrics, type BrandMetric } from '../../lib/api'
import { BRANDS, FOUNDINGOS_ACCENT } from '../../lib/brands'
import { QuantumCard, QuantumLoadingScreen, QuantumMetric, QuantumNotice, QuantumScreen, QuantumSectionHeader, QuantumText, quantumSpace } from '../../components/QuantumUI'

function accentFor(brandName: string): string {
  const match = BRANDS.find((brand) => brandName.toLowerCase().includes(brand.name.replace(/^Found/, '').toLowerCase()))
  return match?.accent ?? FOUNDINGOS_ACCENT
}

export default function ActivityScreen() {
  const [metrics, setMetrics] = useState<BrandMetric[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState('')

  const load = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true)
    setError('')
    try {
      setMetrics(await fetchBrandMetrics())
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

  if (loading) return <QuantumLoadingScreen />

  return (
    <QuantumScreen refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => load(true)} tintColor={FOUNDINGOS_ACCENT} />}>
      <QuantumSectionHeader label="Live engagement" />
      {error ? <QuantumNotice tone="danger">{error}</QuantumNotice> : null}
      {metrics.length === 0 && !error ? <QuantumNotice>No activity yet.</QuantumNotice> : null}
      {metrics.map((metric) => {
        const accent = accentFor(metric.brandName)
        return (
          <QuantumCard key={metric.brandName} accent={accent}>
            <View style={styles.metricRow}>
              <QuantumMetric label={metric.brandName} value={metric.totalEngagement} tone="info" />
              <QuantumMetric label="Anomaly" value={metric.anomalyScore.toFixed(2)} tone={metric.anomalyScore > 0.55 ? 'watch' : 'good'} />
            </View>
            <QuantumText variant="caption">
              {Object.entries(metric.categoryBreakdown).map(([key, value]) => `${key}: ${value}`).join(' · ')}
            </QuantumText>
            <QuantumText variant="caption" color="#7F7F7F">Updated {new Date(metric.lastUpdated).toLocaleString('en-GB')}</QuantumText>
          </QuantumCard>
        )
      })}
    </QuantumScreen>
  )
}

const styles = StyleSheet.create({
  metricRow: { flexDirection: 'row', gap: quantumSpace.sm },
})
