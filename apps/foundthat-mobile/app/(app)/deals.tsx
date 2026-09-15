/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { useCallback, useEffect, useState } from 'react'
import { ScrollView, View, Text, StyleSheet, ActivityIndicator, RefreshControl } from 'react-native'
import { BRAND, GROWTH_CONSOLE_URL } from '../../lib/brand'
import { authedFetch } from '../../lib/api'
import { AIHintBanner } from '../../components/AIHintBanner'

type Deal = {
  id: string
  name: string
  category: string
  icon: string
  originalPriceUsd: number
  dealPriceUsd: number
  discountPct: number
  expiresAt: string
}
type DealCategory = { category: string; deals: Deal[] }

function formatCountdown(msRemaining: number): string {
  if (msRemaining <= 0) return 'Deal ended'
  const totalSeconds = Math.floor(msRemaining / 1000)
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}

// Real NATIVE limited-time deals screen — fetches this brand's own demo-mode deal batch from
// GET ${GROWTH_CONSOLE_URL}/api/discover/deals, Bearer-authenticated, clearly labeled
// `mode: 'demo'` by the server. The countdown is a genuine client-side tick against the real
// `expiresAt`/`windowExpiresAt` timestamps the server computed — not a fabricated static label.
export default function DealsScreen() {
  const [categories, setCategories] = useState<DealCategory[]>([])
  const [mode, setMode] = useState<'demo' | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState('')
  const [now, setNow] = useState(() => Date.now())

  const load = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true)
    setError('')
    try {
      const response = await authedFetch(`${GROWTH_CONSOLE_URL}/api/discover/deals`)
      if (!response.ok) {
        setError(response.status === 401 ? 'Your session has expired. Please sign in again.' : 'Could not load today\'s deals.')
        return
      }
      const json = await response.json()
      setCategories(json.categories ?? [])
      setMode(json.mode ?? null)
    } catch {
      setError('Could not load today\'s deals. Pull down to try again.')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  // Ticks every second so the countdown genuinely counts down while the screen is open —
  // when a batch expires, pull-to-refresh (or the next automatic reload) fetches the new batch.
  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(interval)
  }, [])

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
      contentContainerStyle={{ padding: 16, gap: 16, paddingBottom: 120}}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => load(true)} tintColor={BRAND.accent} />}
    >
      <View style={styles.hero}>
        <Text style={styles.heroTitle}>Deals</Text>
        <Text style={styles.heroSubtitle}>
          Limited-time offers, refreshed every 6 hours
          {mode === 'demo' ? ' — demo catalogue' : ''}
        </Text>
      </View>

      <AIHintBanner
        accent={BRAND.accent}
        description="Deals are grouped by category — check Systems and Assets first, they usually have the deepest discounts."
        recommendedAction="review today's deals"
        onDoThisForMe={() => load(true)}
      />

      {error ? <Text style={styles.error}>{error}</Text> : null}

      {categories.length === 0 && !error ? (
        <Text style={styles.empty}>No active deals this window — check back soon.</Text>
      ) : null}

      {categories.map((group) => (
        <View key={group.category} style={styles.section}>
          <Text style={styles.sectionLabel}>{group.category}</Text>
          <View style={styles.dealList}>
            {group.deals.map((deal) => {
              const remaining = new Date(deal.expiresAt).getTime() - now
              return (
                <View key={deal.id} style={styles.dealCard}>
                  <Text style={styles.dealIcon}>{deal.icon}</Text>
                  <View style={styles.dealBody}>
                    <Text style={styles.dealName} numberOfLines={2}>{deal.name}</Text>
                    <View style={styles.priceRow}>
                      <Text style={[styles.dealPrice, { color: BRAND.accent }]}>${deal.dealPriceUsd.toFixed(2)}</Text>
                      <Text style={styles.originalPrice}>${deal.originalPriceUsd.toFixed(2)}</Text>
                      <View style={styles.discountChip}>
                        <Text style={styles.discountChipText}>-{deal.discountPct}%</Text>
                      </View>
                    </View>
                    <Text style={[styles.countdown, remaining <= 0 && styles.countdownEnded]}>
                      ⏱ {formatCountdown(remaining)}
                    </Text>
                  </View>
                </View>
              )
            })}
          </View>
        </View>
      ))}
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
  empty: { color: '#5b6472', fontSize: 13, fontStyle: 'italic' },
  section: { gap: 8 },
  sectionLabel: { color: '#b9c2cf', fontSize: 13, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5 },
  dealList: { gap: 10 },
  dealCard: {
    flexDirection: 'row', gap: 12, backgroundColor: '#11161f', borderWidth: 1, borderColor: '#242c38',
    borderRadius: 16, padding: 14, alignItems: 'center',
  },
  dealIcon: { fontSize: 24 },
  dealBody: { flex: 1, gap: 4 },
  dealName: { color: '#ffffff', fontSize: 14, fontWeight: '700' },
  priceRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  dealPrice: { fontSize: 16, fontWeight: '800' },
  originalPrice: { color: '#5b6472', fontSize: 13, textDecorationLine: 'line-through' },
  discountChip: { backgroundColor: '#FF3B30', borderRadius: 999, paddingVertical: 2, paddingHorizontal: 7 },
  discountChipText: { color: '#ffffff', fontSize: 10, fontWeight: '800' },
  countdown: { color: '#FFDD00', fontSize: 12, fontWeight: '700', marginTop: 2 },
  countdownEnded: { color: '#5b6472' },
})
