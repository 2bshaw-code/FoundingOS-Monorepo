/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { useCallback, useEffect, useState } from 'react'
import { ScrollView, View, Text, Pressable, StyleSheet, ActivityIndicator, RefreshControl } from 'react-native'
import { BRAND } from '../../lib/brand'
import { fetchLogisticsSnapshot, type FleetVehicle, type FleetStatus, type RouteStop } from '../../lib/logistics-poll'
import { RouteVisual } from '../../components/RouteVisual'
import { suggestVisitOrder, originalOrderDistanceKm } from '../../lib/route-optimizer'

const STATUS_COLOR: Record<FleetStatus, string> = {
  available: '#00FF66',
  'en-route': '#00CFFF',
  'off-duty': '#5b6472',
}

const STATUS_LABEL: Record<FleetStatus, string> = {
  available: 'Available',
  'en-route': 'En route',
  'off-duty': 'Off duty',
}

// Real, live fleet status board — backed by the same deterministic demo feed as the Deliveries
// tab (GET /api/logistics/poll), re-seeded every 3 minutes server-side. Selecting an active
// vehicle shows its real (demo) stop sequence as a stylised abstract visualisation (no real
// map/GPS — react-native-maps is not a dependency of this app) plus a route-optimiser
// *suggestion* computed on-device with a simple nearest-neighbour heuristic, clearly labelled
// as a suggestion rather than an authoritative routing decision.
export default function FleetScreen() {
  const [fleet, setFleet] = useState<FleetVehicle[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState('')
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const load = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true)
    setError('')
    try {
      const snapshot = await fetchLogisticsSnapshot()
      if (!snapshot) {
        setError('Could not load live fleet status. Pull down to try again.')
        return
      }
      setFleet(snapshot.fleet)
      setSelectedId((current) => current ?? snapshot.fleet.find((v) => v.stops && v.stops.length > 0)?.id ?? null)
    } catch {
      setError('Could not load live fleet status. Pull down to try again.')
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

  const selectedVehicle = fleet.find((v) => v.id === selectedId) ?? null
  const stops: RouteStop[] = selectedVehicle?.stops ?? []
  const optimised = stops.length > 0 ? suggestVisitOrder(stops) : null
  const originalDistanceKm = stops.length > 0 ? originalOrderDistanceKm(stops) : 0

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ padding: 16, gap: 10, paddingBottom: 120}}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => load(true)} tintColor={BRAND.accent} />}
    >
      <Text style={styles.intro}>Live fleet status board for {BRAND.name} — pull down to refresh.</Text>
      {error ? <Text style={styles.error}>{error}</Text> : null}

      <Text style={styles.sectionLabel}>Vehicles</Text>
      {fleet.map((vehicle) => (
        <Pressable
          key={vehicle.id}
          style={[
            styles.card,
            { borderColor: vehicle.id === selectedId ? BRAND.accent : STATUS_COLOR[vehicle.status] },
          ]}
          onPress={() => setSelectedId(vehicle.id)}
        >
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>{vehicle.label}</Text>
            <View style={[styles.statusChip, { borderColor: STATUS_COLOR[vehicle.status] }]}>
              <Text style={[styles.statusText, { color: STATUS_COLOR[vehicle.status] }]}>{STATUS_LABEL[vehicle.status]}</Text>
            </View>
          </View>
          <Text style={styles.cardMeta}>Driver: {vehicle.driver}</Text>
          <Text style={styles.cardMeta}>{vehicle.route ? `Route: ${vehicle.route}` : 'Unassigned'}</Text>
        </Pressable>
      ))}

      {selectedVehicle && stops.length > 0 ? (
        <View style={[styles.routeCard, { borderColor: BRAND.accent }]}>
          <Text style={styles.sectionLabel}>{selectedVehicle.label} — stop sequence</Text>
          <RouteVisual stops={stops} color={BRAND.accent} />

          <Text style={styles.stopListTitle}>Current order</Text>
          {stops.map((stop, index) => (
            <Text key={stop.name} style={styles.stopRow}>
              {index + 1}. {stop.name}
              {index > 0 ? ` — ${stop.distanceFromPrevKm} km from previous stop` : ' — start'}
            </Text>
          ))}
          <Text style={styles.cardMeta}>Total distance: {originalDistanceKm} km</Text>

          {optimised ? (
            <>
              <Text style={styles.suggestionTitle}>◈ Suggested route order (nearest-neighbour heuristic)</Text>
              {optimised.order.map((stop) => (
                <Text key={`opt-${stop.name}`} style={styles.stopRow}>
                  {stop.order}. {stop.name}
                  {stop.order > 1 ? ` — ${stop.legDistanceKm} km leg` : ' — start'}
                </Text>
              ))}
              <Text style={styles.cardMeta}>
                Suggested total: {optimised.totalDistanceKm} km
                {optimised.totalDistanceKm < originalDistanceKm
                  ? ` (${(originalDistanceKm - optimised.totalDistanceKm).toFixed(1)} km shorter)`
                  : ' (already close to optimal)'}
              </Text>
              <Text style={styles.disclaimer}>
                This is a computed suggestion only, not a live routing decision — no traffic data or real map is involved.
              </Text>
            </>
          ) : null}
        </View>
      ) : null}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F2942' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#0F2942' },
  intro: { color: '#b9c2cf', fontSize: 13, marginBottom: 2 },
  error: { color: '#ff5470', fontSize: 13 },
  sectionLabel: { color: '#b9c2cf', fontSize: 13, fontWeight: '700', marginTop: 4 },
  card: { backgroundColor: '#11161f', borderWidth: 1, borderRadius: 16, padding: 14, gap: 4 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardTitle: { color: '#ffffff', fontSize: 15, fontWeight: '700' },
  statusChip: { borderWidth: 1, borderRadius: 999, paddingVertical: 3, paddingHorizontal: 10 },
  statusText: { fontSize: 11, fontWeight: '700' },
  cardMeta: { color: '#b9c2cf', fontSize: 12 },
  routeCard: { backgroundColor: '#11161f', borderWidth: 1, borderRadius: 16, padding: 16, gap: 6, alignItems: 'center' },
  stopListTitle: { color: '#ffffff', fontSize: 13, fontWeight: '700', alignSelf: 'flex-start', marginTop: 6 },
  stopRow: { color: '#b9c2cf', fontSize: 12, alignSelf: 'flex-start' },
  suggestionTitle: { color: '#FFDD00', fontSize: 13, fontWeight: '700', alignSelf: 'flex-start', marginTop: 10 },
  disclaimer: { color: '#5b6472', fontSize: 10, alignSelf: 'flex-start', marginTop: 4, fontStyle: 'italic' },
})
