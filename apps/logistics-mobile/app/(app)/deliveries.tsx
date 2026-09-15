/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { useCallback, useEffect, useState } from 'react'
import { ScrollView, View, Text, StyleSheet, ActivityIndicator, RefreshControl, Pressable } from 'react-native'
import MapView, { Marker, Polyline } from 'react-native-maps'
import { authedFetch } from '../../lib/api'
import { BRAND, GROWTH_CONSOLE_URL } from '../../lib/brand'

// Real Deliveries screen — FoundLogistics's own carrier-side view of every route/stop, backed
// by the same live database as the console (GET /api/logistics/routes). Uses a real map
// (react-native-maps — Apple Maps on iOS, no API key needed) to show depot, live vehicle
// position, and every stop, exactly like the console's Fleet map.

type Shipment = {
  id: string
  reference: string
  transportType: string
  status: string
  destinationName: string
  destinationLat: number | null
  destinationLng: number | null
}
type RouteStop = { id: string; sequence: number; shipment: Shipment }
type DeliveryRoute = {
  id: string
  status: string
  currentLat: number | null
  currentLng: number | null
  depot: { id: string; name: string; lat: number; lng: number }
  driver: { id: string; name: string } | null
  vehicle: { id: string; registration: string } | null
  stops: RouteStop[]
}

export default function DeliveriesScreen() {
  const [routes, setRoutes] = useState<DeliveryRoute[]>([])
  const [selectedRouteId, setSelectedRouteId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState('')

  const load = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true)
    setError('')
    try {
      const res = await authedFetch(`${GROWTH_CONSOLE_URL}/api/logistics/routes`)
      if (!res.ok) {
        setError('Could not load deliveries. Pull down to try again.')
        return
      }
      const data = await res.json()
      setRoutes(data.routes ?? [])
      setSelectedRouteId((current) => current ?? data.routes?.[0]?.id ?? null)
    } catch {
      setError('Could not load deliveries. Pull down to try again.')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const markDelivered = async (shipmentId: string) => {
    await authedFetch(`${GROWTH_CONSOLE_URL}/api/logistics/shipments`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ shipmentId, status: 'delivered' }),
    })
    load(true)
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={BRAND.accent} />
      </View>
    )
  }

  const selectedRoute = routes.find((r) => r.id === selectedRouteId) ?? routes[0]
  const stopsWithCoords = selectedRoute?.stops.filter((s) => s.shipment.destinationLat != null && s.shipment.destinationLng != null) ?? []
  const region = selectedRoute
    ? { latitude: selectedRoute.depot.lat, longitude: selectedRoute.depot.lng, latitudeDelta: 0.3, longitudeDelta: 0.3 }
    : { latitude: 51.5072, longitude: -0.1276, latitudeDelta: 0.3, longitudeDelta: 0.3 }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ padding: 16, gap: 12 }}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => load(true)} tintColor={BRAND.accent} />}
    >
      <View style={styles.hero}>
        <Text style={styles.heroTitle}>Deliveries</Text>
        <Text style={styles.heroSubtitle}>Every route booked by our brands, live on the map.</Text>
      </View>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      {routes.length === 0 ? (
        <Text style={styles.empty}>No active routes yet.</Text>
      ) : (
        <>
          <View style={styles.routeTabs}>
            {routes.map((route) => (
              <Pressable
                key={route.id}
                onPress={() => setSelectedRouteId(route.id)}
                style={[styles.routeTab, { borderColor: BRAND.accent, backgroundColor: route.id === selectedRoute?.id ? BRAND.accent : 'transparent' }]}
              >
                <Text style={[styles.routeTabText, { color: route.id === selectedRoute?.id ? '#0b0e14' : '#ffffff' }]}>{route.depot.name}</Text>
              </Pressable>
            ))}
          </View>

          <View style={styles.mapCard}>
            <MapView style={styles.map} initialRegion={region} region={region}>
              <Marker coordinate={{ latitude: selectedRoute!.depot.lat, longitude: selectedRoute!.depot.lng }} title={selectedRoute!.depot.name} pinColor="#2563eb" />
              {selectedRoute!.currentLat != null && selectedRoute!.currentLng != null && (
                <Marker
                  coordinate={{ latitude: selectedRoute!.currentLat, longitude: selectedRoute!.currentLng }}
                  title={selectedRoute!.vehicle?.registration ?? 'Vehicle'}
                  pinColor="#16a34a"
                />
              )}
              {stopsWithCoords.map((stop) => (
                <Marker
                  key={stop.id}
                  coordinate={{ latitude: stop.shipment.destinationLat as number, longitude: stop.shipment.destinationLng as number }}
                  title={`#${stop.sequence + 1} ${stop.shipment.destinationName}`}
                  description={stop.shipment.reference}
                  pinColor="#f59e0b"
                />
              ))}
              {stopsWithCoords.length > 1 && (
                <Polyline
                  coordinates={[
                    { latitude: selectedRoute!.depot.lat, longitude: selectedRoute!.depot.lng },
                    ...stopsWithCoords.map((s) => ({ latitude: s.shipment.destinationLat as number, longitude: s.shipment.destinationLng as number })),
                  ]}
                  strokeColor={BRAND.accent}
                  strokeWidth={3}
                />
              )}
            </MapView>
          </View>

          <Text style={styles.modulesLabel}>Stops ({selectedRoute?.stops.length ?? 0})</Text>
          {selectedRoute?.stops.map((stop) => (
            <View key={stop.id} style={styles.stopCard}>
              <View style={{ flex: 1 }}>
                <Text style={styles.stopTitle}>
                  #{stop.sequence + 1} {stop.shipment.destinationName}
                </Text>
                <Text style={styles.stopSubtitle}>
                  {stop.shipment.reference} · {stop.shipment.transportType}
                </Text>
              </View>
              {stop.shipment.status !== 'delivered' ? (
                <Pressable onPress={() => markDelivered(stop.shipment.id)} style={[styles.deliverButton, { borderColor: BRAND.accent }]}>
                  <Text style={{ color: BRAND.accent, fontSize: 12, fontWeight: '700' }}>Mark delivered</Text>
                </Pressable>
              ) : (
                <Text style={styles.deliveredText}>Delivered ✓</Text>
              )}
            </View>
          ))}
        </>
      )}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F2942' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#0F2942' },
  hero: { marginBottom: 4 },
  heroTitle: { color: '#ffffff', fontSize: 22, fontWeight: '800' },
  heroSubtitle: { color: '#b9c2cf', fontSize: 14, marginTop: 4 },
  error: { color: '#ff5470', fontSize: 13 },
  empty: { color: '#b9c2cf', fontSize: 14 },
  routeTabs: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  routeTab: { borderWidth: 1, borderRadius: 999, paddingVertical: 8, paddingHorizontal: 14 },
  routeTabText: { fontSize: 13, fontWeight: '600' },
  mapCard: { height: 300, borderRadius: 16, overflow: 'hidden' },
  map: { width: '100%', height: '100%' },
  modulesLabel: { color: '#b9c2cf', fontSize: 13, fontWeight: '600', marginTop: 8 },
  stopCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#11161f', borderRadius: 12, padding: 12, gap: 8 },
  stopTitle: { color: '#ffffff', fontSize: 14, fontWeight: '700' },
  stopSubtitle: { color: '#b9c2cf', fontSize: 12, marginTop: 2, textTransform: 'capitalize' },
  deliverButton: { borderWidth: 1, borderRadius: 8, paddingVertical: 6, paddingHorizontal: 10 },
  deliveredText: { color: '#16a34a', fontSize: 12, fontWeight: '700' },
})
