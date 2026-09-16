/*
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
// Shared event backbone — the single source of truth for cross-console
// automation events. Web and mobile must both import from here so
// Core Intelligence automations and AI agent triggers fire identically
// on every surface. See docs/console-requirements.md for the full spec.

export const OS_EVENTS = {
  ORDER_CONFIRMED: 'order.confirmed',
  INVENTORY_LOW: 'inventory.low',
  SHIPMENT_CREATED: 'shipment.created',
  DELIVERY_COMPLETED: 'delivery.completed',
  INVOICE_GENERATED: 'invoice.generated',
  PAYMENT_RECEIVED: 'payment.received',
} as const

export type OsEventName = (typeof OS_EVENTS)[keyof typeof OS_EVENTS]

export type OsEventPayloadMap = {
  [OS_EVENTS.ORDER_CONFIRMED]: { orderId: string; organisationId: string }
  [OS_EVENTS.INVENTORY_LOW]: { inventoryItemId: string; organisationId: string; quantityRemaining: number }
  [OS_EVENTS.SHIPMENT_CREATED]: { shipmentId: string; organisationId: string }
  [OS_EVENTS.DELIVERY_COMPLETED]: { deliveryTaskId: string; organisationId: string }
  [OS_EVENTS.INVOICE_GENERATED]: { invoiceId: string; organisationId: string }
  [OS_EVENTS.PAYMENT_RECEIVED]: { paymentId: string; organisationId: string; method: 'card' | 'mobile_money' | 'bank_transfer' }
}

export type OsEvent<TName extends OsEventName = OsEventName> = {
  name: TName
  payload: OsEventPayloadMap[TName]
  emittedAt: string
}

// Minimal in-process event backbone. Each backend service currently runs
// as its own process, so this is a structured, swappable seam rather
// than a real message broker — call `emitOsEvent` at each mutation point
// (order confirmed, delivery completed, invoice generated, etc.) and
// register `onOsEvent` listeners for Core Intelligence automations.
// Swap the implementation for a real broker (e.g. Redis pub/sub, SQS,
// Kafka) without changing call sites once cross-process delivery is
// needed.
type OsEventListener<TName extends OsEventName> = (event: OsEvent<TName>) => void | Promise<void>

const listeners = new Map<OsEventName, Set<OsEventListener<OsEventName>>>()

export const onOsEvent = <TName extends OsEventName>(name: TName, listener: OsEventListener<TName>) => {
  if (!listeners.has(name)) listeners.set(name, new Set())
  listeners.get(name)!.add(listener as OsEventListener<OsEventName>)
  return () => listeners.get(name)?.delete(listener as OsEventListener<OsEventName>)
}

export const emitOsEvent = async <TName extends OsEventName>(name: TName, payload: OsEventPayloadMap[TName]) => {
  const event: OsEvent<TName> = { name, payload, emittedAt: new Date().toISOString() }
  const handlers = listeners.get(name)
  if (!handlers || handlers.size === 0) return event
  await Promise.all(Array.from(handlers).map((handler) => handler(event as OsEvent<OsEventName>)))
  return event
}
