'use client'
/*
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
// Founder SuperDash: subscriptions, revenue, upgrade requests, platform health,
// growth, plus FoundingOS's own Finance (books, P&L, runway) and Marketing (FoundAI posts, campaigns, calendar).
import { useCallback, useEffect, useState } from 'react'
import { FounderFinancePanel, FounderMarketingPanel } from './founder-superdash-modules'
import { getProductionSession, loginToProduction, logoutProduction, productionRequest } from './workspace-production-client'

export type FounderOverview = {
  generatedAt: string
  subscriptions: { customers: number; paying: number; free: number; new7d: number; new30d: number; active7d: number; byPlan: Array<{ plan: string; name: string; customers: number; mrrGbp: number }>; workspaceAdoption: Array<{ workspace: string; customers: number }>; signupsByDay: Array<{ date: string; count: number }> }
  finance: { mrrGbp: number; arrGbp: number; arpuGbp: number; boltOns: Array<{ workspace: string; customers: number; mrrGbp: number }>; billingLive: boolean; note: string }
  monitoring: { apiOk: boolean; dbLatencyMs: number; aiConfigured: boolean; emailConfigured: boolean; upgradeEmailsConfigured: boolean; lastAutopilotRunAt: string | null; aiRequests24h: number; autopilotActions24h: number; recordsCreated24h: number; integrationsConnected: number; integrationsFailing: Array<{ business: string; provider: string; status: string }> }
  upgradeRequests: Array<{ id: string; tenantId: string; business: string; ownerEmail: string; requested: string[]; pending: string[]; note: string; createdAt: string }>
  tenants: Array<{ tenantId: string; businessName: string; ownerName: string; ownerEmail: string; plan: string; planName: string; workspaces: string[]; seats: number; monthlyValueGbp: number; status: string; createdAt: string; lastActiveAt: string | null }>
}

const gbp = (value: number) => `£${value.toLocaleString('en-GB', { maximumFractionDigits: 2 })}`
const ago = (iso: string | null) => {
  if (!iso) return 'never'
  const minutes = Math.round((Date.now() - Date.parse(iso)) / 60000)
  if (minutes < 60) return `${Math.max(minutes, 0)}m ago`
  if (minutes < 1440) return `${Math.round(minutes / 60)}h ago`
  return `${Math.round(minutes / 1440)}d ago`
}
const title = (slug: string) => slug.charAt(0).toUpperCase() + slug.slice(1)

export function FounderSuperDash() {
  const [signedIn, setSignedIn] = useState(false)
  const [data, setData] = useState<FounderOverview | null>(null)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [filter, setFilter] = useState('')
  const [tab, setTab] = useState<'overview' | 'finance' | 'marketing'>('overview')

  const load = useCallback(async () => {
    setError('')
    try {
      setData(await productionRequest<FounderOverview>('/founder/overview'))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not load SuperDash')
    }
  }, [])

  useEffect(() => {
    const has = Boolean(getProductionSession())
    setSignedIn(has)
    if (has) void load()
  }, [load])

  const signIn = async (event: React.FormEvent) => {
    event.preventDefault()
    setBusy('login')
    setError('')
    try {
      await loginToProduction(email.trim(), password)
      setSignedIn(true)
      await load()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sign in failed')
    } finally {
      setBusy('')
    }
  }

  const enable = async (tenantId: string, workspaces: string[]) => {
    setBusy(tenantId)
    try {
      await productionRequest(`/founder/tenants/${tenantId}/workspaces`, { method: 'POST', body: JSON.stringify({ workspaces, enabled: true }) })
      await load()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not switch workspaces on')
    } finally {
      setBusy('')
    }
  }

  if (!signedIn) {
    return <main className="sd-shell"><form className="sd-login" onSubmit={signIn}>
      <p className="sd-eyebrow">Founder only</p><h1>SuperDash</h1>
      <input autoComplete="username" onChange={(event) => setEmail(event.target.value)} placeholder="Founder email" type="email" value={email} />
      <input autoComplete="current-password" onChange={(event) => setPassword(event.target.value)} placeholder="Password" type="password" value={password} />
      {error ? <p className="sd-error">{error}</p> : null}
      <button disabled={busy === 'login'} type="submit">{busy === 'login' ? 'Signing in…' : 'Sign in'}</button>
    </form></main>
  }

  const s = data?.subscriptions
  const f = data?.finance
  const m = data?.monitoring
  const maxSignups = Math.max(1, ...(s?.signupsByDay.map((day) => day.count) ?? [1]))
  const pending = data?.upgradeRequests.filter((request) => request.pending.length) ?? []
  const tenants = (data?.tenants ?? []).filter((tenant) => !filter || `${tenant.businessName} ${tenant.ownerEmail} ${tenant.planName}`.toLowerCase().includes(filter.toLowerCase()))

  return <main className="sd-shell">
    <header className="sd-top">
      <div><p className="sd-eyebrow">FoundingOS · Founder</p><h1>SuperDash</h1><small>{data ? `Updated ${ago(data.generatedAt)}` : 'Loading…'}</small></div>
      <nav><button onClick={() => void load()} type="button">Refresh</button><button className="ghost" onClick={() => { void logoutProduction().then(() => { setSignedIn(false); setData(null) }) }} type="button">Sign out</button></nav>
    </header>
    <div className="sd-tabs" role="tablist">
      {(['overview', 'finance', 'marketing'] as const).map((key) => <button aria-selected={tab === key} className={tab === key ? 'on' : ''} key={key} onClick={() => setTab(key)} role="tab" type="button">{key === 'overview' ? 'Business' : key === 'finance' ? 'Finance' : 'Marketing'}</button>)}
    </div>
    {tab === 'finance' ? <FounderFinancePanel /> : null}
    {tab === 'marketing' ? <FounderMarketingPanel /> : null}
    {tab === 'overview' ? <>
    {error ? <p className="sd-error">{error}{error.toLowerCase().includes('forbidden') || error.includes('403') ? ' — SuperDash needs the founder account.' : ''}</p> : null}

    <section className="sd-kpis">
      <article><span>MRR</span><b>{gbp(f?.mrrGbp ?? 0)}</b><small>ARR {gbp(f?.arrGbp ?? 0)}</small></article>
      <article><span>Customers</span><b>{s?.customers ?? 0}</b><small>{s?.paying ?? 0} paying · {s?.free ?? 0} free</small></article>
      <article><span>New sign-ups</span><b>{s?.new7d ?? 0}</b><small>7 days · {s?.new30d ?? 0} in 30 days</small></article>
      <article><span>Active this week</span><b>{s?.active7d ?? 0}</b><small>companies using FoundingOS</small></article>
      <article className={pending.length ? 'is-alert' : ''}><span>Upgrade requests</span><b>{pending.length}</b><small>waiting for you</small></article>
    </section>

    <div className="sd-grid">
      <section className="sd-panel">
        <h2>Upgrade requests</h2>
        {pending.length ? pending.map((request) => <div className="sd-row" key={request.id}>
          <div><strong>{request.business}</strong><small>{request.ownerEmail} · {ago(request.createdAt)}</small><small>Wants: {request.pending.map(title).join(', ')}{request.note ? ` — “${request.note}”` : ''}</small></div>
          <button disabled={busy === request.tenantId} onClick={() => void enable(request.tenantId, request.pending)} type="button">{busy === request.tenantId ? 'Switching on…' : 'Switch on'}</button>
        </div>) : <p className="sd-muted">No pending requests.</p>}
      </section>

      <section className="sd-panel">
        <h2>Platform health</h2>
        <ul className="sd-health">
          <li className={m?.apiOk ? 'ok' : 'bad'}>API &amp; database <em>{m ? `${m.dbLatencyMs} ms` : '…'}</em></li>
          <li className={m?.aiConfigured ? 'ok' : 'bad'}>FoundAI (Claude) <em>{m?.aiRequests24h ?? 0} requests / 24h</em></li>
          <li className={m?.lastAutopilotRunAt ? 'ok' : 'warn'}>Autopilot <em>{m?.autopilotActions24h ?? 0} actions / 24h · last {ago(m?.lastAutopilotRunAt ?? null)}</em></li>
          <li className={m?.emailConfigured ? 'ok' : 'warn'}>Email sending <em>{m?.emailConfigured ? 'connected' : 'not set up'}</em></li>
          <li className={m?.upgradeEmailsConfigured ? 'ok' : 'warn'}>Upgrade alerts by email <em>{m?.upgradeEmailsConfigured ? 'on' : 'set SALES_NOTIFY_EMAIL'}</em></li>
          <li className={f?.billingLive ? 'ok' : 'warn'}>Stripe billing <em>{f?.billingLive ? 'live' : 'not connected'}</em></li>
          <li className={m?.integrationsFailing.length ? 'bad' : 'ok'}>Customer integrations <em>{m?.integrationsConnected ?? 0} connected · {m?.integrationsFailing.length ?? 0} failing</em></li>
        </ul>
        {m?.integrationsFailing.map((row) => <p className="sd-error" key={`${row.business}-${row.provider}`}>{row.business}: {row.provider} is {row.status}</p>)}
      </section>

      <section className="sd-panel">
        <h2>Revenue</h2>
        <table className="sd-table"><thead><tr><th>Plan</th><th>Customers</th><th>MRR</th></tr></thead><tbody>
          {s?.byPlan.map((row) => <tr key={row.plan}><td>{row.name}</td><td>{row.customers}</td><td>{gbp(row.mrrGbp)}</td></tr>)}
          {f?.boltOns.map((row) => <tr key={row.workspace}><td>+ {title(row.workspace)} bolt-on</td><td>{row.customers}</td><td>{gbp(row.mrrGbp)}</td></tr>)}
        </tbody></table>
        <p className="sd-muted">ARPU {gbp(f?.arpuGbp ?? 0)} · {f?.note}</p>
      </section>

      <section className="sd-panel">
        <h2>Growth · last 14 days</h2>
        <div className="sd-bars">{s?.signupsByDay.map((day) => <i key={day.date} style={{ height: `${Math.max(4, (day.count / maxSignups) * 100)}%` }} title={`${day.date}: ${day.count}`}><b>{day.count || ''}</b></i>)}</div>
        <h3>Workspace adoption</h3>
        <div className="sd-chips">{s?.workspaceAdoption.map((row) => <span key={row.workspace}>{title(row.workspace)} <b>{row.customers}</b></span>)}</div>
      </section>

      <section className="sd-panel sd-wide">
        <div className="sd-panel-head"><h2>Customers</h2><input onChange={(event) => setFilter(event.target.value)} placeholder="Search business, email or plan" value={filter} /></div>
        <table className="sd-table"><thead><tr><th>Business</th><th>Plan</th><th>Workspaces</th><th>Seats</th><th>£/mo</th><th>Joined</th><th>Last active</th></tr></thead><tbody>
          {tenants.map((tenant) => <tr key={tenant.tenantId}><td><strong>{tenant.businessName}</strong><small>{tenant.ownerEmail}</small></td><td>{tenant.planName}</td><td>{tenant.workspaces.map(title).join(', ')}</td><td>{tenant.seats}</td><td>{gbp(tenant.monthlyValueGbp)}</td><td>{ago(tenant.createdAt)}</td><td>{ago(tenant.lastActiveAt)}</td></tr>)}
          {!tenants.length ? <tr><td colSpan={7} className="sd-muted">No customers yet.</td></tr> : null}
        </tbody></table>
      </section>
    </div>
    </> : null}
  </main>
}
