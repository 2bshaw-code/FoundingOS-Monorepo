/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { useCallback, useEffect, useRef, useState } from 'react'
import { ScrollView, View, Text, Pressable, StyleSheet, ActivityIndicator, RefreshControl, useWindowDimensions } from 'react-native'
import { router, useFocusEffect } from 'expo-router'
import { BRAND } from '../../lib/brand'
import { fetchRetailSnapshot } from '../../lib/retail-poll'
import { buildRetailDashboard, getRetailLedger, type RetailDashboard } from '../../lib/retail-ledger'
import { SalesChart } from '../../components/SalesChart'
import { AIOnboardingCard } from '../../components/AIOnboardingCard'

export default function TodayScreen() {
  const [dashboard, setDashboard] = useState<RetailDashboard | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState('')
  const [refreshMinutes, setRefreshMinutes] = useState(5)
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const { width } = useWindowDimensions()
  const chartWidth = Math.max(280, Math.min(width - 32, 420))

  const load = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true)
    setError('')
    try {
      const snapshot = await fetchRetailSnapshot()
      if (!snapshot) {
        setError('Could not load today\'s retail snapshot. Pull down to try again.')
        setDashboard(null)
        return
      }
      const ledger = await getRetailLedger(snapshot.products)
      setDashboard(buildRetailDashboard(snapshot, ledger))
      setRefreshMinutes(snapshot.refreshIntervalMinutes)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [])

  useEffect(() => {
    load()
    pollRef.current = setInterval(() => load(), 20000)
    return () => {
      if (pollRef.current) clearInterval(pollRef.current)
    }
  }, [load])

  useFocusEffect(
    useCallback(() => {
      load()
    }, [load])
  )

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
        <Text style={styles.overline}>Today · demo baseline + local device sales</Text>
        <Text style={styles.heroValue}>£{dashboard?.summary.revenueTodayGbp.toLocaleString(undefined, { maximumFractionDigits: 2 }) ?? '0.00'}</Text>
        <Text style={styles.heroSubtitle}>Live-feeling retail sales, refreshed every {refreshMinutes} minutes and topped up instantly by demo sales recorded on this device.</Text>
      </View>

      <AIOnboardingCard
        accent={BRAND.accent}
        brandKey={`${BRAND.slug}-today`}
        brandName={BRAND.name}
        description="Track today's revenue, best sellers, and low stock in one place, then jump straight into a demo POS sale."
        actionLabel="start a new sale"
        onDoThisForMe={() => router.push('/new-sale')}
      />

      {error ? <Text style={styles.error}>{error}</Text> : null}

      {dashboard ? (
        <>
          <View style={styles.metricGrid}>
            <View style={[styles.metricCard, { borderColor: BRAND.accent }]}>
              <Text style={styles.metricLabel}>Transactions</Text>
              <Text style={styles.metricValue}>{dashboard.summary.transactionsToday}</Text>
            </View>
            <View style={[styles.metricCard, { borderColor: '#2f6fed' }]}>
              <Text style={styles.metricLabel}>Avg basket</Text>
              <Text style={styles.metricValue}>£{dashboard.summary.avgOrderValueGbp.toFixed(2)}</Text>
            </View>
            <View style={[styles.metricCard, { borderColor: '#FFDD00' }]}>
              <Text style={styles.metricLabel}>Gross margin</Text>
              <Text style={styles.metricValue}>{dashboard.summary.grossMarginPct.toFixed(1)}%</Text>
            </View>
            <View style={[styles.metricCard, { borderColor: dashboard.summary.lowStockCount > 0 ? '#FF0033' : BRAND.accent }]}>
              <Text style={styles.metricLabel}>Low stock</Text>
              <Text style={styles.metricValue}>{dashboard.summary.lowStockCount}</Text>
            </View>
          </View>

          <View style={styles.card}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Sales trend</Text>
              <Text style={styles.sectionMeta}>Today</Text>
            </View>
            <SalesChart data={dashboard.trend.map((point) => point.revenueGbp)} width={chartWidth} height={160} color={BRAND.accent} />
            <Text style={styles.cardMeta}>£{dashboard.summary.demoRevenueTodayGbp.toFixed(2)} across {dashboard.summary.demoTransactionsToday} local demo sale{dashboard.summary.demoTransactionsToday === 1 ? '' : 's'} recorded on this device.</Text>
          </View>

          <View style={styles.actionRow}>
            <Pressable style={[styles.primaryButton, { backgroundColor: BRAND.accent }]} onPress={() => router.push('/new-sale')}>
              <Text style={styles.primaryButtonText}>New Sale</Text>
            </Pressable>
            <Pressable style={[styles.secondaryButton, { borderColor: BRAND.accent }]} onPress={() => router.push('/inventory')}>
              <Text style={[styles.secondaryButtonText, { color: BRAND.accent }]}>Inventory</Text>
            </Pressable>
          </View>

          <Text style={styles.sectionTitle}>Top selling products</Text>
          <View style={styles.list}>
            {dashboard.topProducts.slice(0, 5).map((product, index) => (
              <View key={product.id} style={styles.rowCard}>
                <View style={[styles.rankBadge, { backgroundColor: BRAND.accent }]}>
                  <Text style={styles.rankText}>#{index + 1}</Text>
                </View>
                <View style={styles.rowBody}>
                  <Text style={styles.rowTitle}>{product.name}</Text>
                  <Text style={styles.rowSubtitle}>{product.sku} · {product.category}</Text>
                </View>
                <View style={styles.rowMetrics}>
                  <Text style={styles.rowValue}>{product.unitsSoldToday} sold</Text>
                  <Text style={[styles.rowMeta, { color: product.localUnitsSoldToday > 0 ? BRAND.accent : '#5b6472' }]}>£{product.revenueTodayGbp.toFixed(2)}</Text>
                </View>
              </View>
            ))}
          </View>

          {dashboard.recentSales.length > 0 ? (
            <>
              <Text style={styles.sectionTitle}>Recent device sales</Text>
              <View style={styles.list}>
                {dashboard.recentSales.slice(0, 4).map((sale) => (
                  <View key={sale.id} style={styles.rowCard}>
                    <View style={[styles.saleBadge, { borderColor: BRAND.accent }]}>
                      <Text style={[styles.saleBadgeText, { color: BRAND.accent }]}>POS</Text>
                    </View>
                    <View style={styles.rowBody}>
                      <Text style={styles.rowTitle}>Demo sale — recorded on this device</Text>
                      <Text style={styles.rowSubtitle}>{sale.itemCount} item{sale.itemCount === 1 ? '' : 's'} · {new Date(sale.timestamp).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}</Text>
                    </View>
                    <Text style={styles.rowValue}>£{sale.totalGbp.toFixed(2)}</Text>
                  </View>
                ))}
              </View>
            </>
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
  heroValue: { color: '#ffffff', fontSize: 34, fontWeight: '800' },
  heroSubtitle: { color: '#b9c2cf', fontSize: 13, lineHeight: 19 },
  error: { color: '#ff5470', fontSize: 13 },
  metricGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  metricCard: { flexGrow: 1, minWidth: 150, backgroundColor: '#11161f', borderWidth: 1, borderRadius: 16, padding: 14, gap: 4 },
  metricLabel: { color: '#b9c2cf', fontSize: 12, fontWeight: '600' },
  metricValue: { color: '#ffffff', fontSize: 22, fontWeight: '800' },
  card: { backgroundColor: '#11161f', borderRadius: 16, padding: 14, gap: 10 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  sectionTitle: { color: '#ffffff', fontSize: 15, fontWeight: '800' },
  sectionMeta: { color: '#5b6472', fontSize: 12, fontWeight: '600' },
  cardMeta: { color: '#b9c2cf', fontSize: 12, lineHeight: 18 },
  actionRow: { flexDirection: 'row', gap: 10 },
  primaryButton: { flex: 1, borderRadius: 999, paddingVertical: 14, alignItems: 'center' },
  primaryButtonText: { color: '#071014', fontSize: 15, fontWeight: '800' },
  secondaryButton: { flex: 1, borderRadius: 999, borderWidth: 1.5, paddingVertical: 13, alignItems: 'center' },
  secondaryButtonText: { fontSize: 15, fontWeight: '800' },
  list: { gap: 10 },
  rowCard: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: '#11161f', borderWidth: 1, borderColor: '#242c38', borderRadius: 16, padding: 14,
  },
  rankBadge: { width: 38, height: 38, borderRadius: 19, alignItems: 'center', justifyContent: 'center' },
  rankText: { color: '#071014', fontSize: 12, fontWeight: '800' },
  saleBadge: { width: 38, height: 38, borderRadius: 19, borderWidth: 1.5, alignItems: 'center', justifyContent: 'center' },
  saleBadgeText: { fontSize: 11, fontWeight: '800' },
  rowBody: { flex: 1, gap: 2 },
  rowTitle: { color: '#ffffff', fontSize: 14, fontWeight: '800' },
  rowSubtitle: { color: '#b9c2cf', fontSize: 12 },
  rowMetrics: { alignItems: 'flex-end', gap: 2 },
  rowValue: { color: '#ffffff', fontSize: 14, fontWeight: '700' },
  rowMeta: { fontSize: 12, fontWeight: '700' },
})
