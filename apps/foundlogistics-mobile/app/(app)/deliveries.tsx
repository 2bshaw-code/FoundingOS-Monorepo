/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { useCallback, useEffect, useState } from 'react'
import { ScrollView, View, Text, Pressable, StyleSheet, ActivityIndicator, RefreshControl } from 'react-native'
import { BRAND } from '../../lib/brand'
import { fetchLogisticsSnapshot, type Delivery, type DeliveryStatus } from '../../lib/logistics-poll'
import { getOverrides, recordDeliveryAction, applyOverrides } from '../../lib/delivery-actions'

const STATUS_COLOR: Record<DeliveryStatus, string> = {
  pending: '#FFDD00',
  'in-transit': '#00CFFF',
  delivered: '#00FF66',
  delayed: '#FF0033',
}

const STATUS_LABEL: Record<DeliveryStatus, string> = {
  pending: 'Pending',
  'in-transit': 'In transit',
  delivered: 'Delivered',
  delayed: 'Delayed',
}

// Real, live deliveries list — backed by the deterministic demo feed at
// GET /api/logistics/poll (apps/logistics-console), re-seeded every 3 minutes server-side.
// "Mark delivered" / "Report delay" now write through to the real module_actions table (see
// lib/delivery-actions.ts) via POST /api/console/bespoke-actions, so the action is real,
// durable, and visible to anyone else hitting this brand's data — not just this device. The
// on-device override cache still applies instantly and offline, but it's now a cache in front
// of a real write, not the only copy of the truth.
export default function DeliveriesScreen() {
  const [deliveries, setDeliveries] = useState<Delivery[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState('')
  const [confirmedId, setConfirmedId] = useState<string | null>(null)
  const [generatedAt, setGeneratedAt] = useState('')

  const load = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true)
    setError('')
    try {
      const [snapshot, overrides] = await Promise.all([fetchLogisticsSnapshot(), getOverrides()])
      if (!snapshot) {
        setError('Could not load live deliveries. Pull down to try again.')
        return
      }
      setDeliveries(applyOverrides(snapshot.deliveries, overrides))
      setGeneratedAt(snapshot.generatedAt)
    } catch {
      setError('Could not load live deliveries. Pull down to try again.')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  async function handleAction(delivery: Delivery, status: DeliveryStatus) {
    const note =
      status === 'delivered'
        ? `Marked delivered at ${new Date().toLocaleTimeString('en-GB')}`
        : `Delay reported at ${new Date().toLocaleTimeString('en-GB')}`
    await recordDeliveryAction(delivery.id, status, note)
    setDeliveries((prev) =>
      prev.map((d) => (d.id === delivery.id ? { ...d, status, etaMins: status === 'delivered' ? 0 : d.etaMins } : d))
    )
    setConfirmedId(delivery.id)
    setTimeout(() => setConfirmedId((current) => (current === delivery.id ? null : current)), 2500)
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
      contentContainerStyle={{ padding: 16, gap: 10, paddingBottom: 120}}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => load(true)} tintColor={BRAND.accent} />}
    >
      <Text style={styles.intro}>Live deliveries across {BRAND.name}'s network — pull down to refresh.</Text>
      {generatedAt ? <Text style={styles.meta}>Demo feed updated {new Date(generatedAt).toLocaleTimeString('en-GB')}</Text> : null}
      {error ? <Text style={styles.error}>{error}</Text> : null}
      {!deliveries.length && !error ? <Text style={styles.empty}>No deliveries yet.</Text> : null}

      {deliveries.map((delivery) => (
        <View key={delivery.id} style={[styles.card, { borderColor: STATUS_COLOR[delivery.status] }]}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>{delivery.route}</Text>
            <View style={[styles.statusChip, { borderColor: STATUS_COLOR[delivery.status] }]}>
              <Text style={[styles.statusText, { color: STATUS_COLOR[delivery.status] }]}>{STATUS_LABEL[delivery.status]}</Text>
            </View>
          </View>
          <Text style={styles.cardMeta}>{delivery.destination}</Text>
          <Text style={styles.cardMeta}>
            {delivery.status === 'delivered' ? 'Arrived' : `ETA ${delivery.etaMins} min`} · {delivery.distanceKm} km
          </Text>

          {delivery.status !== 'delivered' ? (
            <View style={styles.actionRow}>
              <Pressable style={[styles.actionButton, { borderColor: '#00FF66' }]} onPress={() => handleAction(delivery, 'delivered')}>
                <Text style={[styles.actionText, { color: '#00FF66' }]}>Mark delivered</Text>
              </Pressable>
              <Pressable style={[styles.actionButton, { borderColor: '#FF0033' }]} onPress={() => handleAction(delivery, 'delayed')}>
                <Text style={[styles.actionText, { color: '#FF0033' }]}>Report delay</Text>
              </Pressable>
            </View>
          ) : null}

          {confirmedId === delivery.id ? (
            <Text style={styles.confirmedText}>✓ {STATUS_LABEL[delivery.status]} — saved</Text>
          ) : null}
        </View>
      ))}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F2942' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#0F2942' },
  intro: { color: '#b9c2cf', fontSize: 13, marginBottom: 2 },
  meta: { color: '#5b6472', fontSize: 11, marginBottom: 4 },
  error: { color: '#ff5470', fontSize: 13 },
  empty: { color: '#b9c2cf', fontSize: 13 },
  card: { backgroundColor: '#11161f', borderWidth: 1, borderRadius: 16, padding: 16, gap: 6 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardTitle: { color: '#ffffff', fontSize: 16, fontWeight: '700' },
  statusChip: { borderWidth: 1, borderRadius: 999, paddingVertical: 3, paddingHorizontal: 10 },
  statusText: { fontSize: 11, fontWeight: '700' },
  cardMeta: { color: '#b9c2cf', fontSize: 12 },
  actionRow: { flexDirection: 'row', gap: 8, marginTop: 6 },
  actionButton: { borderWidth: 1, borderRadius: 10, paddingVertical: 8, paddingHorizontal: 12, flex: 1, alignItems: 'center' },
  actionText: { fontSize: 12, fontWeight: '700' },
  confirmedText: { color: '#00FF66', fontSize: 11, marginTop: 4 },
})
