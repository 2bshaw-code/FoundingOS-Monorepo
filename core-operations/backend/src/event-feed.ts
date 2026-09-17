/*
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { prisma } from './auth.js'
import { Prisma } from './generated/prisma/index.js'
import { generateAndStoreInsights, type FeedEvent } from './insights.js'

type StreamClient = { write: (chunk: string) => boolean }
const clients = new Set<StreamClient>()

const json = (value: unknown): Prisma.InputJsonValue => JSON.parse(JSON.stringify(value ?? {})) as Prisma.InputJsonValue

export const publishEvent = async (input: { tenantId?: string; type: string; source: string; payload?: unknown }) => {
  const event = await prisma.event.create({
    data: { tenantId: input.tenantId, type: input.type, source: input.source, payload: json(input.payload) },
  })
  const frame = `data: ${JSON.stringify(event)}\n\n`
  for (const client of clients) {
    try { client.write(frame) } catch { clients.delete(client) }
  }
  await generateAndStoreInsights(event as FeedEvent)
  return event
}

export const listEvents = (tenantId: string | undefined, source?: string) =>
  prisma.event.findMany({
    where: { ...(tenantId ? { tenantId } : {}), ...(source ? { source } : {}) },
    orderBy: { createdAt: 'desc' },
    take: 200,
  })

export const registerEventStreamClient = (client: StreamClient) => {
  clients.add(client)
  return () => clients.delete(client)
}
