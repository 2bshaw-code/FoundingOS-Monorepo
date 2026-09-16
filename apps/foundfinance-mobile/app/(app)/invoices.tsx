/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { useCallback, useEffect, useState } from 'react'
import { ScrollView, View, Text, Pressable, StyleSheet, ActivityIndicator, RefreshControl } from 'react-native'
import { router } from 'expo-router'
import { BRAND } from '../../lib/brand'
import { fetchInvoices, sendInvoice, type Invoice } from '../../lib/core-api'

const STATUS_COLOR: Record<string, string> = {
  paid: '#00FF66',
  partially_paid: '#FFDD00',
  overdue: '#FF0033',
  sent: '#00CFFF',
}

// Invoice list, backed by the real core-operations Finance Console API
// (GET /invoices). Mirrors the web Invoice List screen so invoice status
// is consistent across web and mobile.
export default function InvoicesScreen() {
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState('')
  const [feedback, setFeedback] = useState('')

  const load = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true)
    const data = await fetchInvoices()
    if (data === null) setError('Could not load invoices. Pull down to try again.')
    else { setInvoices(data); setError('') }
    setLoading(false)
    setRefreshing(false)
  }, [])

  useEffect(() => { load() }, [load])

  async function send(invoice: Invoice) {
    const updated = await sendInvoice(invoice.id)
    if (!updated) { setFeedback('Could not send this invoice — please retry.'); return }
    setFeedback(`✓ ${invoice.number} sent via WhatsApp.`)
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
      contentContainerStyle={{ padding: 16, gap: 10, paddingBottom: 120 }}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => load(true)} tintColor={BRAND.accent} />}
    >
      <Text style={styles.intro}>All invoices, synced from Core.Operations.</Text>
      {error ? <Text style={styles.error}>{error}</Text> : null}
      {feedback ? <Text style={styles.feedback}>{feedback}</Text> : null}
      {!invoices.length && !error ? <Text style={styles.empty}>No invoices yet.</Text> : null}

      {invoices.map((invoice) => (
        <Pressable key={invoice.id} style={[styles.card, { borderColor: STATUS_COLOR[invoice.status] ?? '#5b6472' }]} onPress={() => router.push(`/mobile-money-reconcile?invoiceId=${invoice.id}`)}>
          <Text style={styles.cardTitle}>{invoice.number}</Text>
          <Text style={styles.cardMeta}>£{(invoice.totalPence / 100).toFixed(2)} · {invoice.status}</Text>
          {invoice.dueAt ? <Text style={styles.cardMeta}>Due {new Date(invoice.dueAt).toLocaleDateString('en-GB')}</Text> : null}
          {invoice.status !== 'paid' ? (
            <Pressable style={[styles.actionButton, { borderColor: BRAND.accent }]} onPress={() => send(invoice)}>
              <Text style={[styles.actionText, { color: BRAND.accent }]}>Send via WhatsApp</Text>
            </Pressable>
          ) : null}
        </Pressable>
      ))}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F2942' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#0F2942' },
  intro: { color: '#b9c2cf', fontSize: 13 },
  error: { color: '#ff5470', fontSize: 13 },
  feedback: { color: '#b9c2cf', fontSize: 13 },
  empty: { color: '#b9c2cf', fontSize: 13 },
  card: { backgroundColor: '#11161f', borderWidth: 1, borderRadius: 16, padding: 16, gap: 4 },
  cardTitle: { color: '#ffffff', fontSize: 16, fontWeight: '700' },
  cardMeta: { color: '#b9c2cf', fontSize: 12 },
  actionButton: { borderWidth: 1, borderRadius: 10, paddingVertical: 8, alignItems: 'center', marginTop: 8 },
  actionText: { fontSize: 12, fontWeight: '700' },
})
