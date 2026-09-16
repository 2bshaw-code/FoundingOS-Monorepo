/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { useCallback, useEffect, useState } from 'react'
import { ScrollView, View, Text, Pressable, StyleSheet, ActivityIndicator, RefreshControl } from 'react-native'
import { BRAND } from '../../lib/brand'
import { fetchPayrollRuns, syncPayrollToFinance, type PayrollRun } from '../../lib/core-api'

const STATUS_COLOR: Record<string, string> = { draft: '#5b6472', processing: '#FFDD00', paid: '#00FF66' }

// Payroll Dashboard — trigger payroll and sync a run to Finance, real
// write-through to the Core.Workforce Talent Console API.
export default function PayrollScreen() {
  const [runs, setRuns] = useState<PayrollRun[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState('')
  const [feedback, setFeedback] = useState('')

  const load = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true)
    const data = await fetchPayrollRuns()
    if (data === null) setError('Could not load payroll runs. Pull down to try again.')
    else { setRuns(data); setError('') }
    setLoading(false)
    setRefreshing(false)
  }, [])

  useEffect(() => { load() }, [load])

  async function sync(run: PayrollRun) {
    const updated = await syncPayrollToFinance(run.id)
    if (!updated) { setFeedback('Could not sync this payroll run to Finance — please retry.'); return }
    setFeedback('✓ Payroll run synced to Finance.')
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
      <Text style={styles.intro}>Payroll runs synced from Core.Workforce.</Text>
      {error ? <Text style={styles.error}>{error}</Text> : null}
      {feedback ? <Text style={styles.feedback}>{feedback}</Text> : null}
      {!runs.length && !error ? <Text style={styles.empty}>No payroll runs yet.</Text> : null}

      {runs.map((run) => (
        <View key={run.id} style={[styles.card, { borderColor: STATUS_COLOR[run.status] ?? '#5b6472' }]}>
          <Text style={styles.cardTitle}>£{(run.totalPence / 100).toFixed(2)} · {run.status}</Text>
          <Text style={styles.cardMeta}>{new Date(run.periodStart).toLocaleDateString('en-GB')} – {new Date(run.periodEnd).toLocaleDateString('en-GB')}</Text>
          {run.syncedToFinanceAt ? (
            <Text style={styles.cardMeta}>Synced to Finance {new Date(run.syncedToFinanceAt).toLocaleString('en-GB')}</Text>
          ) : (
            <Pressable style={[styles.actionButton, { borderColor: BRAND.accent }]} onPress={() => sync(run)}>
              <Text style={[styles.actionText, { color: BRAND.accent }]}>Sync to Finance</Text>
            </Pressable>
          )}
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
  actionButton: { borderWidth: 1, borderRadius: 10, paddingVertical: 8, alignItems: 'center', marginTop: 8 },
  actionText: { fontSize: 12, fontWeight: '700' },
})
