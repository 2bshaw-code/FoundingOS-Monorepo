/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { useCallback, useEffect, useState } from 'react'
import { ScrollView, View, Text, StyleSheet, ActivityIndicator, RefreshControl, Dimensions } from 'react-native'
import { fetchCashflow, type CashflowResponse } from '../../lib/cashflow'
import { getScannedApprovals, type ScannedApproval } from '../../lib/approvals'
import { fetchDsoSummary, fetchMobileMoneyTransactions, type DsoSummary, type MobileMoneyTransaction } from '../../lib/core-api'
import { BRAND } from '../../lib/brand'
import { DualTrendChart, BarBreakdown } from '../../components/FinanceCharts'

const CHART_WIDTH = Math.min(Dimensions.get('window').width - 64, 360)

// Real cash flow screen — real-time-feeling cash position, a dual-line SVG trend chart of
// inflow vs. outflow, and a spend-by-category breakdown, all sourced from this brand's own
// deterministic demo-mode feed at GET ${GROWTH_CONSOLE_URL}/api/finance/cashflow (mirrors the
// same demo-generator pattern already used by apps/crypto-console's price feed). Any receipts
// scanned on-device (lib/approvals.ts) are folded into the spend breakdown as real pending
// local items, clearly additive to — never faked as part of — the server feed.
export default function CashflowScreen() {
  const [data, setData] = useState<CashflowResponse | null>(null)
  const [scanned, setScanned] = useState<ScannedApproval[]>([])
  const [dso, setDso] = useState<DsoSummary | null>(null)
  const [mobileMoney, setMobileMoney] = useState<MobileMoneyTransaction[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState('')

  const load = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true)
    setError('')
    try {
      const [feed, localScans, dsoSummary, mmTransactions] = await Promise.all([
        fetchCashflow(),
        getScannedApprovals(),
        fetchDsoSummary(),
        fetchMobileMoneyTransactions(),
      ])
      if (!feed) {
        setError('Could not load cash flow data. Pull down to try again.')
      } else {
        setData(feed)
      }
      setScanned(localScans)
      setDso(dsoSummary)
      setMobileMoney(mmTransactions ?? [])
    } catch {
      setError('Could not load cash flow data. Pull down to try again.')
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

  const inflow = data?.trend.map((point) => point.inflowUsd) ?? []
  const outflow = data?.trend.map((point) => point.outflowUsd) ?? []

  const scannedTotalUsd = scanned.reduce((sum, item) => sum + item.amountUsd, 0)
  const spendItems = data
    ? [
        ...data.spendByCategory.map((entry) => ({ label: entry.category, value: entry.amountUsd })),
        ...(scannedTotalUsd > 0 ? [{ label: 'Scanned receipts (pending)', value: scannedTotalUsd }] : []),
      ].sort((a, b) => b.value - a.value)
    : []

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ padding: 16, gap: 16, paddingBottom: 120 }}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => load(true)} tintColor={BRAND.accent} />}
    >
      <Text style={styles.intro}>Demo-mode cash flow for {BRAND.name} — deterministic, reseeds every few minutes.</Text>
      {error ? <Text style={styles.error}>{error}</Text> : null}

      {data ? (
        <>
          <View style={[styles.card, { borderColor: BRAND.accent }]}>
            <Text style={styles.cardLabel}>Cash position</Text>
            <Text style={[styles.cashValue, { color: BRAND.accent }]}>
              ${data.cashPositionUsd.toLocaleString('en-US', { maximumFractionDigits: 0 })}
            </Text>
            <Text style={styles.cardMeta}>Updated {new Date(data.generatedAt).toLocaleString('en-GB')}</Text>
          </View>

          <View style={[styles.card, { borderColor: BRAND.accent }]}>
            <Text style={styles.cardTitle}>Inflow vs. outflow — last {data.trend.length} days</Text>
            <View style={styles.legendRow}>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: '#00CC66' }]} />
                <Text style={styles.legendText}>Inflow</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: '#FF4D4D' }]} />
                <Text style={styles.legendText}>Outflow</Text>
              </View>
            </View>
            <DualTrendChart seriesA={inflow} seriesB={outflow} width={CHART_WIDTH} height={140} />
          </View>

          <View style={[styles.card, { borderColor: BRAND.accent }]}>
            <Text style={styles.cardTitle}>Spend by category</Text>
            <BarBreakdown items={spendItems.map((i) => ({ label: i.label, value: i.value }))} width={CHART_WIDTH} color={BRAND.accent} />
            <View style={{ gap: 6, marginTop: 4 }}>
              {spendItems.map((item) => (
                <View key={item.label} style={styles.spendRow}>
                  <Text style={styles.spendLabel}>{item.label}</Text>
                  <Text style={styles.spendValue}>${item.value.toLocaleString('en-US', { maximumFractionDigits: 0 })}</Text>
                </View>
              ))}
            </View>
          </View>
        </>
      ) : null}

      {dso ? (
        <View style={[styles.card, { borderColor: BRAND.accent }]}>
          <Text style={styles.cardTitle}>DSO — Core.Operations Finance</Text>
          <Text style={styles.cardMeta}>Average days sales outstanding: {dso.averageDaysSalesOutstanding.toFixed(1)}</Text>
          <Text style={styles.cardMeta}>{dso.outstandingInvoiceCount} invoices outstanding · ${(dso.totalOutstandingPence / 100).toLocaleString('en-US', { maximumFractionDigits: 0 })}</Text>
        </View>
      ) : null}

      {mobileMoney.length > 0 ? (
        <View style={[styles.card, { borderColor: BRAND.accent }]}>
          <Text style={styles.cardTitle}>Mobile money reconciliations</Text>
          {mobileMoney.slice(0, 5).map((tx) => (
            <View key={tx.id} style={styles.spendRow}>
              <Text style={styles.spendLabel}>{tx.provider} · {tx.reference}</Text>
              <Text style={styles.spendValue}>${(tx.amountPence / 100).toLocaleString('en-US', { maximumFractionDigits: 0 })}</Text>
            </View>
          ))}
        </View>
      ) : null}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F2942' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#0F2942' },
  intro: { color: '#b9c2cf', fontSize: 13 },
  error: { color: '#ff5470', fontSize: 13 },
  card: { backgroundColor: '#11161f', borderWidth: 1, borderRadius: 16, padding: 16, gap: 8 },
  cardLabel: { color: '#b9c2cf', fontSize: 12, fontWeight: '600' },
  cashValue: { fontSize: 30, fontWeight: '800' },
  cardMeta: { color: '#5b6472', fontSize: 11 },
  cardTitle: { color: '#ffffff', fontSize: 15, fontWeight: '700' },
  legendRow: { flexDirection: 'row', gap: 16 },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  legendDot: { width: 8, height: 8, borderRadius: 4 },
  legendText: { color: '#b9c2cf', fontSize: 12 },
  spendRow: { flexDirection: 'row', justifyContent: 'space-between' },
  spendLabel: { color: '#b9c2cf', fontSize: 13 },
  spendValue: { color: '#ffffff', fontSize: 13, fontWeight: '700' },
})
