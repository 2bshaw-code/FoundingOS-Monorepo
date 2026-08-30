/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { PrismaClient } from '@prisma/client'

// Dormant-safe by design: PrismaClient is only ever constructed when
// getPrismaClient() is called AND DATABASE_URL is actually set. Simply
// importing this module (as commercial-mode-aware code does) must never
// throw or attempt a connection — that's what keeps Demo Mode working
// with zero credentials.
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient }

export function isDatabaseConfigured() {
  return Boolean(process.env.DATABASE_URL)
}

export function getPrismaClient(): PrismaClient | null {
  if (!isDatabaseConfigured()) return null
  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = new PrismaClient()
  }
  return globalForPrisma.prisma
}

// Retained for callers that already assume a live connection is configured
// (e.g. scripts run only after DATABASE_URL is set). Prefer getPrismaClient()
// in any code path that must also work in Demo Mode.
export const prisma = new Proxy({} as PrismaClient, {
  get(_target, prop) {
    const client = getPrismaClient()
    if (!client) {
      throw new Error('DATABASE_URL is not set — FounderOS is running in Demo Mode. Set DATABASE_URL to enable Commercial Mode.')
    }
    return (client as any)[prop]
  },
})
