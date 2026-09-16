/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
// Unified cross-suite Event Feed (Phase 7B) — normalized storage +
// publish/read endpoints so every console/mobile app can show one
// time-sorted activity stream regardless of which backend produced
// the event. See docs/console-requirements.md (Shared Event Feed).
import type { Response } from 'express'
import { onOsEvent, OS_EVENTS } from '@foundingos/config/events'
import { prisma } from './auth.js'

const text = (value: unknown) => String(value || '').trim()
const jsonPayload = (value: unknown) => JSON.parse(JSON.stringify(value ?? {}))

export const publishEvent = (input: Record<string, unknown>) => {
  const type = text(input.type)
  const source = text(input.source)
  if (!type || !source) throw Object.assign(new Error('type and source are required'), { status: 400 })
  return prisma.event.create({ data: { type, source, payload: jsonPayload(input.payload) } })
}

export const listEvents = (limit = 200, source?: string) =>
  prisma.event.findMany({
    where: source ? { source } : undefined,
    orderBy: { createdAt: 'desc' },
    take: Math.min(Math.max(limit, 1), 500),
  })

// Lightweight in-process SSE broadcaster. Each backend instance keeps its
// own subscriber list — sufficient for the current single-process
// deployment model (see packages/config/src/events.ts's onOsEvent for the
// same pattern used for in-process automation triggers).
const streamClients = new Set<Response>()

export const registerEventStreamClient = (res: Response) => {
  streamClients.add(res)
  return () => streamClients.delete(res)
}

export const broadcastEvent = (event: unknown) => {
  const data = `data: ${JSON.stringify(event)}\n\n`
  streamClients.forEach((client) => client.write(data))
}

export const publishAndBroadcastEvent = async (input: Record<string, unknown>) => {
  const event = await publishEvent(input)
  broadcastEvent(event)
  return event
}

// Bridges the in-process OS_EVENTS automation bus (packages/config/src/events.ts)
// into the persisted Event Feed, so every order.confirmed/inventory.low/
// shipment.created/etc. emitted by operations.ts/finance.ts also shows up
// in the shared feed without every call site needing to publish twice.
// Call once at server startup.
export const bridgeOsEventsToEventFeed = () => {
  Object.values(OS_EVENTS).forEach((name) => {
    onOsEvent(name, (event) => {
      publishAndBroadcastEvent({ type: event.name, source: 'core_operations', payload: event.payload }).catch(() => {})
    })
  })
}
