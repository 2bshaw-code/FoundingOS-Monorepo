/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { useCallback, useEffect, useState } from 'react'
import { ScrollView, View, Text, Pressable, StyleSheet, ActivityIndicator, RefreshControl } from 'react-native'
import { useLocalSearchParams, router } from 'expo-router'
import * as WebBrowser from 'expo-web-browser'
import { BRANDS } from '../../lib/brands'
import { fetchBrandMetrics, getHandoffUrl, type BrandMetric } from '../../lib/api'

// Real per-brand drill-down — the founder's dashboard card for a brand now opens here
// instead of doing nothing. Shows that one brand's real tagline/modules plus its real live
// activity numbers (engagement, anomaly score, category breakdown), pulled from the same
// /api/superdash/brand-metrics feed as the aggregated Activity tab, just filtered to one row.
// Tapping a module chip opens that brand's real, live module page in-app via the SSO handoff.
export default function BrandDetailScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>()
  const brand = BRANDS.find((entry) => entry.slug === slug)

  const [metric, setMetric] = useState<BrandMetric | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState('')

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

  async function openModule(module: string) {
    if (!brand) return
    const moduleId = module.toLowerCase().replaceAll(' ', '-')
    const consoleUrl = `https://${brand.slug}-console.foundingos.com/modules/${moduleId}`
    const url = await getHandoffUrl(consoleUrl)
    await WebBrowser.openBrowserAsync(url, { controlsColor: brand.accent, toolbarColor: '#05060a' })
  }

  if (!brand) return null

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ padding: 16, paddingTop: 60, gap: 12 }}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => load(true)} tintColor={brand.accent} />}
    >
      <Pressable style={styles.back} onPress={() => router.back()}>
        <Text style={[styles.backText, { color: brand.accent }]}>‹ Brands</Text>
      </Pressable>

      <View style={styles.hero}>
        <View style={[styles.dot, { backgroundColor: brand.accent }]} />
        <Text style={styles.title}>{brand.name}</Text>
        <Text style={styles.subtitle}>{brand.tagline}</Text>
      </View>

      <View style={styles.moduleGrid}>
        {brand.modules.map((module) => (
          <Pressable key={module} style={[styles.moduleChip, { borderColor: brand.accent }]} onPress={() => openModule(module)}>
            <Text style={styles.moduleChipText}>{module}</Text>
          </Pressable>
        ))}
      </View>

      <Text style={styles.sectionLabel}>Live activity</Text>
      {loading ? (
        <ActivityIndicator color={brand.accent} />
      ) : error ? (
        <Text style={styles.error}>{error}</Text>
      ) : metric ? (
        <View style={[styles.card, { borderColor: brand.accent }]}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Total engagement</Text>
            <Text style={[styles.engagement, { color: brand.accent }]}>{metric.totalEngagement}</Text>
          </View>
          <Text style={styles.cardMeta}>Anomaly score: {metric.anomalyScore.toFixed(2)}</Text>
          <Text style={styles.cardMeta}>
            {Object.entries(metric.categoryBreakdown)
              .map(([key, value]) => `${key}: ${value}`)
              .join(' · ')}
          </Text>
          <Text style={styles.cardTime}>Updated {new Date(metric.lastUpdated).toLocaleString('en-GB')}</Text>
        </View>
      ) : (
        <Text style={styles.empty}>No activity yet.</Text>
      )}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#05060a' },
  back: { marginBottom: 8 },
  backText: { fontSize: 15, fontWeight: '700' },
  hero: { alignItems: 'center', marginBottom: 8 },
  dot: { width: 14, height: 14, borderRadius: 7, marginBottom: 12 },
  title: { color: '#ffffff', fontSize: 24, fontWeight: '800' },
  subtitle: { color: '#b9c2cf', fontSize: 14, marginTop: 4, textAlign: 'center' },
  moduleGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, justifyContent: 'center' },
  moduleChip: { borderWidth: 1, borderRadius: 999, paddingVertical: 6, paddingHorizontal: 12 },
  moduleChipText: { color: '#ffffff', fontSize: 12, fontWeight: '600' },
  sectionLabel: { color: '#b9c2cf', fontSize: 13, fontWeight: '600', marginTop: 8 },
  error: { color: '#ff5470', fontSize: 13 },
  empty: { color: '#b9c2cf', fontSize: 13 },
  card: { backgroundColor: '#11161f', borderWidth: 1, borderRadius: 16, padding: 16, gap: 4 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardTitle: { color: '#ffffff', fontSize: 16, fontWeight: '700' },
  engagement: { fontSize: 20, fontWeight: '800' },
  cardMeta: { color: '#b9c2cf', fontSize: 12 },
  cardTime: { color: '#5b6472', fontSize: 11, marginTop: 4 },
})
