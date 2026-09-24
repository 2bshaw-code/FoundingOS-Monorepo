/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { brands } from '@foundingos/config'
import { QuantumCard, QuantumHeader, QuantumMetricCard, qText } from '@foundingos/ui/quantum'
import { coreOperationsApiRoot, TENANT_SESSION_COOKIE } from '../lib/tenant-session'
import { SignOutButton } from './sign-out-button'

export const dynamic = 'force-dynamic'

type TenantUser = { id: string; email: string; role: string; tenantId: string | null; name?: string | null }
type PipelineLead = { id: string; companyName: string; contactName: string | null; stage: string; valuePence: number; customerId: string | null }
type PipelineSummary = {
  leads: PipelineLead[]
  metrics: {
    leads: number
    customers: number
    openOrders: number
    messages: number
    pipelineValuePence: number
    awaitingReply: number
    avgResponseMinutes: number | null
    messagesLast24h: number
    messagesPrior24h: number
  }
}
type AgentActivity = { userId: string | null; email: string | null; messagesSent: number }

async function currentTenantUser(): Promise<TenantUser | null> {
  const token = cookies().get(TENANT_SESSION_COOKIE)?.value
  const apiRoot = coreOperationsApiRoot()
  if (!token || !apiRoot) return null
  try {
    const response = await fetch(`${apiRoot}/auth/me`, {
      headers: { authorization: `Bearer ${token}` },
      cache: 'no-store',
      signal: AbortSignal.timeout(10_000),
    })
    if (!response.ok) return null
    const body = await response.json() as { success?: boolean; user?: TenantUser }
    return body.success && body.user ? body.user : null
  } catch {
    return null
  }
}

// Real, at-a-glance pipeline summary for the account — reuses the same GET /owner/pipeline
// call the Pipeline module's server page already makes, so landing here after sign-in shows
// actual WhatsApp-connected deals and messages instead of a generic dashboard shell.
async function fetchPipelineSummary(): Promise<PipelineSummary | null> {
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
    const body = await response.json().catch(() => ({})) as { success?: boolean; data?: PipelineSummary }
    return body.data ?? null
  } catch {
    return null
  }
}

function formatMoney(pence: number) {
  return new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }).format(pence / 100)
}

// Real per-agent message activity — who on the team is actually replying, from tracked
// senderUserId on outbound CustomerMessage rows. Returns [] (not fabricated placeholder rows)
// if the endpoint is unreachable or no one has sent a tracked message yet.
async function fetchTeamActivity(): Promise<AgentActivity[]> {
  const token = cookies().get(TENANT_SESSION_COOKIE)?.value
  const apiRoot = coreOperationsApiRoot()
  if (!token || !apiRoot) return []
  try {
    const response = await fetch(`${apiRoot}/ops/owner/team-performance`, {
      headers: { authorization: 'Bearer ' + token },
      cache: 'no-store',
      signal: AbortSignal.timeout(10_000),
    })
    if (!response.ok) return []
    const body = await response.json().catch(() => ({})) as { success?: boolean; data?: AgentActivity[] }
    return body.data ?? []
  } catch {
    return []
  }
}

// Honest "busier/quieter than yesterday" phrasing for the 24h message-volume metric — never
// claims a precise percentage change from what's ultimately a capped, recent-window sample.
function messageVolumeTrendDetail(last24h: number, prior24h: number) {
  if (prior24h === 0) return last24h === 0 ? 'No messages in the last 48h' : 'No prior-day data to compare yet'
  if (last24h > prior24h) return 'Busier than yesterday'
  if (last24h < prior24h) return 'Quieter than yesterday'
  return 'Same as yesterday'
}

// Real, signed-in landing page for a tenant account inside the console — reached either by
// signing in directly at /login (which now bounces through the website's real login and back
// via /session/handoff) or by already having a valid session. This is deliberately separate
// from /founder and /console (the internal founder/admin control centre) and from every
// per-brand demo route under this app — those are untouched.
export default async function ConsoleWorkspacePage() {
  const user = await currentTenantUser()
  if (!user) redirect('/login')

  const pipeline = await fetchPipelineSummary()
  const recentLeads = (pipeline?.leads ?? []).slice(0, 5)
  const teamActivity = await fetchTeamActivity()

  return (
    <main className="q-shell q-login-shell">
      <QuantumHeader
        brand={brands.foundingos}
        eyebrow="Signed in"
        title={`Welcome back${user.name ? `, ${user.name}` : ''}`}
        description={`Signed in as ${user.email} (${user.role.replaceAll('_', ' ')}).`}
      />
      {pipeline ? (
        <div className="q-ai-domain-grid">
          <QuantumMetricCard label="Open pipeline" value={formatMoney(pipeline.metrics.pipelineValuePence)} detail={`${pipeline.metrics.leads} leads`} brand={brands.foundingos} />
          <QuantumMetricCard label="Customers" value={String(pipeline.metrics.customers)} detail="Converted from leads" brand={brands.foundingos} />
          <QuantumMetricCard label="Messages" value={String(pipeline.metrics.messages)} detail="Real WhatsApp/messaging history" brand={brands.foundingos} />
          <QuantumMetricCard
            label="Awaiting reply"
            value={String(pipeline.metrics.awaitingReply)}
            detail={pipeline.metrics.awaitingReply > 0 ? 'Customers whose last message is unanswered' : 'All caught up'}
            brand={brands.foundingos}
          />
          <QuantumMetricCard
            label="Avg. response time"
            value={pipeline.metrics.avgResponseMinutes === null ? '—' : `${pipeline.metrics.avgResponseMinutes} min`}
            detail="From recent WhatsApp replies"
            brand={brands.foundingos}
          />
          <QuantumMetricCard
            label="Messages (24h)"
            value={String(pipeline.metrics.messagesLast24h)}
            detail={messageVolumeTrendDetail(pipeline.metrics.messagesLast24h, pipeline.metrics.messagesPrior24h)}
            brand={brands.foundingos}
          />
        </div>
      ) : null}
      {pipeline && pipeline.metrics.awaitingReply > 0 ? (
        <QuantumCard brand={brands.foundingos}>
          <p className={qText.overline}>Needs a reply</p>
          <p className={qText.body}>
            {pipeline.metrics.awaitingReply} customer{pipeline.metrics.awaitingReply === 1 ? '' : 's'} sent the last
            message in their conversation and haven&apos;t heard back yet — open Sales Pipeline to reply.
          </p>
          <a className="q-button q-button-primary" href="/workspace/pipeline">
            Go to Sales Pipeline
          </a>
        </QuantumCard>
      ) : null}
      {teamActivity.length > 0 ? (
        <QuantumCard brand={brands.foundingos}>
          <p className={qText.overline}>Team activity</p>
          <p className={qText.body}>Who's actually replying, from real sent messages.</p>
          <div className="q-form-stack">
            {teamActivity.map((agent) => (
              <div key={agent.userId ?? 'unattributed'} className="q-list-row">
                <span>{agent.email ?? 'Unattributed (automated or legacy send)'}</span>
                <small>{agent.messagesSent} message{agent.messagesSent === 1 ? '' : 's'} sent</small>
              </div>
            ))}
          </div>
        </QuantumCard>
      ) : null}
      <QuantumCard brand={brands.foundingos}>
        <p className={qText.overline}>Your active pipeline</p>
        {recentLeads.length === 0 ? (
          <p className={qText.body}>No leads yet — add one in Sales Pipeline to see it here.</p>
        ) : (
          <div className="q-form-stack">
            {recentLeads.map((lead) => (
              <div key={lead.id} className="q-list-row">
                <span>{lead.companyName}</span>
                <small>
                  {lead.stage.charAt(0).toUpperCase() + lead.stage.slice(1)} · {formatMoney(lead.valuePence)}
                  {lead.customerId ? ' · Has WhatsApp conversation' : ''}
                </small>
              </div>
            ))}
          </div>
        )}
        <div className="q-form-stack">
          <a className="q-button q-button-primary" href="/workspace/pipeline">
            Open Sales Pipeline
          </a>
          <a className="q-button q-button-ghost" href="/workspace/records">
            Open Workspace Records
          </a>
          <SignOutButton />
        </div>
      </QuantumCard>
    </main>
  )
}
