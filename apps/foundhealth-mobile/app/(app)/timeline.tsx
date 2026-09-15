/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { useCallback, useEffect, useState } from 'react'
import { useFocusEffect } from 'expo-router'
import { ScrollView, View, Text, StyleSheet, ActivityIndicator, RefreshControl } from 'react-native'
import { BRAND } from '../../lib/brand'
import { fetchClinicFeed, type ActivityEvent } from '../../lib/clinic-feed'
import { getHealthActions } from '../../lib/health-actions'

type MergedEvent = { id: string; type: string; title: string; timestamp: string }

const TYPE_ICON: Record<string, string> = {
  queue: '🧑‍⚕️', supply: '💊', 'cold-chain': '❄️', staffing: '👥', outreach: '🚐', equipment: '🛠️', scan: '📄',
}

// Clinic Activity — a live log of what's happening across the clinic: queue peaks, restocks,
// cold-chain events, staffing changes, outreach visits, plus any restock or scan actions
// recorded locally on this device (lib/health-actions.ts). Sorted chronologically, newest
// first — the operations feed for running the clinic, not a personal medical history.
export default function TimelineScreen() {
  const [events, setEvents] = useState<MergedEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState('')
  const [disclaimer, setDisclaimer] = useState('')

  const load = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true)
    setError('')
    try {
      const [feed, local] = await Promise.all([fetchClinicFeed(), getHealthActions()])
      const merged: MergedEvent[] = []
      if (feed) {
        setDisclaimer(feed.disclaimer)
        merged.push(...feed.activity.map((e: ActivityEvent) => ({ id: e.id, type: e.type, title: e.title, timestamp: e.timestamp })))
      } else {
        setError('Could not load clinic activity. Pull down to try again.')
      }
      merged.push(
        ...local.loggedRestocks.map((r) => ({
          id: `local-restock-${r.id}`,
          type: 'supply',
          title: `Logged restock: +${r.quantity} ${r.supplyName}`,
          timestamp: r.timestamp,
        }))
      )
      merged.push(
        ...local.scannedRecords.map((s) => ({
          id: `local-scan-${s.id}`,
          type: 'scan',
          title: `Scanned document: ${s.title}`,
          timestamp: s.timestamp,
        }))
      )
      merged.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      setEvents(merged)
    } catch {
      setError('Could not load clinic activity. Pull down to try again.')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  // Refresh whenever this tab regains focus so a restock logged on the Vitals tab or a
  // document just scanned shows up immediately without needing a manual pull-to-refresh.
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
      contentContainerStyle={{ padding: 16, gap: 10, paddingBottom: 120}}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => load(true)} tintColor={BRAND.accent} />}
    >
      <Text style={styles.intro}>Clinic activity — queue, supply, staffing and equipment events, newest first.</Text>
      {disclaimer ? <Text style={styles.disclaimer}>⚠ {disclaimer}</Text> : null}
      {error ? <Text style={styles.error}>{error}</Text> : null}
      {!loading && events.length === 0 && !error ? <Text style={styles.empty}>No activity yet.</Text> : null}

      {events.map((event) => (
        <View key={event.id} style={[styles.card, { borderColor: BRAND.accent }]}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardIcon}>{TYPE_ICON[event.type] ?? '•'}</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.cardTitle}>{event.title}</Text>
            </View>
          </View>
          <Text style={styles.cardTime}>{new Date(event.timestamp).toLocaleString('en-GB')}</Text>
        </View>
      ))}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F2942' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#0F2942' },
  intro: { color: '#b9c2cf', fontSize: 13, marginBottom: 2 },
  disclaimer: { color: '#FFDD00', fontSize: 11, marginBottom: 4 },
  error: { color: '#ff5470', fontSize: 13 },
  empty: { color: '#b9c2cf', fontSize: 13 },
  card: { backgroundColor: '#11161f', borderWidth: 1, borderRadius: 16, padding: 14, gap: 6 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  cardIcon: { fontSize: 20 },
  cardTitle: { color: '#ffffff', fontSize: 15, fontWeight: '700' },
  cardTime: { color: '#5b6472', fontSize: 11 },
})
