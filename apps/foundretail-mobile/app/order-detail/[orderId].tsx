/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { useCallback, useState } from 'react'
import { ScrollView, View, Text, Pressable, StyleSheet, ActivityIndicator, RefreshControl } from 'react-native'
import { useLocalSearchParams, useFocusEffect, router } from 'expo-router'
import { BRAND } from '../../lib/brand'
import { fetchOrders, updateOrderStatus, type RetailOrder } from '../../lib/core-api'

export default function OrderDetailScreen() {
  const { orderId } = useLocalSearchParams<{ orderId: string }>()
  const [order, setOrder] = useState<RetailOrder | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState('')
  const [feedback, setFeedback] = useState('')

  const load = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true)
    setError('')
    try {
      const orders = await fetchOrders()
      if (orders === null) { setError('Could not load this order. Pull down to try again.'); return }
      setOrder(orders.find((candidate) => candidate.id === orderId) ?? null)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [orderId])

  useFocusEffect(useCallback(() => { load() }, [load]))

  async function transition(status: string) {
    if (!order) return
    const updated = await updateOrderStatus(order.id, status)
    if (!updated) { setFeedback('Could not update order status — please retry.'); return }
    setFeedback(`✓ Order marked ${status}.`)
    load()
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
      contentContainerStyle={{ padding: 16, gap: 14, paddingBottom: 120 }}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => load(true)} tintColor={BRAND.accent} />}
    >
      <Pressable onPress={() => router.back()}>
        <Text style={[styles.backText, { color: BRAND.accent }]}>‹ Back</Text>
      </Pressable>
      {error ? <Text style={styles.error}>{error}</Text> : null}
      {feedback ? <Text style={styles.feedback}>{feedback}</Text> : null}
      {!order && !error ? <Text style={styles.empty}>Order not found.</Text> : null}
      {order ? (
        <View style={styles.card}>
          <Text style={styles.title}>{order.reference}</Text>
          <Text style={styles.meta}>Total: £{(order.totalPence / 100).toFixed(2)}</Text>
          <Text style={styles.meta}>Status: {order.status}</Text>
          <Text style={styles.meta}>Payment: {order.paymentStatus}</Text>
          <Text style={styles.meta}>Delivery: {order.deliveryStatus}</Text>
          <Text style={styles.meta}>Source: {order.source}</Text>
          <View style={styles.actions}>
            <Pressable style={[styles.button, { backgroundColor: BRAND.accent }]} onPress={() => transition('confirmed')}>
              <Text style={styles.buttonText}>Confirm</Text>
            </Pressable>
            <Pressable style={[styles.button, { backgroundColor: BRAND.accent }]} onPress={() => transition('fulfilled')}>
              <Text style={styles.buttonText}>Fulfilled</Text>
            </Pressable>
            <Pressable style={[styles.button, { backgroundColor: '#ff5470' }]} onPress={() => transition('cancelled')}>
              <Text style={styles.buttonText}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      ) : null}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F2942' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#0F2942' },
  backText: { fontSize: 14, fontWeight: '700' },
  error: { color: '#ff5470', fontSize: 13 },
  feedback: { color: '#b9c2cf', fontSize: 13 },
  empty: { color: '#b9c2cf', fontSize: 13 },
  card: { backgroundColor: '#11161f', borderWidth: 1, borderColor: '#242c38', borderRadius: 16, padding: 16, gap: 6 },
  title: { color: '#ffffff', fontSize: 20, fontWeight: '800' },
  meta: { color: '#b9c2cf', fontSize: 13 },
  actions: { flexDirection: 'row', gap: 8, marginTop: 12 },
  button: { flex: 1, borderRadius: 999, paddingVertical: 10, alignItems: 'center' },
  buttonText: { color: '#071014', fontSize: 13, fontWeight: '800' },
})
