'use client'
/*
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
// Founder SuperDash: subscriptions, revenue, upgrade requests, platform health,
// growth, plus FoundingOS's own Finance (books, P&L, runway) and Marketing (FoundAI posts, campaigns, calendar).
import { useCallback, useEffect, useMemo, useState } from 'react'
import { FounderFinancePanel, FounderMarketingPanel } from './founder-superdash-modules'
import { founderDemoOverview } from './founder-superdash-demo'
import { getProductionSession, loginToProduction, logoutProduction, productionRecords, productionRequest } from './workspace-production-client'
import { FinanceReportsPage, MarketingReportsPage, SalesReportsPage } from './pro/reports'
import { proRecordFromBackend } from './pro/models'
import type { LoadRecords } from './pro/shared'
import { CompleteWorkspaceApplication, type BusinessWorkspaceSlug } from './complete-workspace-application'

export type FounderOverview = {
  generatedAt: string
  subscriptions: { customers: number; paying: number; free: number; new7d: number; new30d: number; active7d: number; byPlan: Array<{ plan: string; name: string; customers: number; mrrGbp: number }>; workspaceAdoption: Array<{ workspace: string; customers: number }>; signupsByDay: Array<{ date: string; count: number }> }
  finance: { mrrGbp: number; arrGbp: number; arpuGbp: number; boltOns: Array<{ workspace: string; customers: number; mrrGbp: number }>; billingLive: boolean; note: string }
  monitoring: { apiOk: boolean; dbLatencyMs: number; aiConfigured: boolean; emailConfigured: boolean; upgradeEmailsConfigured: boolean; lastAutopilotRunAt: string | null; aiRequests24h: number; autopilotActions24h: number; recordsCreated24h: number; integrationsConnected: number; integrationsFailing: Array<{ business: string; provider: string; status: string }> }
  upgradeRequests: Array<{ id: string; tenantId: string; business: string; ownerEmail: string; requested: string[]; pending: string[]; note: string; createdAt: string }>
  ratings?: { count: number; average: number | null; distribution: Array<{ score: number; count: number }>; recent: Array<{ id: string; tenantId: string; business: string; score: number; surface: string; page: string; comment: string; createdAt: string }> }
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
// The founder's own tenant workspaces power the professional reports below.
const loadFounderRecords: LoadRecords = async (workspace, module) => (await productionRecords.list(workspace, module)).map(proRecordFromBackend)

type Tab = 'overview' | 'finance' | 'sales' | 'marketing'
// Each SuperDash tab hosts FoundingOS's own records. 'workspace/module' entries render the full
// professional workspace module inline; other keys are SuperDash-only views.
const sections: Record<Exclude<Tab, 'overview'>, Array<[key: string, label: string]>> = {
  finance: [['books', 'Books & runway'], ['finance/invoices', 'Invoices'], ['finance/bills', 'Bills'], ['finance/expenses', 'Expenses'], ['finance/banking', 'Banking'], ['finance/reconciliation', 'Reconciliation'], ['finance/budgets', 'Budgets'], ['finance/tax', 'Tax & VAT'], ['reports', 'Reports']],
  sales: [['forecast', 'Forecast'], ['retail/sales-pipeline', 'Deals & quotes'], ['subscribers', 'Subscribers'], ['retail/crm', 'Customers'], ['marketing/leads', 'Leads'], ['retail/orders', 'Orders'], ['retail/service', 'Support']],
  marketing: [['posts', 'FoundAI posts'], ['marketing/campaigns', 'Campaigns'], ['marketing/content', 'Content'], ['marketing/calendar', 'Calendar'], ['marketing/audiences', 'Audiences'], ['marketing/journeys', 'Journeys'], ['reports', 'ROI & attribution']],
}
const tabs: Tab[] = ['overview', 'finance', 'sales', 'marketing']
const readHash = (): [Tab, string] => {
  if (typeof window === 'undefined') return ['overview', '']
  const [tab, ...rest] = window.location.hash.replace(/^#/, '').split('/')
  return tabs.includes(tab as Tab) ? [tab as Tab, rest.join('/')] : ['overview', '']
}

function EmbeddedModule({ path }: { path: string }) {
  const [workspace, section] = path.split('/') as [BusinessWorkspaceSlug, string]
  return <section className="sd-module"><CompleteWorkspaceApplication embedded key={path} section={section} workspace={workspace} /></section>
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
  const [tab, setTabState] = useState<Tab>('overview')
  const [sub, setSubState] = useState('')
  const [demo, setDemo] = useState(false)
  useEffect(() => {
    const sync = () => { const [nextTab, nextSub] = readHash(); setTabState(nextTab); setSubState(nextSub) }
    sync()
    window.addEventListener('hashchange', sync)
    return () => window.removeEventListener('hashchange', sync)
  }, [])
  const go = (nextTab: Tab, nextSub = '') => { setTabState(nextTab); setSubState(nextSub); window.history.replaceState(null, '', `#${nextTab}${nextSub ? `/${nextSub}` : ''}`) }
  const setTab = (nextTab: Tab) => go(nextTab)

  const load = useCallback(async () => {
    setError('')
    try {
      setData(await productionRequest<FounderOverview>('/founder/overview'))
    } catch (err) {
      setData(null)
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
    if (demo) {
      setError('Example requests cannot be switched on. Return to live data first.')
      return
    }
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

  const overview = useMemo(() => demo && data ? founderDemoOverview(data) : data, [data, demo])

  if (!signedIn) {
    return <main className="sd-shell"><form className="sd-login" onSubmit={signIn}>
      <p className="sd-eyebrow">Founder only</p><h1>SuperDash</h1>
      <input autoComplete="username" onChange={(event) => setEmail(event.target.value)} placeholder="Founder email" type="email" value={email} />
      <input autoComplete="current-password" onChange={(event) => setPassword(event.target.value)} placeholder="Password" type="password" value={password} />
      {error ? <p className="sd-error">{error}</p> : null}
      <button disabled={busy === 'login'} type="submit">{busy === 'login' ? 'Signing in…' : 'Sign in'}</button>
      <a className="sd-site-link" href="/">← Back to website</a>
    </form></main>
  }

  const s = overview?.subscriptions
  const f = overview?.finance
  const m = overview?.monitoring
  const maxSignups = Math.max(1, ...(s?.signupsByDay.map((day) => day.count) ?? [1]))
  const pending = overview?.upgradeRequests.filter((request) => request.pending.length) ?? []
  const tenants = (overview?.tenants ?? []).filter((tenant) => !filter || `${tenant.businessName} ${tenant.ownerEmail} ${tenant.planName}`.toLowerCase().includes(filter.toLowerCase()))

  const customersPanel = <>
      <section className="sd-panel sd-wide">
        <div className="sd-panel-head"><h2>FoundingOS subscribers{demo ? ' · EXAMPLE DATA' : ''}</h2><input onChange={(event) => setFilter(event.target.value)} placeholder="Search business, email or plan" value={filter} /></div>
        <table className="sd-table"><thead><tr><th>Business</th><th>Plan</th><th>Workspaces</th><th>Seats</th><th>£/mo</th><th>Joined</th><th>Last active</th></tr></thead><tbody>
          {tenants.map((tenant) => <tr key={tenant.tenantId}><td><strong>{tenant.businessName}</strong><small>{tenant.ownerEmail}</small></td><td>{tenant.planName}</td><td>{tenant.workspaces.map(title).join(', ')}</td><td>{tenant.seats}</td><td>{gbp(tenant.monthlyValueGbp)}</td><td>{ago(tenant.createdAt)}</td><td>{ago(tenant.lastActiveAt)}</td></tr>)}
          {!tenants.length ? <tr><td colSpan={7} className="sd-muted">No customers yet.</td></tr> : null}
        </tbody></table>
      </section>
  </>

  return <main className="sd-shell">
    <header className="sd-top">
      <div><p className="sd-eyebrow">FoundingOS · Founder</p><h1>SuperDash</h1><small>{data ? `Updated ${ago(data.generatedAt)}` : 'Loading…'}</small></div>
      <nav><span className="sd-plan">Complete · all Pro tools on</span><button onClick={() => void load()} type="button">Refresh</button><button className="ghost" onClick={() => { void logoutProduction().then(() => { setSignedIn(false); setData(null); setDemo(false) }) }} type="button">Sign out</button></nav>
    </header>
    <div className="sd-tab-bar">
      <div className="sd-tabs" role="tablist">
        {(['overview', 'finance', 'sales', 'marketing'] as const).map((key) => <button aria-selected={tab === key} className={tab === key ? 'on' : ''} key={key} onClick={() => setTab(key)} role="tab" type="button">{key === 'overview' ? 'Business' : key === 'finance' ? 'Finance' : key === 'sales' ? 'Sales' : 'Marketing'}</button>)}
      </div>
      <a className="sd-site-link" href="/">← Back to website</a>
    </div>
    <div className={`sd-demo-bar${demo ? ' is-on' : ''}`}>
      <div><strong>{demo ? 'FoundingOS subscriber preview · EXAMPLE DATA' : 'Preview FoundingOS subscriptions'}</strong><small>{demo ? 'Subscriber figures and businesses are made up. No tenant was created, and no real data was changed. Platform health and workspace tools remain live.' : 'See how your company’s subscription dashboard could look with example subscribers. Your real numbers stay unchanged.'}</small></div>
      <button disabled={!data} onClick={() => { setDemo(!demo); setFilter(''); setError('') }} type="button">{demo ? 'Back to live figures' : 'Load subscriber demo'}</button>
    </div>
    {tab !== 'overview' ? (() => {
      const items = sections[tab]
      const active = items.some(([key]) => key === sub) ? sub : items[0][0]
      return <>
        <nav className="sd-subtabs" aria-label={`${title(tab)} sections`}>{items.map(([key, label]) => <button className={key === active ? 'on' : ''} key={key} onClick={() => go(tab, key)} type="button">{label}</button>)}</nav>
        {active.includes('/') ? <EmbeddedModule path={active} /> : null}
        {tab === 'finance' && active === 'books' ? <FounderFinancePanel /> : null}
        {tab === 'finance' && active === 'reports' ? <section className="sd-pro"><h2>P&amp;L, VAT &amp; aged debt</h2><FinanceReportsPage loadRecords={loadFounderRecords} /></section> : null}
        {tab === 'sales' && active === 'forecast' ? <section className="sd-pro"><h2>Sales pipeline &amp; forecast</h2><SalesReportsPage loadRecords={loadFounderRecords} workspace="retail" /></section> : null}
        {tab === 'sales' && active === 'subscribers' ? <div className="sd-grid">{customersPanel}</div> : null}
        {tab === 'marketing' && active === 'posts' ? <FounderMarketingPanel /> : null}
        {tab === 'marketing' && active === 'reports' ? <section className="sd-pro"><h2>Campaign ROI &amp; attribution</h2><MarketingReportsPage loadRecords={loadFounderRecords} workspace="marketing" /></section> : null}
      </>
    })() : null}
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
          <button disabled={demo || busy === request.tenantId} onClick={() => void enable(request.tenantId, request.pending)} type="button">{demo ? 'Example only' : busy === request.tenantId ? 'Switching on…' : 'Switch on'}</button>
        </div>) : <p className="sd-muted">No pending requests.</p>}
      </section>

      <section className="sd-panel">
        <h2>Customer ratings · private</h2>
        {overview?.ratings?.count ? <>
          <p className="sd-muted">{overview.ratings.average} / 5 average from {overview.ratings.count} rating{overview.ratings.count === 1 ? '' : 's'} in 90 days · {overview.ratings.distribution.map((row) => `${row.score}★ ${row.count}`).join(' · ')}</p>
          {overview.ratings.recent.slice(0, 6).map((rating) => <div className="sd-row" key={rating.id}>
            <div><strong>{'★'.repeat(rating.score)}{'☆'.repeat(5 - rating.score)} · {rating.business}</strong><small>{rating.surface}{rating.page ? ` · ${rating.page}` : ''} · {ago(rating.createdAt)}</small>{rating.comment ? <small>“{rating.comment}”</small> : null}</div>
          </div>)}
        </> : <p className="sd-muted">No customer ratings yet. Signed-in customers can send one from “Rate FoundingOS” in any workspace.</p>}
      </section>

      <section className="sd-panel">
        <h2>Platform health · LIVE</h2>
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

      {customersPanel}
    </div>
    </> : null}
  </main>
}
