/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { brands } from '@foundingos/config'
import { QuantumHeader } from '@foundingos/ui/quantum'
import { coreOperationsApiRoot, TENANT_SESSION_COOKIE } from '../../lib/tenant-session'
import { PipelineBoard, type PipelineLead } from './pipeline-board'

export const dynamic = 'force-dynamic'

// Server-fetches the signed-in account's real leads directly from Core.Operations (skipping
// an extra hop through /api/pipeline for the initial load), then hands them to the client
// board for interactive create/update. This is the console's first module backed by real,
// tenant-scoped data instead of demo/seeded content — same backend the mobile app's Sales
// Pipeline already uses (apps/foundingos-mobile/lib/core-operations-api.ts).
async function fetchInitialPipeline(): Promise<{ leads: PipelineLead[]; awaitingReplySince: Record<string, string> } | null> {
  const token = cookies().get(TENANT_SESSION_COOKIE)?.value
  const apiRoot = coreOperationsApiRoot()
  if (!token || !apiRoot) return null
  try {
    const response = await fetch(`${apiRoot}/ops/owner/pipeline`, {
      headers: { authorization: 'Bearer ' + token },
      cache: 'no-store',
      signal: AbortSignal.timeout(15_000),
    })
    if (!response.ok) return null
    const body = await response.json().catch(() => ({})) as {
      success?: boolean
      data?: { leads?: PipelineLead[]; messages?: Array<{ customerId: string | null; direction: string; createdAt: string }> }
    }
    const leads = body.data?.leads ?? []
    // The most recent-per-customer message direction and timestamp, computed here from the
    // same messages Core.Operations already returned (no extra call) — lets the board flag
    // "Awaiting reply" leads with how long they've been waiting, instead of requiring every
    // lead's conversation panel to be opened individually just to see who's waiting and since when.
    const messages = body.data?.messages ?? []
    const latestByCustomer = new Map<string, { direction: string; createdAt: string }>()
    for (const message of messages) {
      if (!message.customerId) continue
      const existing = latestByCustomer.get(message.customerId)
      if (!existing || new Date(message.createdAt).getTime() > new Date(existing.createdAt).getTime()) {
        latestByCustomer.set(message.customerId, message)
      }
    }
    const awaitingReplySince = Object.fromEntries(
      [...latestByCustomer.entries()]
        .filter(([, message]) => message.direction === 'inbound')
        .map(([customerId, message]) => [customerId, message.createdAt])
    )
    return { leads, awaitingReplySince }
  } catch {
    return null
  }
}

export default async function ConsolePipelinePage() {
  const token = cookies().get(TENANT_SESSION_COOKIE)?.value
  if (!token) redirect('/login')

  const pipeline = await fetchInitialPipeline()
  if (pipeline === null) redirect('/login')

  return (
    <main className="q-shell q-login-shell">
      <QuantumHeader
        brand={brands.foundingos}
        eyebrow="Core.Operations"
        title="Sales Pipeline"
        description="Real leads for your account — add one, or move a stage, and it's saved immediately."
      />
      <PipelineBoard initialLeads={pipeline.leads} awaitingReplySince={pipeline.awaitingReplySince} />
    </main>
  )
}
