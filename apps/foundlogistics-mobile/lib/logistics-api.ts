/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { authedFetch } from './api'
import { IS_DEMO_MODE } from '@foundingos/ui/mobile-runtime-mode'

// Points at the new core-operations/backend Logistics Console spec API
// (Shipment, DeliveryTask, Route, Driver, Vehicle, LocationHistory — see
// docs/console-requirements.md). This is separate from GROWTH_CONSOLE_URL
// (the legacy per-brand demo feed in logistics-poll.ts that this app's
// Driver Mode / Dispatcher Mode screens are built on) — CORE_API_BASE is
// the real FoundingOS Core.Operations-backed Logistics Console service.
// Kept as a best-effort side-write for now: the demo feed above remains the
// primary data source for these screens, and this API is called
// fire-and-forget so a real DeliveryTask record is created/updated
// alongside the existing local override, without changing the screens'
// data model or requiring a login against the Core.Operations tenant.
export const CORE_API_BASE = 'https://core-operations-api.foundingos.com/api/v1'

export type Shipment = { id: string; orderId: string; driverId?: string | null; routeId?: string | null; status: string }
export type DeliveryTask = { id: string; shipmentId: string; driverId?: string | null; status: string; eta?: string | null; completedAt?: string | null }

async function coreApiFetch<T>(path: string, init: RequestInit = {}): Promise<T | null> {
  if (IS_DEMO_MODE) return null
  try {
    const response = await authedFetch(`${CORE_API_BASE}${path}`, init)
    if (!response.ok) return null
    const data = await response.json().catch(() => null)
    return (data?.data ?? null) as T | null
  } catch {
    return null
  }
}

export const fetchShipments = () => coreApiFetch<Shipment[]>('/logistics/shipments')
export const fetchDeliveryTasks = () => coreApiFetch<DeliveryTask[]>('/logistics/tasks')
export const updateDeliveryTaskStatus = (id: string, status: string) =>
  coreApiFetch<DeliveryTask>(`/logistics/tasks/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status, ...(status === 'completed' ? { completedAt: new Date().toISOString() } : {}) }),
  })
export const recordDriverLocation = (driverId: string, lat: number, lng: number) =>
  coreApiFetch('/logistics/locations', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ driverId, lat, lng }),
  })
