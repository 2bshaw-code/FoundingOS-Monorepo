/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { useCallback, useState } from 'react'
import { ScrollView, View, Text, Pressable, StyleSheet, ActivityIndicator, RefreshControl } from 'react-native'
import { router, useFocusEffect } from 'expo-router'
import { BRAND } from '../../lib/brand'
import { fetchRetailSnapshot, type RetailPollResponse } from '../../lib/retail-poll'
import { buildRetailDashboard, getRetailLedger, restockDemoProduct, type RetailDashboard } from '../../lib/retail-ledger'
import { fetchProducts, fetchOrders, type Product, type RetailOrder } from '../../lib/core-api'

export default function InventoryScreen() {
  const [snapshot, setSnapshot] = useState<RetailPollResponse | null>(null)
  const [dashboard, setDashboard] = useState<RetailDashboard | null>(null)
  const [coreProducts, setCoreProducts] = useState<Product[]>([])
  const [coreOrders, setCoreOrders] = useState<RetailOrder[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState('')
  const [feedback, setFeedback] = useState('')

  const load = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true)
    setError('')
    try {
      const [nextSnapshot, products, orders] = await Promise.all([fetchRetailSnapshot(), fetchProducts(), fetchOrders()])
      if (!nextSnapshot) {
        setError('Could not load inventory right now. Pull down to try again.')
        setDashboard(null)
        return
      }
      const ledger = await getRetailLedger(nextSnapshot.products)
      setSnapshot(nextSnapshot)
      setDashboard(buildRetailDashboard(nextSnapshot, ledger))
      setCoreProducts(products ?? [])
      setCoreOrders(orders ?? [])
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [])


  useFocusEffect(
    useCallback(() => {
      load()
    }, [load])
  )

  async function handleRestock(productId: string, quantity: number) {
    if (!snapshot) return
    const result = await restockDemoProduct(productId, quantity, snapshot.products)
    if (!result.ok) {
      setFeedback(result.error)
      return
    }
    setDashboard(buildRetailDashboard(snapshot, result.state))
    setFeedback(`✓ Restocked ${quantity} × ${result.item.name} locally on this device.`)
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
      contentContainerStyle={{ padding: 16, gap: 14, paddingBottom: 120}}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => load(true)} tintColor={BRAND.accent} />}
    >
      <View style={styles.hero}>
        <Text style={styles.overline}>Inventory · local demo stock ledger</Text>
        <Text style={styles.heroTitle}>Stay ahead of low stock</Text>
        <Text style={styles.heroSubtitle}>Seeded once from the retail console demo catalogue, then kept honest on this device as demo sales and restocks happen.</Text>
      </View>

      {error ? <Text style={styles.error}>{error}</Text> : null}
      {feedback ? <Text style={[styles.feedback, { color: feedback.startsWith('✓') ? BRAND.accent : '#ff5470' }]}>{feedback}</Text> : null}

      {dashboard ? (
        <>
          <View style={styles.metricRow}>
            <View style={[styles.metricCard, { borderColor: BRAND.accent }]}>
              <Text style={styles.metricLabel}>SKUs tracked</Text>
              <Text style={styles.metricValue}>{dashboard.inventory.length}</Text>
            </View>
            <View style={[styles.metricCard, { borderColor: dashboard.summary.lowStockCount > 0 ? '#FF0033' : BRAND.accent }]}>
              <Text style={styles.metricLabel}>Low stock</Text>
              <Text style={styles.metricValue}>{dashboard.summary.lowStockCount}</Text>
            </View>
          </View>

          <View style={styles.ctaCard}>
            <Text style={styles.ctaTitle}>Restock with the existing Shelf Scanner</Text>
            <Text style={styles.ctaText}>Use the camera flow already in the app to assess shelves, then apply a local demo restock below.</Text>
            <View style={styles.ctaActions}>
              <Pressable style={[styles.primaryButton, { backgroundColor: BRAND.accent }]} onPress={() => router.push('/about/scanner')}>
                <Text style={styles.primaryButtonText}>Open Scanner</Text>
              </Pressable>
              <Pressable style={[styles.secondaryButton, { borderColor: BRAND.accent }]} onPress={() => router.push('/new-sale')}>
                <Text style={[styles.secondaryButtonText, { color: BRAND.accent }]}>New Sale</Text>
              </Pressable>
            </View>
          </View>

          <View style={styles.list}>
            {dashboard.inventory.map((item) => {
              const lowStock = item.quantityOnHand <= item.parLevel
              return (
                <View key={item.productId} style={[styles.rowCard, lowStock && { borderColor: '#FF0033' }]}>
                  <View style={styles.rowHeader}>
                    <View style={styles.rowBody}>
                      <Text style={styles.rowTitle}>{item.name}</Text>
                      <Text style={styles.rowSubtitle}>{item.sku} · {item.category} · £{item.unitPriceGbp.toFixed(2)}</Text>
                    </View>
                    <View style={styles.stockPill}>
                      <Text style={[styles.stockPillText, { color: lowStock ? '#FF5470' : BRAND.accent }]}>{item.quantityOnHand} on hand</Text>
                    </View>
                  </View>
                  <Text style={styles.rowMeta}>Par level: {item.parLevel} · {lowStock ? 'Needs restock soon' : 'Healthy stock'}</Text>
                  <View style={styles.restockRow}>
                    {[5, 10, 20].map((amount) => (
                      <Pressable key={amount} style={styles.restockChip} onPress={() => handleRestock(item.productId, amount)}>
                        <Text style={styles.restockChipText}>+{amount}</Text>
                      </Pressable>
                    ))}
                  </View>
                </View>
              )
            })}
          </View>

          {coreProducts.length > 0 ? (
            <View style={styles.list}>
              <Text style={styles.overline}>Core.Operations · live product catalogue</Text>
              {coreProducts.slice(0, 10).map((product) => (
                <View key={product.id} style={styles.rowCard}>
                  <View style={styles.rowHeader}>
                    <View style={styles.rowBody}>
                      <Text style={styles.rowTitle}>{product.name}</Text>
                      <Text style={styles.rowSubtitle}>{product.sku} · {product.category} · £{(product.pricePence / 100).toFixed(2)}</Text>
                    </View>
                  </View>
                  {product.variants.length > 0 ? (
                    <Text style={styles.rowMeta}>{product.variants.map((variant) => `${variant.label}: ${variant.stock}`).join(' · ')}</Text>
                  ) : null}
                </View>
              ))}
            </View>
          ) : null}

          {coreOrders.length > 0 ? (
            <View style={styles.list}>
              <Text style={styles.overline}>Core.Operations · recent orders</Text>
              {coreOrders.slice(0, 10).map((order) => (
                <View key={order.id} style={styles.rowCard}>
                  <Text style={styles.rowTitle}>{order.reference} · £{(order.totalPence / 100).toFixed(2)}</Text>
                  <Text style={styles.rowMeta}>{order.status} · payment {order.paymentStatus} · delivery {order.deliveryStatus}</Text>
                </View>
              ))}
            </View>
          ) : null}
        </>
      ) : null}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F2942' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#0F2942' },
  hero: { gap: 4 },
  overline: { color: '#b9c2cf', fontSize: 11, fontWeight: '700', letterSpacing: 0.5, textTransform: 'uppercase' },
  heroTitle: { color: '#ffffff', fontSize: 28, fontWeight: '800' },
  heroSubtitle: { color: '#b9c2cf', fontSize: 13, lineHeight: 19 },
  error: { color: '#ff5470', fontSize: 13 },
  feedback: { fontSize: 13, fontWeight: '700' },
  metricRow: { flexDirection: 'row', gap: 10 },
  metricCard: { flex: 1, backgroundColor: '#11161f', borderWidth: 1, borderRadius: 16, padding: 14, gap: 4 },
  metricLabel: { color: '#b9c2cf', fontSize: 12, fontWeight: '600' },
  metricValue: { color: '#ffffff', fontSize: 22, fontWeight: '800' },
  ctaCard: { backgroundColor: '#11161f', borderRadius: 16, padding: 14, gap: 10 },
  ctaTitle: { color: '#ffffff', fontSize: 15, fontWeight: '800' },
  ctaText: { color: '#b9c2cf', fontSize: 13, lineHeight: 18 },
  ctaActions: { flexDirection: 'row', gap: 10 },
  primaryButton: { flex: 1, borderRadius: 999, paddingVertical: 14, alignItems: 'center' },
  primaryButtonText: { color: '#071014', fontSize: 14, fontWeight: '800' },
  secondaryButton: { flex: 1, borderRadius: 999, borderWidth: 1.5, paddingVertical: 13, alignItems: 'center' },
  secondaryButtonText: { fontSize: 14, fontWeight: '800' },
  list: { gap: 10 },
  rowCard: { backgroundColor: '#11161f', borderWidth: 1, borderColor: '#242c38', borderRadius: 16, padding: 14, gap: 8 },
  rowHeader: { flexDirection: 'row', gap: 10, alignItems: 'center' },
  rowBody: { flex: 1, gap: 2 },
  rowTitle: { color: '#ffffff', fontSize: 14, fontWeight: '800' },
  rowSubtitle: { color: '#b9c2cf', fontSize: 12 },
  rowMeta: { color: '#5b6472', fontSize: 12 },
  stockPill: { borderRadius: 999, backgroundColor: '#1a2029', paddingVertical: 6, paddingHorizontal: 10 },
  stockPillText: { fontSize: 12, fontWeight: '700' },
  restockRow: { flexDirection: 'row', gap: 8 },
  restockChip: { backgroundColor: '#1a2029', borderRadius: 999, paddingVertical: 8, paddingHorizontal: 12 },
  restockChipText: { color: '#ffffff', fontSize: 12, fontWeight: '700' },
})
