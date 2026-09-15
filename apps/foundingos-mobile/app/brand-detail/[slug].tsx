/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { useCallback, useEffect, useState } from 'react'
import { Image, RefreshControl, StyleSheet, View } from 'react-native'
import { useLocalSearchParams, router } from 'expo-router'
import { BRANDS } from '../../lib/brands'
import { fetchBrandMetrics, type BrandMetric } from '../../lib/api'
import { QuantumBackButton } from '../../components/QuantumBackButton'
import { CustomerJourneySection } from '../../components/CustomerJourneySection'
import { UsedCarShopSection } from '../../components/UsedCarShopSection'
import { QuantumButton, QuantumCard, QuantumLoadingScreen, QuantumMetric, QuantumNotice, QuantumScreen, QuantumSectionHeader, QuantumText, quantumSpace } from '../../components/QuantumUI'

export default function BrandDetailScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>()
  const brand = BRANDS.find((entry) => entry.slug === slug)
  const [metric, setMetric] = useState<BrandMetric | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState('')
  const [logoUnavailable, setLogoUnavailable] = useState(false)

  const load = useCallback(async (isRefresh = false) => {
    if (!brand) return
    if (isRefresh) setRefreshing(true)
    setError('')
    try {
      const rows = await fetchBrandMetrics()
      const match = rows.find((row) => row.brandName.toLowerCase().includes(brand.slug)) ?? null
      setMetric(match)
    } catch {
      setError('Could not load live activity. Pull down to try again.')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [brand])

  useEffect(() => {
    load()
  }, [load])

  if (!brand) return null
  if (loading) return <QuantumLoadingScreen />

  return (
    <QuantumScreen
      style={{ backgroundColor: brand.accent }}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => load(true)} tintColor={brand.accent} />}
    >
      <QuantumBackButton label="‹ Brands" />
      <QuantumCard accent={brand.accent}>
        <View style={styles.brandHero}>
          {logoUnavailable ? (
            <View style={[styles.logoFallback, { borderColor: brand.accent }]}>
              <QuantumText variant="h2" color={brand.accent} align="center">
                {brand.name.replace('Found', '').slice(0, 2).toUpperCase()}
              </QuantumText>
            </View>
          ) : (
            <Image source={brand.logo} resizeMode="contain" style={styles.logo} onError={() => setLogoUnavailable(true)} />
          )}
          <View style={styles.brandCopy}>
            <QuantumText variant="overline" color={brand.accent}>Brand shell</QuantumText>
            <QuantumText variant="h1">{brand.name}</QuantumText>
            <QuantumText color="#D8D8D8">{brand.tagline}</QuantumText>
          </View>
        </View>
      </QuantumCard>

      <QuantumSectionHeader label="Modules" />
      <View style={styles.grid}>
        {brand.modules.map((module) => (
          <QuantumButton key={module} tone="secondary" onPress={() => router.push(`/module-detail/${brand.slug}/${module.toLowerCase().replaceAll(' ', '-')}`)}>
            {module}
          </QuantumButton>
        ))}
      </View>

      <QuantumSectionHeader label="Live activity" />
      {error ? <QuantumNotice tone="danger">{error}</QuantumNotice> : metric ? (
        <QuantumCard accent={brand.accent}>
          <View style={styles.metricRow}>
            <QuantumMetric label="Engagement" value={metric.totalEngagement} tone="info" />
            <QuantumMetric label="Anomaly" value={metric.anomalyScore.toFixed(2)} tone={metric.anomalyScore > 0.55 ? 'watch' : 'good'} />
          </View>
          <QuantumText variant="caption" color="#D8D8D8">
            {Object.entries(metric.categoryBreakdown).map(([key, value]) => `${key}: ${value}`).join(' · ')}
          </QuantumText>
          <QuantumText variant="caption" color="#7F7F7F">Updated {new Date(metric.lastUpdated).toLocaleString('en-GB')}</QuantumText>
        </QuantumCard>
      ) : (
        <QuantumNotice>No activity yet.</QuantumNotice>
      )}

      <CustomerJourneySection accent={brand.accent} brandName={brand.name} />
      {brand.slug === 'retail' ? <UsedCarShopSection accent={brand.accent} /> : null}
    </QuantumScreen>
  )
}

const styles = StyleSheet.create({
  brandHero: { flexDirection: 'row', alignItems: 'center', gap: quantumSpace.md },
  brandCopy: { flex: 1, gap: quantumSpace.xs },
  logo: { width: 72, height: 72 },
  logoFallback: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: quantumSpace.sm },
  metricRow: { flexDirection: 'row', gap: quantumSpace.sm },
})
