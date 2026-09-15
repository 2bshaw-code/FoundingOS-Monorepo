/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { GROWTH_CONSOLE_URL } from './brand'
import { IS_DEMO_MODE } from '@foundingos/ui/mobile-runtime-mode'

export type DeliveryStatus = 'pending' | 'in-transit' | 'delivered' | 'delayed'

export type Delivery = {
  id: string
  route: string
  destination: string
  status: DeliveryStatus
  etaMins: number
  distanceKm: number
}

export type FleetStatus = 'available' | 'en-route' | 'off-duty'

export type RouteStop = { name: string; x: number; y: number; distanceFromPrevKm: number }

export type FleetVehicle = {
  id: string
  label: string
  driver: string
  route: string | null
  status: FleetStatus
  stops: RouteStop[] | null
}

export type LogisticsPollResponse = {
  mode: 'demo'
  source: string
  generatedAt: string
  refreshIntervalMinutes: number
  deliveries: Delivery[]
  fleet: FleetVehicle[]
}

// Real, live delivery/fleet feed — the same demo-mode generator that powers the web console
// (apps/logistics-console/app/api/logistics/poll), deterministic and re-seeded every 3 minutes
// server-side, no API keys/secrets/real GPS required on either side.
export async function fetchLogisticsSnapshot(): Promise<LogisticsPollResponse | null> {
  if (IS_DEMO_MODE) return null
  try {
    const response = await fetch(`${GROWTH_CONSOLE_URL}/api/logistics/poll`)
    if (!response.ok) return null
    return await response.json()
  } catch {
    return null
  }
}
