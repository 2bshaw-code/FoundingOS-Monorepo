/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { useCallback, useEffect, useRef, useState } from 'react'
import { View, Text, FlatList, Pressable, StyleSheet, ActivityIndicator, RefreshControl } from 'react-native'
import { router } from 'expo-router'
import { eventDisplayIcon, eventDisplayTitle, sourceColor } from '@foundingos/config/event-display-map'
import { BRAND } from '../lib/brand'
import { fetchEvents, type FeedEvent } from '../lib/events-api'

const SOURCES = ['retail', 'logistics', 'finance', 'talent', 'health'] as const

export default function EventFeedScreen() {
  const [events, setEvents] = useState<FeedEvent[]>([])
  const [filter, setFilter] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState('')
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const load = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true)
    setError('')
    const data = await fetchEvents(filter ?? undefined)
    if (data === null) { setError('Could not load events. Pull down to try again.') }
    else { setEvents(data) }
    setLoading(false)
    setRefreshing(false)
  }, [filter])

  useEffect(() => {
    load()
    pollRef.current = setInterval(load, 5000)
    return () => { if (pollRef.current) clearInterval(pollRef.current) }
  }, [load])

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={BRAND.accent} />
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <Pressable onPress={() => router.back()}>
        <Text style={[styles.backText, { color: BRAND.accent }]}>‹ Back</Text>
      </Pressable>
      <Text style={styles.heading}>Event Feed</Text>
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <View style={styles.filters}>
        <Pressable onPress={() => setFilter(null)} style={[styles.filterChip, !filter && { borderColor: BRAND.accent }]}>
          <Text style={styles.filterText}>All</Text>
        </Pressable>
        {SOURCES.map((source) => (
          <Pressable key={source} onPress={() => setFilter(source)} style={[styles.filterChip, filter === source && { borderColor: BRAND.accent }]}>
            <Text style={styles.filterText}>{source}</Text>
          </Pressable>
        ))}
      </View>
      <FlatList
        data={events}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16, gap: 10, paddingBottom: 120 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => load(true)} tintColor={BRAND.accent} />}
        ListEmptyComponent={<Text style={styles.empty}>No events yet.</Text>}
        renderItem={({ item }) => (
          <Pressable
            style={[styles.item, { borderLeftColor: sourceColor(item.source) }]}
            onPress={() => setExpandedId(expandedId === item.id ? null : item.id)}
          >
            <View style={styles.itemHeader}>
              <Text style={styles.itemIcon}>{eventDisplayIcon(item.type)}</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.itemTitle}>{eventDisplayTitle(item.type)}</Text>
                <Text style={styles.itemMeta}>{item.source} · {new Date(item.createdAt).toLocaleString()}</Text>
              </View>
            </View>
            {expandedId === item.id ? (
              <Text style={styles.payload}>{JSON.stringify(item.payload, null, 2)}</Text>
            ) : null}
          </Pressable>
        )}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 60, paddingHorizontal: 16 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  backText: { fontSize: 16, marginBottom: 8 },
  heading: { fontSize: 22, fontWeight: '700', color: '#fff', marginBottom: 12 },
  error: { color: '#f87171', marginBottom: 8 },
  filters: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 8 },
  filterChip: { paddingVertical: 6, paddingHorizontal: 12, borderRadius: 16, borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)' },
  filterText: { color: '#fff', fontSize: 12, textTransform: 'capitalize' },
  empty: { color: 'rgba(255,255,255,0.6)', textAlign: 'center', marginTop: 40 },
  item: { backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 12, padding: 12, borderLeftWidth: 3 },
  itemHeader: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  itemIcon: { fontSize: 20 },
  itemTitle: { color: '#fff', fontSize: 15, fontWeight: '600' },
  itemMeta: { color: 'rgba(255,255,255,0.5)', fontSize: 12, marginTop: 2 },
  payload: { color: 'rgba(255,255,255,0.7)', fontSize: 11, marginTop: 10, fontFamily: 'monospace' },
})
