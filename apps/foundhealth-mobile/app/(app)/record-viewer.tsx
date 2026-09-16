/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { useEffect, useState } from 'react'
import { ScrollView, View, Text, Pressable, StyleSheet, ActivityIndicator } from 'react-native'
import { router, useLocalSearchParams } from 'expo-router'
import { BRAND } from '../../lib/brand'
import { fetchRecords, type MedicalRecord } from '../../lib/core-api'

// Record Viewer — a patient's medical record entries, real data from the
// Core.Health Health Console API.
export default function RecordViewerScreen() {
  const params = useLocalSearchParams<{ patientId?: string }>()
  const [records, setRecords] = useState<MedicalRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false
    fetchRecords(params.patientId).then((data) => {
      if (cancelled) return
      if (data === null) setError('Could not load records. Pull down to try again.')
      else setRecords(data)
      setLoading(false)
    })
    return () => { cancelled = true }
  }, [params.patientId])

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={BRAND.accent} />
      </View>
    )
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 16, gap: 10, paddingBottom: 120 }}>
      <Pressable onPress={() => router.back()}>
        <Text style={[styles.backText, { color: BRAND.accent }]}>‹ Back</Text>
      </Pressable>
      <Text style={styles.intro}>Medical record entries{params.patientId ? ` for this patient` : ''}, synced from Core.Health.</Text>
      {error ? <Text style={styles.error}>{error}</Text> : null}
      {!records.length && !error ? <Text style={styles.empty}>No record entries yet.</Text> : null}

      {records.map((record) => (
        <View key={record.id} style={[styles.card, { borderColor: BRAND.accent }]}>
          <Text style={styles.cardMeta}>{new Date(record.createdAt).toLocaleString('en-GB')}</Text>
          <Text style={styles.cardTitle}>{record.note}</Text>
        </View>
      ))}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F2942' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#0F2942' },
  backText: { fontSize: 14, fontWeight: '700' },
  intro: { color: '#b9c2cf', fontSize: 13 },
  error: { color: '#ff5470', fontSize: 13 },
  empty: { color: '#b9c2cf', fontSize: 13 },
  card: { backgroundColor: '#11161f', borderWidth: 1, borderRadius: 16, padding: 16, gap: 4 },
  cardTitle: { color: '#ffffff', fontSize: 14, fontWeight: '600' },
  cardMeta: { color: '#b9c2cf', fontSize: 11 },
})
