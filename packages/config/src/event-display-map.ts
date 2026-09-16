/*
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
// Display metadata for the shared cross-suite Event Feed (Phase 7B).
// Maps raw event type strings (as stored in the Event table / streamed
// over SSE) to a human title, icon, and the console source colour so
// packages/ui/src/event-feed and every mobile app can render events
// consistently without duplicating this table.

export type EventSource = 'retail' | 'logistics' | 'finance' | 'talent' | 'health' | 'core_operations'

export type EventDisplayMeta = {
  title: string
  icon: string
}

export const EVENT_DISPLAY_MAP: Record<string, EventDisplayMeta> = {
  'order.confirmed': { title: 'Order Confirmed', icon: '🛒' },
  'inventory.low': { title: 'Inventory Low', icon: '📉' },
  'shipment.created': { title: 'Shipment Created', icon: '🚚' },
  'delivery.completed': { title: 'Delivery Completed', icon: '✅' },
  'invoice.generated': { title: 'Invoice Generated', icon: '🧾' },
  'payment.received': { title: 'Payment Received', icon: '💳' },
  'payroll.run': { title: 'Payroll Run Completed', icon: '💰' },
  'payroll.synced': { title: 'Payroll Synced to Finance', icon: '💰' },
  'timesheet.approved': { title: 'Timesheet Approved', icon: '🕒' },
  'appointment.created': { title: 'Appointment Created', icon: '🗓️' },
  'medical.billing.generated': { title: 'Medical Billing Generated', icon: '🏥' },
  'billing.synced': { title: 'Billing Synced to Finance', icon: '🏥' },
}

export const SOURCE_COLORS: Record<EventSource, string> = {
  retail: '#00E676',
  logistics: '#4A90E2',
  finance: '#3AA6A0',
  talent: '#E2A84A',
  health: '#3AA6A0',
  core_operations: '#00E676',
}

export function eventDisplayTitle(type: string): string {
  return EVENT_DISPLAY_MAP[type]?.title ?? type
}

export function eventDisplayIcon(type: string): string {
  return EVENT_DISPLAY_MAP[type]?.icon ?? '•'
}

export function sourceColor(source: string): string {
  return SOURCE_COLORS[source as EventSource] ?? '#A8B3C3'
}
