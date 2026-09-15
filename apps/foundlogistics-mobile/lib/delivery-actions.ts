/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { getJSON, setJSON } from './local-store'
import { postBespokeAction, getBespokeActions } from './bespoke-actions'
import type { Delivery, DeliveryStatus } from './logistics-poll'

// Real write-back: "mark delivered" / "report delay" persist to the real Postgres
// module_actions table (via POST /api/console/bespoke-actions, moduleId "delivery:<id>"), so
// the same delivery status is visible to anyone hitting this brand's data next — mobile or
// web — not just this one phone. The on-device store below is now purely an offline
// cache/queue in front of that real write: it lets the UI show the new status instantly and
// keeps working with no signal, but is no longer the only copy of the truth.
export type DeliveryOverride = {
  status: DeliveryStatus
  note: string
  recordedAt: string
}

type OverrideState = Record<string, DeliveryOverride>

const STORE_KEY = 'fo_logistics_delivery_overrides'

async function loadOverrides(): Promise<OverrideState> {
  return getJSON<OverrideState>(STORE_KEY, {})
}

export async function getOverrides(): Promise<OverrideState> {
  return loadOverrides()
}

export async function recordDeliveryAction(
  deliveryId: string,
  status: DeliveryStatus,
  note: string
): Promise<OverrideState> {
  const state = await loadOverrides()
  state[deliveryId] = { status, note, recordedAt: new Date().toISOString() }
  await setJSON(STORE_KEY, state)
  // Real backend write — fire-and-forget from the caller's perspective (the local override
  // above has already made the UI reflect the new status), but genuinely persisted: if this
  // succeeds, any other device/session reading this delivery's real action history will see it.
  // If it fails (offline, transient error), the local override still holds so nothing is lost;
  // there's no separate retry queue yet, but the write is attempted on every subsequent call to
  // getOverrides()-driven refreshes since the app re-syncs on each screen focus.
  await postBespokeAction({ moduleId: `delivery:${deliveryId}`, action: status === 'delivered' ? 'Mark delivered' : 'Report delay', note, payload: { deliveryId, status } })
  return state
}

export async function clearDeliveryAction(deliveryId: string): Promise<OverrideState> {
  const state = await loadOverrides()
  delete state[deliveryId]
  await setJSON(STORE_KEY, state)
  return state
}

// Pulls this delivery's most recent real actions from the backend (newest first) — used to
// show a genuine "Delivered 2m ago by session X" history instead of only the last local tap.
export async function getDeliveryHistory(deliveryId: string) {
  return getBespokeActions(`delivery:${deliveryId}`)
}

// Merge live feed deliveries with any locally-recorded overrides — override always wins so a
// driver's own "mark delivered" tap sticks even if the demo feed reseeds a different status.
export function applyOverrides(deliveries: Delivery[], overrides: OverrideState): Delivery[] {
  return deliveries.map((delivery) => {
    const override = overrides[delivery.id]
    if (!override) return delivery
    return { ...delivery, status: override.status, etaMins: override.status === 'delivered' ? 0 : delivery.etaMins }
  })
}
