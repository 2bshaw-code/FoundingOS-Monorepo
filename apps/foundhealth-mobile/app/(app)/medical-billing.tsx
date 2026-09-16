/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { useCallback, useEffect, useState } from 'react'
import { ScrollView, View, Text, Pressable, StyleSheet, ActivityIndicator, RefreshControl } from 'react-native'
import { BRAND } from '../../lib/brand'
import { fetchMedicalInvoices, sendMedicalInvoice, syncMedicalBillingToFinance, type MedicalInvoice } from '../../lib/core-api'

const STATUS_COLOR: Record<string, string> = { paid: '#00FF66', sent: '#00CFFF', overdue: '#FF0033', draft: '#5b6472' }

// Medical Billing — send invoices to patients and sync billing to Finance,
// real write-through to the Core.Health Health Console API.
export default function MedicalBillingScreen() {
  const [invoices, setInvoices] = useState<MedicalInvoice[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState('')
  const [feedback, setFeedback] = useState('')

  const load = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true)
    const data = await fetchMedicalInvoices()
    if (data === null) setError('Could not load medical invoices. Pull down to try again.')
    else { setInvoices(data); setError('') }
    setLoading(false)
    setRefreshing(false)
  }, [])

  useEffect(() => { load() }, [load])

  async function send(invoice: MedicalInvoice) {
    const updated = await sendMedicalInvoice(invoice.id)
    if (!updated) { setFeedback('Could not send this invoice — please retry.'); return }
    setFeedback(`✓ ${invoice.number} sent.`)
    load()
  }

  async function sync(invoice: MedicalInvoice) {
    const updated = await syncMedicalBillingToFinance(invoice.id)
    if (!updated) { setFeedback('Could not sync to Finance — please retry.'); return }
    setFeedback(`✓ ${invoice.number} synced to Finance.`)
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
      <Text style={styles.intro}>Medical invoices, synced from Core.Health.</Text>
      {error ? <Text style={styles.error}>{error}</Text> : null}
      {feedback ? <Text style={styles.feedback}>{feedback}</Text> : null}
      {!invoices.length && !error ? <Text style={styles.empty}>No medical invoices yet.</Text> : null}

      {invoices.map((invoice) => (
        <View key={invoice.id} style={[styles.card, { borderColor: STATUS_COLOR[invoice.status] ?? '#5b6472' }]}>
          <Text style={styles.cardTitle}>{invoice.number} · £{(invoice.totalPence / 100).toFixed(2)}</Text>
          <Text style={styles.cardMeta}>{invoice.status}{invoice.dueAt ? ` · due ${new Date(invoice.dueAt).toLocaleDateString('en-GB')}` : ''}</Text>
          <View style={{ flexDirection: 'row', gap: 8, marginTop: 8 }}>
            {invoice.status !== 'paid' ? (
              <Pressable style={[styles.actionButton, { borderColor: BRAND.accent }]} onPress={() => send(invoice)}>
                <Text style={[styles.actionText, { color: BRAND.accent }]}>Send</Text>
              </Pressable>
            ) : null}
            <Pressable style={[styles.actionButton, { borderColor: '#00FF66' }]} onPress={() => sync(invoice)}>
              <Text style={[styles.actionText, { color: '#00FF66' }]}>Sync to Finance</Text>
            </Pressable>
          </View>
        </View>
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
  actionButton: { borderWidth: 1, borderRadius: 10, paddingVertical: 8, paddingHorizontal: 12, alignItems: 'center' },
  actionText: { fontSize: 12, fontWeight: '700' },
})
