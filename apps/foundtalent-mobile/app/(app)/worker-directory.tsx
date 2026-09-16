/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { useCallback, useEffect, useState } from 'react'
import { ScrollView, View, Text, Pressable, StyleSheet, ActivityIndicator, RefreshControl } from 'react-native'
import { router } from 'expo-router'
import { BRAND } from '../../lib/brand'
import { fetchWorkers, type Worker } from '../../lib/core-api'

// Worker Directory — real workers from the Core.Workforce Talent Console API.
export default function WorkerDirectoryScreen() {
  const [workers, setWorkers] = useState<Worker[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState('')

  const load = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true)
    const data = await fetchWorkers()
    if (data === null) setError('Could not load workers. Pull down to try again.')
    else { setWorkers(data); setError('') }
    setLoading(false)
    setRefreshing(false)
  }, [])

  useEffect(() => { load() }, [load])

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
      <Text style={styles.intro}>All active workers, synced from Core.Workforce.</Text>
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <Pressable style={[styles.navButton, { borderColor: BRAND.accent }]} onPress={() => router.push('/timesheets')}>
        <Text style={[styles.navButtonText, { color: BRAND.accent }]}>Timesheets</Text>
      </Pressable>
      {!workers.length && !error ? <Text style={styles.empty}>No workers yet.</Text> : null}

      {workers.map((worker) => (
        <View key={worker.id} style={[styles.card, { borderColor: BRAND.accent }]}>
          <Text style={styles.cardTitle}>{worker.name}</Text>
          <Text style={styles.cardMeta}>{worker.role} · {worker.employmentType}{worker.region ? ` · ${worker.region}` : ''}</Text>
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
  empty: { color: '#b9c2cf', fontSize: 13 },
  navButton: { borderWidth: 1, borderRadius: 999, paddingVertical: 8, alignItems: 'center', alignSelf: 'flex-start', paddingHorizontal: 14 },
  navButtonText: { fontSize: 12, fontWeight: '700' },
  card: { backgroundColor: '#11161f', borderWidth: 1, borderRadius: 16, padding: 16, gap: 4 },
  cardTitle: { color: '#ffffff', fontSize: 16, fontWeight: '700' },
  cardMeta: { color: '#b9c2cf', fontSize: 12 },
})
