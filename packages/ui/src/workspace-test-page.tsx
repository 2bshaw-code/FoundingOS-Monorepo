'use client'

import Link from 'next/link'
import { useState } from 'react'
import { CommercialOperationsWorkspace } from './commercial-operations-workspace'
import { HealthOperationsWorkspace } from './health-operations-workspace'
import { MarketingOperationsWorkspace } from './marketing-operations-workspace'
import { RetailOperationsWorkspace } from './retail-operations-workspace'
import { WorkforceIntelligenceWorkspace } from './workforce-intelligence-workspaces'

export type TestWorkspaceSlug = 'retail' | 'logistics' | 'finance' | 'marketing' | 'talent' | 'health' | 'intelligence'

const workspaces: Array<{ slug: TestWorkspaceSlug; label: string }> = [
  { slug: 'retail', label: 'Retail' },
  { slug: 'logistics', label: 'Logistics' },
  { slug: 'finance', label: 'Finance' },
  { slug: 'marketing', label: 'Marketing' },
  { slug: 'talent', label: 'Talent' },
  { slug: 'health', label: 'Health' },
  { slug: 'intelligence', label: 'Intelligence' },
]

const workspaceOverview: Record<TestWorkspaceSlug, {
  suite: string
  summary: string
  accent: string
  metrics: Array<{ label: string; value: string; change: string; points: string }>
}> = {
  retail: {
    suite: 'Core.Operations',
    summary: 'Orders, stock, and customer activity',
    accent: '#24c47a',
    metrics: [
      { label: 'Revenue', value: '£18.6k', change: '+12.4%', points: '0,48 20,42 40,45 60,31 80,27 100,12' },
      { label: 'Orders', value: '142', change: '+8.1%', points: '0,51 20,46 40,34 60,40 80,25 100,15' },
      { label: 'Stock health', value: '87%', change: '+3.2%', points: '0,44 20,39 40,42 60,29 80,23 100,18' },
    ],
  },
  logistics: {
    suite: 'Core.Operations',
    summary: 'Dispatch, routes, drivers, and exceptions',
    accent: '#ff496e',
    metrics: [
      { label: 'On-time', value: '94.8%', change: '+2.1%', points: '0,42 20,38 40,35 60,30 80,22 100,18' },
      { label: 'Active routes', value: '24', change: '3 reporting', points: '0,48 20,35 40,40 60,25 80,29 100,16' },
      { label: 'Exceptions', value: '1', change: '-4 today', points: '0,17 20,25 40,21 60,39 80,43 100,49' },
    ],
  },
  finance: {
    suite: 'Core.Operations',
    summary: 'Invoices, collection, and reconciliation',
    accent: '#ffb33e',
    metrics: [
      { label: 'Cash collected', value: '£12.4k', change: '+9.7%', points: '0,50 20,45 40,35 60,38 80,24 100,15' },
      { label: 'Receivables', value: '£5.3k', change: '-6.2%', points: '0,19 20,25 40,29 60,34 80,42 100,46' },
      { label: 'Matched', value: '91%', change: '+4.8%', points: '0,45 20,40 40,42 60,30 80,24 100,14' },
    ],
  },
  marketing: {
    suite: 'Core.Operations',
    summary: 'Campaigns, content, and attributed revenue',
    accent: '#f56fc2',
    metrics: [
      { label: 'Reach', value: '23.1k', change: '+16.2%', points: '0,52 20,43 40,39 60,28 80,24 100,10' },
      { label: 'Conversions', value: '351', change: '+11.8%', points: '0,49 20,45 40,33 60,37 80,22 100,14' },
      { label: 'Revenue', value: '£11.2k', change: '+8.5%', points: '0,46 20,40 40,42 60,30 80,27 100,17' },
    ],
  },
  talent: {
    suite: 'Core.Workforce',
    summary: 'Candidates, interviews, offers, and hiring',
    accent: '#ff8a33',
    metrics: [
      { label: 'Candidates', value: '1,284', change: '+18%', points: '0,48 20,43 40,37 60,31 80,25 100,14' },
      { label: 'Interviews', value: '17', change: '+5 this week', points: '0,50 20,44 40,46 60,30 80,28 100,16' },
      { label: 'Time to hire', value: '24d', change: '-3 days', points: '0,18 20,23 40,29 60,35 80,41 100,47' },
    ],
  },
  health: {
    suite: 'Core.Operations',
    summary: 'Appointments, follow-up, and care operations',
    accent: '#4cc9ff',
    metrics: [
      { label: 'Appointments', value: '42', change: '+6 today', points: '0,47 20,41 40,45 60,29 80,23 100,16' },
      { label: 'Checked in', value: '31', change: '74% arrival', points: '0,45 20,39 40,34 60,31 80,22 100,18' },
      { label: 'Follow-ups', value: '7', change: '2 priority', points: '0,34 20,27 40,40 60,32 80,44 100,38' },
    ],
  },
  intelligence: {
    suite: 'Core.Intelligence',
    summary: 'Signals, risks, and recommended decisions',
    accent: '#b77aff',
    metrics: [
      { label: 'Signals', value: '420', change: '+14.6%', points: '0,51 20,44 40,39 60,32 80,21 100,13' },
      { label: 'Confidence', value: '91%', change: '+5.1%', points: '0,44 20,40 40,35 60,29 80,25 100,17' },
      { label: 'Resolved', value: '87%', change: '+6.4%', points: '0,50 20,45 40,37 60,30 80,26 100,14' },
    ],
  },
}

function ActiveWorkspace({ workspace }: { workspace: TestWorkspaceSlug }) {
  const [retailModule, setRetailModule] = useState<'orders' | 'inventory'>('orders')

  if (workspace === 'retail') {
    return (
      <>
        <div className="workspace-test-subnav" role="tablist" aria-label="Retail workspace views">
          <button aria-selected={retailModule === 'orders'} className={retailModule === 'orders' ? 'active' : ''} onClick={() => setRetailModule('orders')} role="tab" type="button">Orders</button>
          <button aria-selected={retailModule === 'inventory'} className={retailModule === 'inventory' ? 'active' : ''} onClick={() => setRetailModule('inventory')} role="tab" type="button">Inventory</button>
        </div>
        <RetailOperationsWorkspace moduleId={retailModule} />
      </>
    )
  }
  if (workspace === 'logistics') return <CommercialOperationsWorkspace moduleId="logistics" />
  if (workspace === 'finance') return <CommercialOperationsWorkspace moduleId="finance" />
  if (workspace === 'marketing') return <MarketingOperationsWorkspace />
  if (workspace === 'talent') return <WorkforceIntelligenceWorkspace suite="workforce" moduleId="candidates" />
  if (workspace === 'health') return <HealthOperationsWorkspace />
  return <WorkforceIntelligenceWorkspace suite="intelligence" moduleId="monitoring" />
}

export function WorkspaceTestPage({ workspace }: { workspace: TestWorkspaceSlug }) {
  const current = workspaces.find((item) => item.slug === workspace)
  const overview = workspaceOverview[workspace]
  const [command, setCommand] = useState('')
  const [commandResult, setCommandResult] = useState('')

  const runCommand = () => {
    const request = command.trim()
    if (!request) {
      setCommandResult(`Showing the highest-priority ${current?.label.toLowerCase()} work below.`)
      return
    }
    setCommandResult(`FoundingOS reviewed “${request}”. The relevant simulated records are ready in the work queue below.`)
    setCommand('')
  }

  return (
    <main className="workspace-app-shell" style={{ ['--workspace-accent' as string]: overview.accent }}>
      <aside className="workspace-app-rail">
        <Link className="workspace-app-brand" href="/"><span>F</span><strong>FoundingOS</strong></Link>
        <p>WORKSPACES</p>
        <nav aria-label="Test another workspace">
          {workspaces.map((item) => (
            <Link aria-current={item.slug === workspace ? 'page' : undefined} className={item.slug === workspace ? 'active' : ''} href={`/test-workspaces/${item.slug}`} key={item.slug}>
              <i />{item.label}
            </Link>
          ))}
        </nav>
        <div className="workspace-app-system"><i /> Demo system online<small>Browser-persistent data</small></div>
      </aside>

      <section className="workspace-app-main">
        <header className="workspace-app-topbar">
          <div><span>{overview.suite}</span><strong>{current?.label} Workspace</strong></div>
          <div><span className="workspace-live-status">● LIVE DEMO</span><span className="workspace-user-badge">BS</span></div>
        </header>

        <div className="workspace-app-content">
          <header className="workspace-command-header">
            <div>
              <p className="eyebrow">{overview.suite} · Interactive workspace</p>
              <h1>{current?.label}</h1>
              <p>{overview.summary}</p>
            </div>
            <span className="demo-badge">Simulated data</span>
          </header>

          <form className="workspace-command-bar" onSubmit={(event) => { event.preventDefault(); runCommand() }}>
            <span>✦</span>
            <label>
              <strong>Ask FoundingOS</strong>
              <input aria-label="FoundingOS command" onChange={(event) => setCommand(event.target.value)} placeholder="Show today’s priorities" value={command} />
            </label>
            <button type="submit">Run command</button>
          </form>
          {commandResult ? <div className="workspace-command-result" role="status"><strong>FoundingOS</strong>{commandResult}</div> : null}

          <section className="workspace-visual-metrics" aria-label={`${current?.label} performance trends`}>
            {overview.metrics.map((metric) => (
              <article key={metric.label}>
                <div><span>{metric.label}</span><b>{metric.change}</b></div>
                <strong>{metric.value}</strong>
                <svg aria-label={`${metric.label} seven-day trend`} role="img" viewBox="0 0 100 60">
                  <polyline fill="none" points={metric.points} stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" />
                  <line stroke="currentColor" strokeOpacity=".15" x1="0" x2="100" y1="55" y2="55" />
                </svg>
              </article>
            ))}
          </section>

          <div className="workspace-operation-heading">
            <div><p className="eyebrow">Operational workspace</p><h2>Work queue and controls</h2></div>
            <Link className="text-link" href="/workspaces">What is included?</Link>
          </div>

          <div className="workspace-test-content">
            <ActiveWorkspace workspace={workspace} />
          </div>
        </div>
      </section>
    </main>
  )
}
