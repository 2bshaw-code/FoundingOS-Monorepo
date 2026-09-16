/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { useCallback, useState } from 'react'
import { ScrollView, View, Text, Pressable, StyleSheet, ActivityIndicator, RefreshControl } from 'react-native'
import { router, useFocusEffect } from 'expo-router'
import { BRAND } from '../../lib/brand'
import { fetchOrders, type RetailOrder } from '../../lib/core-api'

export default function OrdersScreen() {
  const [orders, setOrders] = useState<RetailOrder[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState('')

  const load = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true)
    setError('')
    try {
      const data = await fetchOrders()
      if (data === null) { setError('Could not load orders. Pull down to try again.'); return }
      setOrders(data)
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
      <Text style={styles.title}>Orders</Text>
      {error ? <Text style={styles.error}>{error}</Text> : null}
      {!error && orders.length === 0 ? <Text style={styles.empty}>No orders yet.</Text> : null}
      {orders.map((order) => (
        <Pressable key={order.id} style={styles.card} onPress={() => router.push({ pathname: '/order-detail/[orderId]', params: { orderId: order.id } })}>
          <Text style={styles.cardTitle}>{order.reference} · £{(order.totalPence / 100).toFixed(2)}</Text>
          <Text style={styles.cardMeta}>{order.status} · payment {order.paymentStatus} · delivery {order.deliveryStatus}</Text>
        </Pressable>
      ))}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F2942' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#0F2942' },
  title: { color: '#ffffff', fontSize: 24, fontWeight: '800' },
  error: { color: '#ff5470', fontSize: 13 },
  empty: { color: '#b9c2cf', fontSize: 13 },
  card: { backgroundColor: '#11161f', borderWidth: 1, borderColor: '#242c38', borderRadius: 16, padding: 14, gap: 4 },
  cardTitle: { color: '#ffffff', fontSize: 14, fontWeight: '800' },
  cardMeta: { color: '#b9c2cf', fontSize: 12 },
})
