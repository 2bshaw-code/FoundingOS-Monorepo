/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { useCallback, useEffect, useState } from 'react'
import { ScrollView, View, Text, Pressable, StyleSheet, ActivityIndicator, RefreshControl } from 'react-native'
import { router } from 'expo-router'
import { BRAND } from '../../lib/brand'
import { fetchTimesheets, approveTimesheet, type Timesheet } from '../../lib/core-api'

const STATUS_COLOR: Record<string, string> = { pending: '#FFDD00', approved: '#00FF66', rejected: '#FF0033' }

// Timesheet Dashboard — approve worker timesheets from the field, real
// write-through to the Core.Workforce Talent Console API.
export default function TimesheetsScreen() {
  const [timesheets, setTimesheets] = useState<Timesheet[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState('')
  const [feedback, setFeedback] = useState('')

  const load = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true)
    const data = await fetchTimesheets()
    if (data === null) setError('Could not load timesheets. Pull down to try again.')
    else { setTimesheets(data); setError('') }
    setLoading(false)
    setRefreshing(false)
  }, [])

  useEffect(() => { load() }, [load])

  async function approve(timesheet: Timesheet) {
    const updated = await approveTimesheet(timesheet.id)
    if (!updated) { setFeedback('Could not approve this timesheet — please retry.'); return }
    setFeedback('✓ Timesheet approved.')
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
      <Text style={styles.intro}>Approve worker timesheets synced from Core.Workforce.</Text>
      {error ? <Text style={styles.error}>{error}</Text> : null}
      {feedback ? <Text style={styles.feedback}>{feedback}</Text> : null}
      <Pressable style={[styles.navButton, { borderColor: BRAND.accent }]} onPress={() => router.push('/payroll')}>
        <Text style={[styles.navButtonText, { color: BRAND.accent }]}>Payroll</Text>
      </Pressable>
      {!timesheets.length && !error ? <Text style={styles.empty}>No timesheets yet.</Text> : null}

      {timesheets.map((timesheet) => (
        <View key={timesheet.id} style={[styles.card, { borderColor: STATUS_COLOR[timesheet.status] ?? '#5b6472' }]}>
          <Text style={styles.cardTitle}>{timesheet.hours}h · {timesheet.status}</Text>
          <Text style={styles.cardMeta}>{new Date(timesheet.periodStart).toLocaleDateString('en-GB')} – {new Date(timesheet.periodEnd).toLocaleDateString('en-GB')}</Text>
          {timesheet.status === 'pending' ? (
            <Pressable style={[styles.actionButton, { borderColor: '#00FF66' }]} onPress={() => approve(timesheet)}>
              <Text style={[styles.actionText, { color: '#00FF66' }]}>Approve</Text>
            </Pressable>
          ) : null}
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
  navButton: { borderWidth: 1, borderRadius: 999, paddingVertical: 8, alignItems: 'center', alignSelf: 'flex-start', paddingHorizontal: 14 },
  navButtonText: { fontSize: 12, fontWeight: '700' },
  card: { backgroundColor: '#11161f', borderWidth: 1, borderRadius: 16, padding: 16, gap: 4 },
  cardTitle: { color: '#ffffff', fontSize: 16, fontWeight: '700' },
  cardMeta: { color: '#b9c2cf', fontSize: 12 },
  actionButton: { borderWidth: 1, borderRadius: 10, paddingVertical: 8, alignItems: 'center', marginTop: 8 },
  actionText: { fontSize: 12, fontWeight: '700' },
})
