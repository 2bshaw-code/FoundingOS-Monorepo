/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { useCallback, useEffect, useState } from 'react'
import { ScrollView, View, Text, Pressable, StyleSheet, ActivityIndicator, RefreshControl } from 'react-native'
import { router } from 'expo-router'
import { LinearGradient } from 'expo-linear-gradient'
import { BRAND, GROWTH_CONSOLE_URL } from '../../lib/brand'
import { logout, authedFetch } from '../../lib/api'
import { fetchEntitlements, trialDaysRemaining, type Entitlements, type TrialInfo } from '../../lib/entitlements'
import { AIOnboardingCard } from '../../components/AIOnboardingCard'
import { QuantumSphere } from '../../components/QuantumSphere'

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
  const [entitlements, setEntitlements] = useState<Entitlements | null>(null)
  const [trial, setTrial] = useState<TrialInfo | null>(null)
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
      // Fails open (null -> every module shown) on any entitlements error, so a transient
      // network hiccup never locks a real, paying user out of modules they already own.
      const result = await fetchEntitlements()
      setEntitlements(result?.entitlements ?? null)
      setTrial(result?.trial ?? null)
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

  const firstModule = config?.modules[0]

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
      contentContainerStyle={{ paddingBottom: 140 }}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => load(true)} tintColor={BRAND.accent} />}
    >
      <LinearGradient
        colors={[`${BRAND.accent}33`, 'transparent']}
        style={styles.heroGradient}
      >
        <View style={styles.heroRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.heroEyebrow}>Welcome back</Text>
            <Text style={styles.heroTitle}>{BRAND.name}</Text>
            <Text style={styles.heroSubtitle}>{BRAND.tagline}</Text>
          </View>
          <QuantumSphere size={56} accent={BRAND.accent} />
        </View>
      </LinearGradient>

      <View style={{ paddingHorizontal: 16, gap: 12 }}>

      <AIOnboardingCard
        accent={BRAND.accent}
        brandKey={`${BRAND.slug}-home`}
        brandName={BRAND.name}
        description={`This is your ${BRAND.name} console — ${BRAND.tagline.toLowerCase()} Tap a module below to dive in.`}
        actionLabel={firstModule ? `open ${firstModule.label}` : undefined}
        onDoThisForMe={firstModule ? () => router.push(`/module-detail/${firstModule.id}`) : undefined}
      />

      {error ? <Text style={styles.error}>{error}</Text> : null}

      {trialDaysRemaining(trial) !== null ? (
        <View style={[styles.trialBanner, { borderColor: BRAND.accent }]}>
          <Text style={styles.trialBannerText}>
            🎁 Free trial — {trialDaysRemaining(trial)} day{trialDaysRemaining(trial) === 1 ? '' : 's'} left with full access to every module and bolt-on
          </Text>
        </View>
      ) : null}

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
            {config.modules.map((module) => {
              // Fail-open: if entitlements couldn't load, or this module isn't in the tier
              // list at all (shouldn't happen — brand-config and entitlements share the same
              // module names — but never lock a module we don't explicitly recognize as locked).
              const isLocked = entitlements ? entitlements.lockedModules.includes(module.id) : false
              return (
                <Pressable
                  key={module.id}
                  style={[styles.moduleChip, { borderColor: isLocked ? '#3a4150' : BRAND.accent }, isLocked && styles.moduleChipLocked]}
                  onPress={() => (isLocked ? router.push('/upgrade') : router.push(`/module-detail/${module.id}`))}
                >
                  <Text style={[styles.moduleChipText, isLocked && styles.moduleChipTextLocked]}>
                    {isLocked ? `🔒 ${module.label}` : module.label}
                  </Text>
                </Pressable>
              )
            })}
          </View>
          {entitlements && entitlements.tier !== 'Enterprise' ? (
            <Pressable style={styles.upgradeBanner} onPress={() => router.push('/upgrade')}>
              <Text style={styles.upgradeBannerText}>
                {entitlements.tier === 'Starter' ? 'On Starter' : 'On Growth'} — unlock every {BRAND.name} module and AI bolt-on
              </Text>
              <Text style={[styles.upgradeBannerCta, { color: BRAND.accent }]}>Upgrade →</Text>
            </Pressable>
          ) : null}
        </>
      ) : null}

      <Pressable style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Log out</Text>
      </Pressable>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0b0e14' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#0b0e14' },
  heroGradient: { paddingTop: 8, paddingBottom: 20, paddingHorizontal: 16 },
  heroRow: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  heroEyebrow: { color: '#7c8797', fontSize: 12, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.8 },
  heroTitle: { color: '#ffffff', fontSize: 28, fontWeight: '800', marginTop: 2 },
  heroSubtitle: { color: '#b9c2cf', fontSize: 14, marginTop: 4 },
  error: { color: '#ff5470', fontSize: 13 },
  dashboardCard: { backgroundColor: '#11161f', borderWidth: 1, borderRadius: 20, padding: 18, gap: 10, shadowColor: '#000', shadowOpacity: 0.25, shadowRadius: 16, shadowOffset: { width: 0, height: 6 }, elevation: 6 },
  dashboardTitle: { color: '#ffffff', fontSize: 17, fontWeight: '800' },
  dashboardSubtitle: { color: '#b9c2cf', fontSize: 13 },
  metricRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 6 },
  metricChip: { borderWidth: 1, borderRadius: 14, padding: 12, minWidth: 100, backgroundColor: 'rgba(255,255,255,0.03)' },
  metricLabel: { color: '#b9c2cf', fontSize: 11, fontWeight: '600' },
  metricValue: { color: '#ffffff', fontSize: 18, fontWeight: '800', marginTop: 2 },
  modulesLabel: { color: '#7c8797', fontSize: 12, fontWeight: '700', marginTop: 10, textTransform: 'uppercase', letterSpacing: 0.6 },
  moduleGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  moduleChip: { borderWidth: 1, borderRadius: 999, paddingVertical: 10, paddingHorizontal: 16, backgroundColor: 'rgba(255,255,255,0.03)' },
  moduleChipLocked: { backgroundColor: 'rgba(255,255,255,0.015)' },
  moduleChipText: { color: '#ffffff', fontSize: 13, fontWeight: '600' },
  moduleChipTextLocked: { color: '#7c8797' },
  upgradeBanner: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#11161f', borderWidth: 1, borderColor: '#3a4150', borderRadius: 16, padding: 14, marginTop: 4 },
  upgradeBannerText: { color: '#b9c2cf', fontSize: 12, fontWeight: '600', flex: 1, marginRight: 8 },
  upgradeBannerCta: { fontSize: 13, fontWeight: '800' },
  trialBanner: { backgroundColor: '#11161f', borderWidth: 1, borderRadius: 16, padding: 14, marginBottom: 8 },
  trialBannerText: { color: '#e7ecf3', fontSize: 12, fontWeight: '700' },
  logoutButton: { marginTop: 12, marginBottom: 100, alignItems: 'center', padding: 14 },
  logoutText: { color: '#ff5470', fontWeight: '700' },
})
