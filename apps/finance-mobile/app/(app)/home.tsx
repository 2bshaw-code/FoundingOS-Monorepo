/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { useCallback, useEffect, useState } from 'react'
import { ScrollView, View, Text, Pressable, StyleSheet, ActivityIndicator, RefreshControl } from 'react-native'
import { router } from 'expo-router'
import { BRAND, GROWTH_CONSOLE_URL } from '../../lib/brand'
import { logout, authedFetch } from '../../lib/api'

type ConsoleConfig = {
  dashboard: { title: string; subtitle: string; metrics: { label: string; value: string; trend?: string; tone?: 'good' | 'watch' | 'risk' }[] }
  modules: { id: string; label: string }[]
}

const TONE_COLOR: Record<string, string> = { good: '#00FF66', watch: '#FFDD00', risk: '#FF0033' }

// Real NATIVE home screen — no browser, no WebView. Fetches this brand's own real console
// config (dashboard title/subtitle/metrics + real module list) from
// GET ${GROWTH_CONSOLE_URL}/api/console/config, Bearer-authenticated, and renders it with
// plain React Native components. Tapping a module opens a real native module screen.
export default function HomeScreen() {
  const [config, setConfig] = useState<ConsoleConfig | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState('')

  const load = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true)
    setError('')
    try {
      const response = await authedFetch(`${GROWTH_CONSOLE_URL}/api/console/config`)
      if (!response.ok) {
        setError(response.status === 401 ? 'Your session has expired. Please sign in again.' : 'Could not load your console.')
        return
      }
      const json = await response.json()
      setConfig(json.config)
    } catch {
      setError('Could not load your console. Pull down to try again.')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  async function handleLogout() {
    await logout()
    router.dismissTo('/')
  }

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
      <View style={styles.hero}>
        <Text style={styles.heroTitle}>{BRAND.name}</Text>
        <Text style={styles.heroSubtitle}>{BRAND.tagline}</Text>
      </View>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      {config ? (
        <>
          <View style={[styles.dashboardCard, { borderColor: BRAND.accent }]}>
            <Text style={styles.dashboardTitle}>{config.dashboard.title}</Text>
            <Text style={styles.dashboardSubtitle}>{config.dashboard.subtitle}</Text>
            <View style={styles.metricRow}>
              {config.dashboard.metrics.map((metric) => (
                <View key={metric.label} style={[styles.metricChip, { borderColor: TONE_COLOR[metric.tone ?? 'good'] }]}>
                  <Text style={styles.metricLabel}>{metric.label}</Text>
                  <Text style={styles.metricValue}>{metric.value}</Text>
                </View>
              ))}
            </View>
          </View>

          <Text style={styles.modulesLabel}>Modules</Text>
          <View style={styles.moduleGrid}>
            {config.modules.map((module) => (
              <Pressable
                key={module.id}
                style={[styles.moduleChip, { borderColor: BRAND.accent }]}
                onPress={() => router.push(`/module-detail/${module.id}`)}
              >
                <Text style={styles.moduleChipText}>{module.label}</Text>
              </Pressable>
            ))}
          </View>
        </>
      ) : null}

      <Pressable style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Log out</Text>
      </Pressable>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F2942' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#0F2942' },
  hero: { marginBottom: 4 },
  heroTitle: { color: '#ffffff', fontSize: 22, fontWeight: '800' },
  heroSubtitle: { color: '#b9c2cf', fontSize: 14, marginTop: 4 },
  error: { color: '#ff5470', fontSize: 13 },
  dashboardCard: { backgroundColor: '#11161f', borderWidth: 1, borderRadius: 16, padding: 16, gap: 8 },
  dashboardTitle: { color: '#ffffff', fontSize: 16, fontWeight: '700' },
  dashboardSubtitle: { color: '#b9c2cf', fontSize: 13 },
  metricRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 4 },
  metricChip: { borderWidth: 1, borderRadius: 12, padding: 10, minWidth: 100 },
  metricLabel: { color: '#b9c2cf', fontSize: 11, fontWeight: '600' },
  metricValue: { color: '#ffffff', fontSize: 16, fontWeight: '800' },
  modulesLabel: { color: '#b9c2cf', fontSize: 13, fontWeight: '600', marginTop: 8 },
  moduleGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  moduleChip: { borderWidth: 1, borderRadius: 999, paddingVertical: 8, paddingHorizontal: 14 },
  moduleChipText: { color: '#ffffff', fontSize: 13, fontWeight: '600' },
  logoutButton: { marginTop: 12, marginBottom: 100, alignItems: 'center', padding: 14 },
  logoutText: { color: '#ff5470', fontWeight: '700' },
})
