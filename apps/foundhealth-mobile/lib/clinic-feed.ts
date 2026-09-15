/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { GROWTH_CONSOLE_URL } from './brand'
import { authedFetch } from './api'

// Real, live fetch of this brand's own demo-mode clinic-operations feed — a staff-facing view
// of running the clinic (patient queue/census, staffing, supply/cold-chain status), matching
// how every other brand console works here (Fleet for FoundLogistics, Inventory for
// FoundRetail, etc.). Clearly labeled synthetic/demo data server-side (`mode: 'demo'`,
// `disclaimer`), reseeded every 15 minutes, no external calls/secrets, no real PHI.
export type SeriesPoint = { timestamp: string; value: number }

export type ClinicQueue = {
  waitingNow: number
  avgWaitMinutes: number
  seenToday: number
  bedsOccupied: number
  bedsTotal: number
  censusHistory: SeriesPoint[]
}

export type StaffingRow = {
  role: string
  onShiftNow: number
  total: number
}

export type SupplyStatus = 'low' | 'watch' | 'good'

export type SupplyItem = {
  id: string
  name: string
  unit: string
  stock: number
  reorderLevel: number
  status: SupplyStatus
  coldChain: boolean
}

export type EquipmentStatus = 'risk' | 'watch' | 'good'

export type EquipmentItem = {
  id: string
  name: string
  kind: string
  tempC: number | null
  status: EquipmentStatus
  uptimePercent: number
  tempHistory?: SeriesPoint[]
}

export type ActivityEvent = {
  id: string
  type: string
  title: string
  timestamp: string
}

export type ScheduleItem = {
  id: string
  title: string
  kind: string
  detail: string
  timestamp: string
  status: 'scheduled' | 'confirmed' | 'rescheduled'
}

export type ClinicFeedResponse = {
  mode: 'demo'
  disclaimer: string
  source: string
  generatedAt: string
  refreshIntervalMinutes: number
  queue: ClinicQueue
  staffing: StaffingRow[]
  supplies: SupplyItem[]
  equipment: EquipmentItem[]
  activity: ActivityEvent[]
  schedule: ScheduleItem[]
}

export async function fetchClinicFeed(): Promise<ClinicFeedResponse | null> {
  const response = await authedFetch(`${GROWTH_CONSOLE_URL}/api/health/clinic-feed`)
  if (!response.ok) return null
  return response.json()
}
