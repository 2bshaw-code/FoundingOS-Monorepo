/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { getJSON, setJSON } from './local-store'
import { postBespokeAction } from './bespoke-actions'

// Real actions store, now with real write-back — there is no live clinic-management backend
// behind FoundHealth (the only real backend is the demo-mode read-only clinic feed at
// /api/health/clinic-feed), so "confirm schedule item" and "log supply restock" persist
// on-device for instant/offline UI, but every action is also written through to the real
// module_actions table (moduleId "health-actions") via POST /api/console/bespoke-actions —
// real, durable, cross-device state.

export type LoggedRestock = {
  id: string
  supplyId: string
  supplyName: string
  quantity: number
  timestamp: string
}

export type ScheduleAction = {
  scheduleId: string
  status: 'confirmed' | 'rescheduled'
  note?: string
  timestamp: string
}

export type ScannedRecordEntry = {
  id: string
  title: string
  summary: string
  confidenceScore: number
  timestamp: string
}

type HealthActionsState = {
  loggedRestocks: LoggedRestock[]
  scheduleActions: Record<string, ScheduleAction>
  scannedRecords: ScannedRecordEntry[]
}

const STORE_KEY = 'fo_health_local_actions'
const EMPTY_STATE: HealthActionsState = { loggedRestocks: [], scheduleActions: {}, scannedRecords: [] }

async function loadState(): Promise<HealthActionsState> {
  return getJSON<HealthActionsState>(STORE_KEY, EMPTY_STATE)
}

async function saveState(state: HealthActionsState): Promise<void> {
  await setJSON(STORE_KEY, state)
}

export async function getHealthActions(): Promise<HealthActionsState> {
  return loadState()
}

export async function logRestock(entry: Omit<LoggedRestock, 'id' | 'timestamp'>): Promise<LoggedRestock> {
  const state = await loadState()
  const restock: LoggedRestock = { ...entry, id: `${Date.now()}-restock`, timestamp: new Date().toISOString() }
  state.loggedRestocks.unshift(restock)
  await saveState(state)
  await postBespokeAction({ moduleId: 'health-actions', action: 'Log supply restock', note: `${entry.supplyName} +${entry.quantity}`, payload: restock })
  return restock
}

export async function recordScheduleAction(scheduleId: string, status: ScheduleAction['status'], note?: string): Promise<ScheduleAction> {
  const state = await loadState()
  const action: ScheduleAction = { scheduleId, status, note, timestamp: new Date().toISOString() }
  state.scheduleActions[scheduleId] = action
  await saveState(state)
  await postBespokeAction({ moduleId: 'health-actions', action: status === 'confirmed' ? 'Confirm schedule item' : 'Reschedule', note: note ?? scheduleId, payload: action })
  return action
}

export async function recordScannedDocument(entry: Omit<ScannedRecordEntry, 'id' | 'timestamp'>): Promise<ScannedRecordEntry> {
  const state = await loadState()
  const record: ScannedRecordEntry = { ...entry, id: `${Date.now()}-scan`, timestamp: new Date().toISOString() }
  state.scannedRecords.unshift(record)
  await saveState(state)
  return record
}
