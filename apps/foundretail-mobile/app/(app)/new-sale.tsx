/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { useCallback, useMemo, useState } from 'react'
import { ScrollView, View, Text, Pressable, StyleSheet, ActivityIndicator, RefreshControl } from 'react-native'
import { router, useFocusEffect } from 'expo-router'
import { BRAND } from '../../lib/brand'
import { fetchRetailSnapshot, type RetailPollResponse } from '../../lib/retail-poll'
import { buildRetailDashboard, getRetailLedger, recordDemoSale, type RetailDashboard } from '../../lib/retail-ledger'
import { createOrder } from '../../lib/core-api'

export default function NewSaleScreen() {
  const [snapshot, setSnapshot] = useState<RetailPollResponse | null>(null)
  const [dashboard, setDashboard] = useState<RetailDashboard | null>(null)
  const [cart, setCart] = useState<Record<string, number>>({})
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const load = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true)
    try {
      const nextSnapshot = await fetchRetailSnapshot()
      if (!nextSnapshot) {
        setFeedback({ type: 'error', text: 'Could not load products right now. Pull down to try again.' })
        setDashboard(null)
        return
      }
      const ledger = await getRetailLedger(nextSnapshot.products)
      setSnapshot(nextSnapshot)
      setDashboard(buildRetailDashboard(nextSnapshot, ledger))
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

  const products = dashboard?.products ?? []
  const cartItems = useMemo(
    () => products.filter((product) => (cart[product.id] ?? 0) > 0).map((product) => ({ ...product, quantity: cart[product.id] ?? 0 })),
    [cart, products]
  )
  const totalGbp = useMemo(() => cartItems.reduce((sum, item) => sum + item.quantity * item.priceGbp, 0), [cartItems])
  const itemCount = useMemo(() => cartItems.reduce((sum, item) => sum + item.quantity, 0), [cartItems])

  function changeQuantity(productId: string, nextQuantity: number, maxQuantity: number) {
    setFeedback(null)
    setCart((current) => {
      const bounded = Math.max(0, Math.min(nextQuantity, maxQuantity))
      if (bounded === 0) {
        const next = { ...current }
        delete next[productId]
        return next
      }
      return { ...current, [productId]: bounded }
    })
  }

  async function handleCompleteSale() {
    if (!snapshot || !dashboard) return
    setSubmitting(true)
    setFeedback(null)
    const result = await recordDemoSale(
      Object.entries(cart).map(([productId, quantity]) => ({ productId, quantity })),
      snapshot.products
    )
    setSubmitting(false)
    if (!result.ok) {
      setFeedback({ type: 'error', text: result.error })
      return
    }
    setCart({})
    setDashboard(buildRetailDashboard(snapshot, result.state))
    setFeedback({ type: 'success', text: `✓ Demo sale noted — £${result.sale.totalGbp.toFixed(2)} recorded on this device.` })
    // Best-effort sync to the real Core.Operations Order API. Offline-first: the
    // local ledger above is the source of truth for this screen, so a failed or
    // slow network call here never blocks or reverts the sale that was just recorded.
    createOrder({
      totalPence: Math.round(result.sale.totalGbp * 100),
      source: 'mobile',
      items: Object.entries(cart).map(([productId, quantity]) => ({ productId, quantity })),
    }).catch(() => {})
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
      contentContainerStyle={{ padding: 16, paddingTop: 60, gap: 14, paddingBottom: 120}}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => load(true)} tintColor={BRAND.accent} />}
    >
      <Pressable onPress={() => router.back()}>
        <Text style={[styles.backText, { color: BRAND.accent }]}>‹ Back</Text>
      </Pressable>

      <View style={styles.hero}>
        <Text style={styles.overline}>Demo POS</Text>
        <Text style={styles.heroTitle}>New Sale</Text>
        <Text style={styles.heroSubtitle}>Honest local-only checkout: sales are recorded on this device and reflected in Today + Inventory, not sent to a payment processor or server.</Text>
      </View>

      <View style={[styles.summaryCard, { borderColor: BRAND.accent }]}>
        <View>
          <Text style={styles.summaryLabel}>Running total</Text>
          <Text style={styles.summaryValue}>£{totalGbp.toFixed(2)}</Text>
        </View>
        <View style={styles.summarySide}>
          <Text style={styles.summaryMeta}>{itemCount} item{itemCount === 1 ? '' : 's'}</Text>
          <Text style={styles.summaryMeta}>{cartItems.length} SKU{cartItems.length === 1 ? '' : 's'}</Text>
        </View>
      </View>

      {feedback ? <Text style={[styles.feedback, { color: feedback.type === 'success' ? BRAND.accent : '#ff5470' }]}>{feedback.text}</Text> : null}

      <Pressable
        style={[styles.completeButton, { backgroundColor: BRAND.accent }, (submitting || cartItems.length === 0) && { opacity: 0.5 }]}
        onPress={handleCompleteSale}
        disabled={submitting || cartItems.length === 0}
      >
        <Text style={styles.completeButtonText}>{submitting ? 'Recording…' : 'Complete Demo Sale'}</Text>
      </Pressable>

      {cartItems.length > 0 ? (
        <View style={styles.cartCard}>
          <Text style={styles.sectionTitle}>Basket</Text>
          {cartItems.map((item) => (
            <View key={item.id} style={styles.cartRow}>
              <View style={styles.cartBody}>
                <Text style={styles.cartTitle}>{item.name}</Text>
                <Text style={styles.cartMeta}>{item.quantity} × £{item.priceGbp.toFixed(2)}</Text>
              </View>
              <Text style={styles.cartValue}>£{(item.quantity * item.priceGbp).toFixed(2)}</Text>
            </View>
          ))}
        </View>
      ) : null}

      <Text style={styles.sectionTitle}>Products</Text>
      <View style={styles.list}>
        {products.map((product) => {
          const quantity = cart[product.id] ?? 0
          const soldOut = product.quantityOnHand <= 0
          return (
            <View key={product.id} style={styles.productCard}>
              <View style={styles.productTopRow}>
                <View style={styles.productBody}>
                  <Text style={styles.productTitle}>{product.name}</Text>
                  <Text style={styles.productMeta}>{product.sku} · {product.category}</Text>
                </View>
                <View style={styles.productMetrics}>
                  <Text style={styles.productPrice}>£{product.priceGbp.toFixed(2)}</Text>
                  <Text style={[styles.stockMeta, { color: soldOut ? '#FF5470' : '#b9c2cf' }]}>{product.quantityOnHand} on hand</Text>
                </View>
              </View>
              <View style={styles.stepperRow}>
                <Pressable style={styles.stepperButton} onPress={() => changeQuantity(product.id, quantity - 1, product.quantityOnHand)}>
                  <Text style={styles.stepperButtonText}>−</Text>
                </Pressable>
                <Text style={styles.stepperValue}>{quantity}</Text>
                <Pressable
                  style={[styles.stepperButton, soldOut && { opacity: 0.35 }]}
                  onPress={() => changeQuantity(product.id, quantity + 1, product.quantityOnHand)}
                  disabled={soldOut || quantity >= product.quantityOnHand}
                >
                  <Text style={styles.stepperButtonText}>+</Text>
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
  backText: { fontSize: 15, fontWeight: '700' },
  hero: { gap: 4 },
  overline: { color: '#b9c2cf', fontSize: 11, fontWeight: '700', letterSpacing: 0.5, textTransform: 'uppercase' },
  heroTitle: { color: '#ffffff', fontSize: 28, fontWeight: '800' },
  heroSubtitle: { color: '#b9c2cf', fontSize: 13, lineHeight: 19 },
  summaryCard: { backgroundColor: '#11161f', borderWidth: 1, borderRadius: 16, padding: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  summaryLabel: { color: '#b9c2cf', fontSize: 12, fontWeight: '600' },
  summaryValue: { color: '#ffffff', fontSize: 28, fontWeight: '800', marginTop: 4 },
  summarySide: { alignItems: 'flex-end', gap: 2 },
  summaryMeta: { color: '#b9c2cf', fontSize: 12 },
  feedback: { fontSize: 13, fontWeight: '700' },
  completeButton: { borderRadius: 999, paddingVertical: 16, alignItems: 'center' },
  completeButtonText: { color: '#071014', fontSize: 16, fontWeight: '800' },
  cartCard: { backgroundColor: '#11161f', borderRadius: 16, padding: 14, gap: 10 },
  sectionTitle: { color: '#ffffff', fontSize: 15, fontWeight: '800' },
  cartRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 10 },
  cartBody: { flex: 1, gap: 2 },
  cartTitle: { color: '#ffffff', fontSize: 13, fontWeight: '700' },
  cartMeta: { color: '#b9c2cf', fontSize: 12 },
  cartValue: { color: '#ffffff', fontSize: 13, fontWeight: '700' },
  list: { gap: 10, paddingBottom: 30 },
  productCard: { backgroundColor: '#11161f', borderWidth: 1, borderColor: '#242c38', borderRadius: 16, padding: 14, gap: 12 },
  productTopRow: { flexDirection: 'row', gap: 10, alignItems: 'center' },
  productBody: { flex: 1, gap: 2 },
  productTitle: { color: '#ffffff', fontSize: 14, fontWeight: '800' },
  productMeta: { color: '#b9c2cf', fontSize: 12 },
  productMetrics: { alignItems: 'flex-end', gap: 2 },
  productPrice: { color: '#ffffff', fontSize: 14, fontWeight: '700' },
  stockMeta: { fontSize: 12 },
  stepperRow: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  stepperButton: { width: 34, height: 34, borderRadius: 17, backgroundColor: '#1a2029', alignItems: 'center', justifyContent: 'center' },
  stepperButtonText: { color: '#ffffff', fontSize: 20, fontWeight: '700' },
  stepperValue: { color: '#ffffff', fontSize: 16, fontWeight: '800', minWidth: 24, textAlign: 'center' },
})
