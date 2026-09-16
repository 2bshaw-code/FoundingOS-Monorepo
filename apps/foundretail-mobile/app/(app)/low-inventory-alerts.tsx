/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { useCallback, useState } from 'react'
import { ScrollView, View, Text, StyleSheet, ActivityIndicator, RefreshControl } from 'react-native'
import { useFocusEffect } from 'expo-router'
import { BRAND } from '../../lib/brand'
import { fetchLowInventoryPredictions, type LowInventoryPrediction } from '../../lib/core-api'

// Surfaces the predictLowInventory AI automation (core-operations/backend) as a
// push-notification-ready screen. Actual push delivery is handled by the
// platform's expo-notifications wiring at the app-shell level; this screen is
// the in-app destination those notifications deep-link into.
export default function LowInventoryAlertsScreen() {
  const [predictions, setPredictions] = useState<LowInventoryPrediction[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState('')

  const load = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true)
    setError('')
    try {
      const data = await fetchLowInventoryPredictions()
      if (data === null) { setError('Could not check stock levels. Pull down to try again.'); return }
      setPredictions(data)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [])

  useFocusEffect(useCallback(() => { load() }, [load]))

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
      contentContainerStyle={{ padding: 16, gap: 10, paddingBottom: 120 }}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => load(true)} tintColor={BRAND.accent} />}
    >
      <Text style={styles.title}>Low Inventory Alerts</Text>
      <Text style={styles.subtitle}>AI-predicted stockouts from recent sales velocity.</Text>
      {error ? <Text style={styles.error}>{error}</Text> : null}
      {!error && predictions.length === 0 ? <Text style={styles.empty}>No stockouts predicted in the next 7 days.</Text> : null}
      {predictions.map((prediction) => (
        <View key={prediction.variantId} style={styles.card}>
          <Text style={styles.cardTitle}>{prediction.label}</Text>
          <Text style={styles.cardMeta}>{prediction.stock} on hand · selling ~{prediction.dailyRunRate}/day</Text>
          <Text style={styles.cardMeta}>
            {prediction.daysUntilStockout !== null ? `${prediction.daysUntilStockout} days until stockout` : 'No recent sales velocity'}
            {' · '}Suggested restock: {prediction.suggestedRestockQuantity}
          </Text>
        </View>
      ))}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F2942' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#0F2942' },
  title: { color: '#ffffff', fontSize: 24, fontWeight: '800' },
  subtitle: { color: '#b9c2cf', fontSize: 13 },
  error: { color: '#ff5470', fontSize: 13 },
  empty: { color: '#b9c2cf', fontSize: 13 },
  card: { backgroundColor: '#11161f', borderWidth: 1, borderColor: '#FF0033', borderRadius: 16, padding: 14, gap: 4 },
  cardTitle: { color: '#ffffff', fontSize: 14, fontWeight: '800' },
  cardMeta: { color: '#b9c2cf', fontSize: 12 },
})
