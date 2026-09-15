/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { useCallback, useEffect, useState } from 'react'
import { ScrollView, View, Text, Pressable, StyleSheet, ActivityIndicator, RefreshControl } from 'react-native'
import { BRAND, GROWTH_CONSOLE_URL } from '../../lib/brand'
import { authedFetch } from '../../lib/api'
import { useSavedProducts } from '../../lib/saved-products'
import { AIHintBanner } from '../../components/AIHintBanner'

type DiscoverProduct = {
  id: string
  name: string
  category: string
  icon: string
  priceUsd: number
  trendingScore: number
  likeCount: number
  badge: 'hot' | 'trending' | null
}

const BADGE_STYLE: Record<'hot' | 'trending', { label: string; bg: string; fg: string }> = {
  hot: { label: '🔥 Hot', bg: '#FF3B30', fg: '#ffffff' },
  trending: { label: '📈 Trending', bg: '#FFDD00', fg: '#071014' },
}

// Real NATIVE product-discovery feed — no browser, no WebView. Fetches this brand's own
// demo-mode discovery catalogue from GET ${GROWTH_CONSOLE_URL}/api/discover/feed,
// Bearer-authenticated, clearly labeled `mode: 'demo'` by the server. Saving/liking a product
// is an honest LOCAL-only action (see lib/saved-products.ts) — there is no backend "save"
// endpoint yet, so this never claims a real server-side save happened.
export default function DiscoverScreen() {
  const [products, setProducts] = useState<DiscoverProduct[]>([])
  const [mode, setMode] = useState<'demo' | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState('')
  const { isSaved, toggleSaved, loaded: savedLoaded } = useSavedProducts()

  const load = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true)
    setError('')
    try {
      const response = await authedFetch(`${GROWTH_CONSOLE_URL}/api/discover/feed`)
      if (!response.ok) {
        setError(response.status === 401 ? 'Your session has expired. Please sign in again.' : 'Could not load the discovery feed.')
        return
      }
      const json = await response.json()
      setProducts(json.products ?? [])
      setMode(json.mode ?? null)
    } catch {
      setError('Could not load the discovery feed. Pull down to try again.')
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
      contentContainerStyle={{ padding: 16, gap: 12, paddingBottom: 120}}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => load(true)} tintColor={BRAND.accent} />}
    >
      <View style={styles.hero}>
        <Text style={styles.heroTitle}>Discover</Text>
        <Text style={styles.heroSubtitle}>
          What's trending across {BRAND.name} right now
          {mode === 'demo' ? ' — demo catalogue' : ''}
        </Text>
      </View>

      <AIHintBanner
        accent={BRAND.accent}
        description="Products are ranked by live trending score — the hottest items surface first."
        recommendedAction="save the top pick"
        onDoThisForMe={() => products[0] && toggleSaved(products[0].id)}
      />

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <View style={styles.grid}>
        {products.map((product) => {
          const badge = product.badge ? BADGE_STYLE[product.badge] : null
          const saved = savedLoaded && isSaved(product.id)
          return (
            <View key={product.id} style={[styles.card, { borderColor: '#242c38' }]}>
              {badge ? (
                <View style={[styles.badge, { backgroundColor: badge.bg }]}>
                  <Text style={[styles.badgeText, { color: badge.fg }]}>{badge.label}</Text>
                </View>
              ) : null}
              <Text style={styles.cardIcon}>{product.icon}</Text>
              <Text style={styles.cardName} numberOfLines={2}>{product.name}</Text>
              <Text style={styles.cardCategory}>{product.category}</Text>
              <Text style={[styles.cardPrice, { color: BRAND.accent }]}>${product.priceUsd.toFixed(2)}</Text>
              <View style={styles.cardFooter}>
                <Text style={styles.cardLikes}>♥ {product.likeCount}</Text>
                <Pressable
                  style={[styles.saveButton, saved && { backgroundColor: BRAND.accent }]}
                  onPress={() => toggleSaved(product.id)}
                >
                  <Text style={[styles.saveButtonText, saved && { color: '#071014' }]}>
                    {saved ? '✓ Saved' : 'Save'}
                  </Text>
                </Pressable>
              </View>
            </View>
          )
        })}
      </View>
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
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  card: {
    width: '47%', backgroundColor: '#11161f', borderWidth: 1, borderRadius: 16, padding: 14, gap: 4,
  },
  badge: { position: 'absolute', top: 10, right: 10, borderRadius: 999, paddingVertical: 3, paddingHorizontal: 8, zIndex: 1 },
  badgeText: { fontSize: 10, fontWeight: '800' },
  cardIcon: { fontSize: 22, marginBottom: 2 },
  cardName: { color: '#ffffff', fontSize: 14, fontWeight: '700', minHeight: 36 },
  cardCategory: { color: '#5b6472', fontSize: 11 },
  cardPrice: { fontSize: 17, fontWeight: '800', marginTop: 2 },
  cardFooter: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 8 },
  cardLikes: { color: '#b9c2cf', fontSize: 12 },
  saveButton: { borderWidth: 1, borderColor: '#242c38', borderRadius: 999, paddingVertical: 5, paddingHorizontal: 10 },
  saveButtonText: { color: '#ffffff', fontSize: 11, fontWeight: '700' },
})
