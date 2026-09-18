'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState, type FormEvent } from 'react'

export type BusinessWorkspaceSlug = 'retail' | 'logistics' | 'finance' | 'marketing' | 'talent' | 'health' | 'intelligence'

type WorkspaceRecord = { id: string; name: string; secondary: string; value: string; status: string; owner: string; updated: string }
type WorkspaceModule = { id: string; label: string; group: string; statuses?: string[] }
type WorkspaceEvent = { id: string; workspace: BusinessWorkspaceSlug; text: string; time: string }
type WorkspaceState = {
  records: Record<string, WorkspaceRecord[]>
  automations: Array<{ id: string; name: string; enabled: boolean; runs: number }>
  integrations: Array<{ id: string; name: string; category: string; connected: boolean }>
  settings: { businessName: string; region: string; notifications: boolean }
}
type WorkspaceConfig = {
  label: string
  suite: string
  accent: string
  description: string
  subjects: string[]
  metrics: Array<{ label: string; value: string; change: string }>
  modules: WorkspaceModule[]
}

const module = (id: string, label: string, group: string, statuses?: string[]): WorkspaceModule => ({ id, label, group, statuses })
const standard = ['New', 'In progress', 'Review', 'Complete']

const configs: Record<BusinessWorkspaceSlug, WorkspaceConfig> = {
  retail: {
    label: 'Retail', suite: 'Core.Operations', accent: '#24c47a', description: 'Run sales, customer relationships, marketing, commerce, service, and finance from one connected workspace.',
    subjects: ['Harbour Cafe', 'Amina Yusuf', 'North & Co', 'Sofia Martins'],
    metrics: [{ label: 'Revenue', value: '£18.6k', change: '+12.4% this week' }, { label: 'Pipeline', value: '£42.8k', change: '14 open opportunities' }, { label: 'Customers', value: '1,284', change: '+38 this month' }, { label: 'Conversion', value: '8.7%', change: '+1.3 points' }],
    modules: [
      module('overview', 'Home', 'Workspace'), module('sales-pipeline', 'Sales pipeline', 'Sales', ['Lead', 'Qualified', 'Proposal', 'Won']), module('orders', 'Orders', 'Sales', ['New', 'Picking', 'Ready', 'Delivered']), module('point-of-sale', 'Point of sale', 'Sales', ['Open basket', 'Payment due', 'Paid', 'Closed']),
      module('crm', 'CRM', 'Customers', ['New', 'Engaged', 'Active', 'VIP']), module('segments', 'Segments', 'Customers'), module('loyalty', 'Loyalty', 'Customers'), module('inbox', 'Omnichannel inbox', 'Customers', ['Unread', 'Assigned', 'Waiting', 'Resolved']),
      module('campaigns', 'Campaigns', 'Marketing', ['Draft', 'Scheduled', 'Live', 'Complete']), module('automations', 'Automations', 'Marketing'), module('content', 'Content studio', 'Marketing', ['Idea', 'Draft', 'Approved', 'Published']),
      module('products', 'Products', 'Commerce'), module('inventory', 'Inventory', 'Commerce', ['Low stock', 'Available', 'Reserved', 'Replenished']), module('promotions', 'Promotions', 'Commerce', ['Draft', 'Scheduled', 'Live', 'Ended']), module('channels', 'Sales channels', 'Commerce'),
      module('purchasing', 'Purchasing', 'Operations', ['Draft', 'Approved', 'Ordered', 'Received']), module('suppliers', 'Suppliers', 'Operations'), module('fulfilment', 'Fulfilment', 'Operations', ['Queued', 'Picking', 'Packed', 'Dispatched']), module('returns', 'Returns', 'Operations', ['Requested', 'Approved', 'Received', 'Refunded']),
      module('service', 'Customer service', 'Service', ['Open', 'Assigned', 'Waiting', 'Resolved']), module('payments', 'Payments', 'Finance', ['Pending', 'Authorised', 'Paid', 'Reconciled']), module('reports', 'Reports & forecasts', 'Intelligence'),
      module('team', 'Team & access', 'Administration'), module('integrations', 'Integrations', 'Administration'), module('settings', 'Settings', 'Administration'),
    ],
  },
  logistics: {
    label: 'Logistics', suite: 'Core.Operations', accent: '#ff496e', description: 'Coordinate dispatch, routes, drivers, fleet, warehouses, tracking, and customer delivery promises.',
    subjects: ['Route North 14', 'Harbour Cafe delivery', 'Driver Maya Chen', 'Depot West'],
    metrics: [{ label: 'On-time delivery', value: '94.8%', change: '+2.1 points' }, { label: 'Active routes', value: '24', change: '3 reporting now' }, { label: 'Exceptions', value: '3', change: '-4 today' }, { label: 'Fleet utilisation', value: '87%', change: '+5.2%' }],
    modules: [module('overview', 'Control tower', 'Workspace'), module('dispatch', 'Dispatch board', 'Delivery', ['Unassigned', 'Assigned', 'Loaded', 'Departed']), module('routes', 'Routes', 'Delivery', ['Planned', 'Optimised', 'Active', 'Complete']), module('deliveries', 'Deliveries', 'Delivery', ['Booked', 'Out for delivery', 'Attempted', 'Delivered']), module('tracking', 'Live tracking', 'Delivery'), module('exceptions', 'Exceptions', 'Delivery', ['Open', 'Investigating', 'Recovering', 'Resolved']), module('fleet', 'Fleet', 'Resources'), module('drivers', 'Drivers', 'Resources'), module('warehouses', 'Warehouses', 'Resources'), module('customers', 'Customers', 'Commercial'), module('quotes', 'Quotes', 'Commercial', standard), module('billing', 'Billing', 'Commercial', ['Draft', 'Issued', 'Paid', 'Reconciled']), module('reports', 'Performance', 'Intelligence'), module('automations', 'Automations', 'Intelligence'), module('team', 'Team & access', 'Administration'), module('integrations', 'Integrations', 'Administration'), module('settings', 'Settings', 'Administration')],
  },
  finance: {
    label: 'Finance', suite: 'Core.Operations', accent: '#ffb33e', description: 'Control cash, invoices, bills, banking, reconciliation, budgets, tax, and financial approvals.',
    subjects: ['North & Co invoice', 'September payroll', 'Stripe settlement', 'Northstar Textiles bill'],
    metrics: [{ label: 'Cash position', value: '£86.4k', change: '+9.7% this month' }, { label: 'Receivables', value: '£24.3k', change: '£8.1k due this week' }, { label: 'Payables', value: '£17.8k', change: '12 open bills' }, { label: 'Runway', value: '11.4 mo', change: '+0.8 months' }],
    modules: [module('overview', 'Finance home', 'Workspace'), module('cashflow', 'Cash flow', 'Money'), module('invoices', 'Invoices', 'Money', ['Draft', 'Sent', 'Overdue', 'Paid']), module('bills', 'Bills', 'Money', ['Received', 'Approved', 'Scheduled', 'Paid']), module('banking', 'Banking', 'Money'), module('reconciliation', 'Reconciliation', 'Money', ['Unmatched', 'Suggested', 'Matched', 'Verified']), module('expenses', 'Expenses', 'Spend', ['Submitted', 'Review', 'Approved', 'Reimbursed']), module('payments', 'Payments', 'Spend', ['Pending', 'Authorised', 'Paid', 'Reconciled']), module('budgets', 'Budgets', 'Planning'), module('forecasting', 'Forecasting', 'Planning'), module('tax', 'Tax', 'Compliance', standard), module('approvals', 'Approvals', 'Compliance', ['Requested', 'Review', 'Approved', 'Complete']), module('reports', 'Financial reports', 'Intelligence'), module('automations', 'Automations', 'Intelligence'), module('team', 'Team & access', 'Administration'), module('integrations', 'Integrations', 'Administration'), module('settings', 'Settings', 'Administration')],
  },
  marketing: {
    label: 'Marketing', suite: 'Core.Operations', accent: '#f56fc2', description: 'Plan campaigns, build audiences, create content, nurture leads, and prove attributed revenue.',
    subjects: ['Summer launch', 'Lapsed VIP audience', 'WhatsApp welcome journey', 'Founder story campaign'],
    metrics: [{ label: 'Attributed revenue', value: '£11.2k', change: '+18.5%' }, { label: 'Pipeline influenced', value: '£31.6k', change: '22 opportunities' }, { label: 'Reach', value: '23.1k', change: '+16.2%' }, { label: 'Return on spend', value: '4.8x', change: '+0.6x' }],
    modules: [module('overview', 'Marketing home', 'Workspace'), module('campaigns', 'Campaigns', 'Campaigns', ['Draft', 'Scheduled', 'Live', 'Complete']), module('calendar', 'Calendar', 'Campaigns'), module('audiences', 'Audiences', 'Audience'), module('segments', 'Segments', 'Audience'), module('leads', 'Leads', 'Audience', ['New', 'Nurturing', 'Qualified', 'Converted']), module('content', 'Content studio', 'Creative', ['Idea', 'Draft', 'Approved', 'Published']), module('brand-studio', 'Brand Studio', 'Creative'), module('channels', 'Channels', 'Distribution'), module('journeys', 'Customer journeys', 'Distribution', ['Draft', 'Active', 'Paused', 'Complete']), module('inbox', 'Campaign inbox', 'Distribution', ['Unread', 'Assigned', 'Waiting', 'Resolved']), module('attribution', 'Attribution', 'Intelligence'), module('reports', 'Analytics', 'Intelligence'), module('automations', 'Automations', 'Intelligence'), module('team', 'Team & access', 'Administration'), module('integrations', 'Integrations', 'Administration'), module('settings', 'Settings', 'Administration')],
  },
  talent: {
    label: 'Talent', suite: 'Core.Workforce', accent: '#ff8a33', description: 'Recruit, onboard, develop, support, and retain the team in one workforce system.',
    subjects: ['Amara Johnson', 'Senior operator role', 'Noah Williams review', 'September onboarding'],
    metrics: [{ label: 'Open roles', value: '12', change: '4 priority hires' }, { label: 'Candidates', value: '184', change: '+28 this week' }, { label: 'Time to hire', value: '24d', change: '-3 days' }, { label: 'Engagement', value: '82%', change: '+4 points' }],
    modules: [module('overview', 'People home', 'Workspace'), module('candidates', 'Candidates', 'Recruiting', ['Applied', 'Screening', 'Interview', 'Offer']), module('jobs', 'Jobs', 'Recruiting', ['Draft', 'Open', 'Interviewing', 'Filled']), module('interviews', 'Interviews', 'Recruiting', ['Planned', 'Confirmed', 'Complete', 'Decision']), module('offers', 'Offers', 'Recruiting', ['Draft', 'Sent', 'Accepted', 'Onboarding']), module('onboarding', 'Onboarding', 'People', standard), module('people', 'People directory', 'People'), module('performance', 'Performance', 'People', standard), module('time-off', 'Time off', 'People', ['Requested', 'Review', 'Approved', 'Complete']), module('learning', 'Learning', 'Development', standard), module('payroll', 'Payroll', 'Reward', ['Preparing', 'Review', 'Approved', 'Paid']), module('engagement', 'Engagement', 'Intelligence'), module('reports', 'Workforce reports', 'Intelligence'), module('automations', 'Automations', 'Intelligence'), module('team', 'Team & access', 'Administration'), module('integrations', 'Integrations', 'Administration'), module('settings', 'Settings', 'Administration')],
  },
  health: {
    label: 'Health', suite: 'Core.Operations', accent: '#4cc9ff', description: 'Coordinate patients, appointments, care plans, practitioners, follow-ups, billing, and compliance.',
    subjects: ['Amina Yusuf', 'Morning clinic', 'Care plan CP-204', 'Dr Maya Chen'],
    metrics: [{ label: 'Appointments', value: '42', change: '+6 today' }, { label: 'Checked in', value: '31', change: '74% arrival' }, { label: 'Follow-ups', value: '7', change: '2 priority' }, { label: 'Capacity', value: '86%', change: '+5 points' }],
    modules: [module('overview', 'Care operations', 'Workspace'), module('appointments', 'Appointments', 'Care', ['Booked', 'Confirmed', 'Checked in', 'Complete']), module('patients', 'Patients', 'Care'), module('care-plans', 'Care plans', 'Care', standard), module('triage', 'Triage', 'Care', ['New', 'Assessed', 'Assigned', 'Complete']), module('clinical-inbox', 'Clinical inbox', 'Care', ['Unread', 'Assigned', 'Waiting', 'Resolved']), module('follow-ups', 'Follow-ups', 'Care', standard), module('practitioners', 'Practitioners', 'Resources'), module('locations', 'Locations', 'Resources'), module('inventory', 'Clinical inventory', 'Resources', ['Low stock', 'Available', 'Reserved', 'Replenished']), module('billing', 'Billing', 'Finance', ['Draft', 'Issued', 'Paid', 'Reconciled']), module('claims', 'Claims', 'Finance', ['Prepared', 'Submitted', 'Review', 'Settled']), module('compliance', 'Compliance', 'Governance', standard), module('reports', 'Care reports', 'Intelligence'), module('automations', 'Automations', 'Intelligence'), module('team', 'Team & access', 'Administration'), module('integrations', 'Integrations', 'Administration'), module('settings', 'Settings', 'Administration')],
  },
  intelligence: {
    label: 'Intelligence', suite: 'Core.Intelligence', accent: '#b77aff', description: 'Monitor the event graph, surface risks, forecast outcomes, and coordinate recommended decisions.',
    subjects: ['Cash runway risk', 'Inventory demand spike', 'Delivery exception cluster', 'Campaign revenue opportunity'],
    metrics: [{ label: 'Live signals', value: '420', change: '+14.6%' }, { label: 'Open risks', value: '8', change: '3 high priority' }, { label: 'Recommendations', value: '17', change: '£24k potential value' }, { label: 'Confidence', value: '91%', change: '+5.1 points' }],
    modules: [module('overview', 'Command centre', 'Workspace'), module('signals', 'Signals', 'Decisioning', ['Detected', 'Enriched', 'Reviewed', 'Resolved']), module('risks', 'Risks', 'Decisioning', ['Open', 'Investigating', 'Mitigating', 'Resolved']), module('recommendations', 'Recommendations', 'Decisioning', ['Proposed', 'Review', 'Approved', 'Executed']), module('forecasts', 'Forecasts', 'Planning'), module('scenarios', 'Scenarios', 'Planning', standard), module('anomalies', 'Anomalies', 'Monitoring', ['Detected', 'Investigating', 'Recovering', 'Resolved']), module('event-feed', 'Shared Event Feed', 'Monitoring'), module('workflows', 'AI workflows', 'Automation', standard), module('models', 'Models', 'Automation'), module('data-sources', 'Data sources', 'Data'), module('reports', 'Intelligence reports', 'Data'), module('automations', 'Automations', 'Data'), module('team', 'Team & access', 'Administration'), module('integrations', 'Integrations', 'Administration'), module('settings', 'Settings', 'Administration')],
  },
}

const workspaceOrder: BusinessWorkspaceSlug[] = ['retail', 'logistics', 'finance', 'marketing', 'talent', 'health', 'intelligence']
const statusFor = (item: WorkspaceModule) => item.statuses ?? standard
const seedWorkspace = (workspace: BusinessWorkspaceSlug): WorkspaceState => {
  const config = configs[workspace]
  const records = Object.fromEntries(config.modules.filter((item) => item.id !== 'overview').map((item) => [
    item.id,
    config.subjects.map((subject, index) => ({ id: `${item.id.slice(0, 3).toUpperCase()}-${101 + index}`, name: subject, secondary: `${item.label} workflow`, value: index % 2 ? '£4,280' : 'High priority', status: statusFor(item)[index % statusFor(item).length], owner: ['Maya', 'Noah', 'Ava', 'Bobby'][index], updated: `${index * 18 + 4}m ago` })),
  ]))
  return {
    records,
    automations: [
      { id: 'AUT-1', name: `Priority ${config.label.toLowerCase()} alerts`, enabled: true, runs: 142 },
      { id: 'AUT-2', name: 'WhatsApp confirmation and follow-up', enabled: true, runs: 96 },
      { id: 'AUT-3', name: 'Cross-workspace handoff', enabled: true, runs: 38 },
      { id: 'AUT-4', name: 'Weekly performance summary', enabled: false, runs: 0 },
    ],
    integrations: [
      { id: 'INT-1', name: 'WhatsApp Cloud API', category: 'Messaging', connected: true },
      { id: 'INT-2', name: 'Stripe', category: 'Payments', connected: workspace !== 'talent' },
      { id: 'INT-3', name: 'Google Workspace', category: 'Productivity', connected: true },
      { id: 'INT-4', name: workspace === 'health' ? 'FHIR gateway' : 'Accounting connector', category: 'Operations', connected: false },
    ],
    settings: { businessName: 'FoundingOS Demo Company', region: 'United Kingdom', notifications: true },
  }
}

const EVENTS_KEY = 'foundingos-shared-workspace-events-v1'
const storageKey = (workspace: BusinessWorkspaceSlug) => `foundingos-${workspace}-complete-workspace-v1`

function useWorkspaceState(workspace: BusinessWorkspaceSlug) {
  const [state, setState] = useState<WorkspaceState>(() => seedWorkspace(workspace))
  const [events, setEvents] = useState<WorkspaceEvent[]>([])
  useEffect(() => {
    const stored = window.localStorage.getItem(storageKey(workspace))
    const storedEvents = window.localStorage.getItem(EVENTS_KEY)
    if (stored) setState(JSON.parse(stored) as WorkspaceState)
    if (storedEvents) setEvents(JSON.parse(storedEvents) as WorkspaceEvent[])
  }, [workspace])
  const update = (mutate: (current: WorkspaceState) => WorkspaceState, eventText?: string) => {
    setState((current) => {
      const next = mutate(current)
      window.localStorage.setItem(storageKey(workspace), JSON.stringify(next))
      return next
    })
    if (eventText) {
      setEvents((current) => {
        const next = [{ id: `${workspace}-${Date.now()}`, workspace, text: eventText, time: 'Now' }, ...current].slice(0, 40)
        window.localStorage.setItem(EVENTS_KEY, JSON.stringify(next))
        return next
      })
    }
  }
  const reset = () => {
    window.localStorage.removeItem(storageKey(workspace))
    setState(seedWorkspace(workspace))
  }
  return { state, events, update, reset }
}

function WorkspaceHeading({ eyebrow, title, copy, action }: { eyebrow: string; title: string; copy: string; action?: React.ReactNode }) {
  return <header className="retail-app-heading"><div><p>{eyebrow}</p><h1>{title}</h1><span>{copy}</span></div>{action}</header>
}

function Metric({ label, value, change }: { label: string; value: string; change: string }) {
  return <article className="retail-app-metric"><span>{label}</span><strong>{value}</strong><small>{change}</small></article>
}

function Overview({ workspace, config, state, events }: { workspace: BusinessWorkspaceSlug; config: WorkspaceConfig; state: WorkspaceState; events: WorkspaceEvent[] }) {
  const operational = config.modules.filter((item) => !['overview', 'settings', 'integrations', 'team'].includes(item.id)).slice(0, 5)
  return <>
    <WorkspaceHeading eyebrow={`${config.label} command centre`} title={`Good morning, Bobby`} copy={config.description} />
    <section className="retail-app-metrics">{config.metrics.map((metric) => <Metric key={metric.label} {...metric} />)}</section>
    <section className="retail-app-dashboard-grid">
      <article className="retail-app-panel retail-app-chart-panel"><div className="retail-app-panel-heading"><div><p>Performance</p><h2>Seven-day operating trend</h2></div><span>Live simulation</span></div><svg viewBox="0 0 620 220" role="img" aria-label={`${config.label} seven-day trend`}><defs><linearGradient id={`${workspace}-trend`} x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor={config.accent} stopOpacity=".38" /><stop offset="1" stopColor={config.accent} stopOpacity="0" /></linearGradient></defs>{[35, 80, 125, 170].map((y) => <line key={y} stroke="#dfe5ed" x1="30" x2="600" y1={y} y2={y} />)}<path d="M30 175 L120 150 L210 159 L300 112 L390 126 L480 73 L600 39 L600 205 L30 205 Z" fill={`url(#${workspace}-trend)`} /><polyline fill="none" points="30,175 120,150 210,159 300,112 390,126 480,73 600,39" stroke={config.accent} strokeLinecap="round" strokeLinejoin="round" strokeWidth="5" /></svg></article>
      <article className="retail-app-panel"><div className="retail-app-panel-heading"><div><p>Priority queue</p><h2>Work needing attention</h2></div></div><div className="retail-app-priorities">{operational.map((item, index) => <Link href={`/test-workspaces/${workspace}/${item.id}`} key={item.id}><i data-tone={index < 2 ? 'risk' : 'watch'} /><div><strong>{state.records[item.id]?.[0]?.name}</strong><span>{item.label} · {state.records[item.id]?.[0]?.status}</span></div><b>→</b></Link>)}</div></article>
    </section>
    <section className="retail-app-dashboard-grid lower">
      <article className="retail-app-panel"><div className="retail-app-panel-heading"><div><p>Connected system</p><h2>Workspace coverage</h2></div></div><div className="complete-workspace-coverage">{config.modules.slice(1, 9).map((item) => <Link href={`/test-workspaces/${workspace}/${item.id}`} key={item.id}><strong>{state.records[item.id]?.length ?? 0}</strong><span>{item.label}</span></Link>)}</div></article>
      <article className="retail-app-panel"><div className="retail-app-panel-heading"><div><p>Shared backbone</p><h2>Latest cross-workspace events</h2></div><Link href="/test-workspaces/intelligence/event-feed">View feed</Link></div><ul className="retail-app-activity">{(events.length ? events : [{ id: '1', workspace, text: `${config.label} workspace opened`, time: 'Now' }, { id: '2', workspace: 'finance' as const, text: 'Payment reconciled to customer order', time: '24m' }, { id: '3', workspace: 'marketing' as const, text: 'Campaign revenue attribution updated', time: '42m' }]).slice(0, 5).map((event) => <li key={event.id}><i /><span><strong>{configs[event.workspace].label}</strong> · {event.text}</span><span>{event.time}</span></li>)}</ul></article>
    </section>
  </>
}

function RecordsPage({ workspace, config, item, state, update }: { workspace: BusinessWorkspaceSlug; config: WorkspaceConfig; item: WorkspaceModule; state: WorkspaceState; update: (mutate: (current: WorkspaceState) => WorkspaceState, eventText?: string) => void }) {
  const records = state.records[item.id] ?? []
  const statuses = statusFor(item)
  const [query, setQuery] = useState('')
  const [selectedId, setSelectedId] = useState(records[0]?.id)
  const [creating, setCreating] = useState(false)
  const visible = records.filter((record) => `${record.id} ${record.name} ${record.secondary} ${record.status}`.toLowerCase().includes(query.toLowerCase()))
  const selected = records.find((record) => record.id === selectedId) ?? records[0]
  const create = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    const record: WorkspaceRecord = { id: `${item.id.slice(0, 3).toUpperCase()}-${100 + records.length + 1}`, name: String(form.get('name')), secondary: String(form.get('secondary')), value: String(form.get('value')), status: statuses[0], owner: String(form.get('owner')), updated: 'Now' }
    update((current) => ({ ...current, records: { ...current.records, [item.id]: [record, ...(current.records[item.id] ?? [])] } }), `${item.label}: ${record.name} created`)
    setSelectedId(record.id)
    setCreating(false)
  }
  const advance = () => {
    if (!selected) return
    const next = statuses[Math.min(statuses.indexOf(selected.status) + 1, statuses.length - 1)]
    update((current) => ({ ...current, records: { ...current.records, [item.id]: current.records[item.id].map((record) => record.id === selected.id ? { ...record, status: next, updated: 'Now' } : record) } }), `${item.label}: ${selected.name} moved to ${next}`)
  }
  const handoffTarget = workspaceOrder[(workspaceOrder.indexOf(workspace) + 1) % workspaceOrder.length]
  return <>
    <WorkspaceHeading eyebrow={`${config.suite} · ${item.group}`} title={item.label} copy={`Manage every ${item.label.toLowerCase()} record, owner, stage, activity, and connected handoff.`} action={<button className="retail-app-primary" onClick={() => setCreating(true)} type="button">+ New record</button>} />
    {item.statuses ? <div className="complete-workspace-stage-summary">{statuses.map((status) => <article key={status}><strong>{records.filter((record) => record.status === status).length}</strong><span>{status}</span></article>)}</div> : null}
    <div className="retail-app-toolbar"><input aria-label={`Search ${item.label}`} onChange={(event) => setQuery(event.target.value)} placeholder={`Search ${item.label.toLowerCase()}`} value={query} /><span className="retail-app-record-count">{visible.length} matching</span><button onClick={() => window.print()} type="button">Export / print</button></div>
    <section className="retail-app-record-layout">
      <div className="retail-app-table-card"><div className="retail-app-panel-heading"><div><p>{item.group}</p><h2>{visible.length} records</h2></div></div><div className="retail-app-table-scroll"><table><thead><tr><th>Record</th><th>Context</th><th>Value</th><th>Status</th><th>Owner</th><th>Updated</th></tr></thead><tbody>{visible.map((record) => <tr className={selected?.id === record.id ? 'selected' : ''} key={record.id} onClick={() => setSelectedId(record.id)}><td><strong>{record.name}</strong><small>{record.id}</small></td><td>{record.secondary}</td><td>{record.value}</td><td><span className={`retail-app-status status-${record.status.toLowerCase().replaceAll(' ', '-')}`}>{record.status}</span></td><td>{record.owner}</td><td>{record.updated}</td></tr>)}</tbody></table></div></div>
      {selected ? <aside className="retail-app-detail"><p>Selected record</p><h2>{selected.name}</h2><strong>{selected.id}</strong><dl><div><dt>Workflow</dt><dd>{item.label}</dd></div><div><dt>Status</dt><dd>{selected.status}</dd></div><div><dt>Owner</dt><dd>{selected.owner}</dd></div><div><dt>Value</dt><dd>{selected.value}</dd></div><div><dt>Updated</dt><dd>{selected.updated}</dd></div></dl><div className="retail-app-stage">{statuses.map((status) => <span className={status === selected.status ? 'active' : ''} key={status}>{status}</span>)}</div>{selected.status !== statuses.at(-1) ? <button className="retail-app-primary" onClick={advance} type="button">Move to {statuses[Math.min(statuses.indexOf(selected.status) + 1, statuses.length - 1)]}</button> : null}<button className="retail-app-secondary" onClick={() => update((current) => current, `${item.label}: ${selected.name} handed to ${configs[handoffTarget].label}`)} type="button">Handoff to {configs[handoffTarget].label}</button></aside> : null}
    </section>
    {creating ? <div className="retail-app-modal-backdrop"><form className="retail-app-modal" onSubmit={create}><div><p>{item.label}</p><h2>Create a record</h2></div><label>Name<input name="name" required /></label><label>Context<input name="secondary" required /></label><div className="retail-app-form-grid"><label>Value<input name="value" placeholder="£0 or priority" required /></label><label>Owner<select name="owner"><option>Maya</option><option>Noah</option><option>Ava</option><option>Bobby</option></select></label></div><footer><button className="retail-app-secondary" onClick={() => setCreating(false)} type="button">Cancel</button><button className="retail-app-primary" type="submit">Create record</button></footer></form></div> : null}
  </>
}

function AutomationsPage({ config, state, update }: { config: WorkspaceConfig; state: WorkspaceState; update: (mutate: (current: WorkspaceState) => WorkspaceState, eventText?: string) => void }) {
  return <><WorkspaceHeading eyebrow="Workflow engine" title="Automations" copy={`Control ${config.label.toLowerCase()} triggers, approvals, confirmations, and cross-workspace handoffs.`} /><div className="retail-app-automation-grid">{state.automations.map((automation) => <article className="retail-app-panel" key={automation.id}><div className="retail-app-panel-heading"><div><p>{automation.enabled ? 'Active' : 'Paused'}</p><h2>{automation.name}</h2></div><button aria-label={`Toggle ${automation.name}`} className={`retail-app-toggle ${automation.enabled ? 'active' : ''}`} onClick={() => update((current) => ({ ...current, automations: current.automations.map((item) => item.id === automation.id ? { ...item, enabled: !item.enabled } : item) }), `${automation.name} ${automation.enabled ? 'paused' : 'enabled'}`)} type="button"><i /></button></div><p>Runs against the shared FoundingOS event feed with explicit confirmation and audit history.</p><footer><span>{automation.runs} runs</span><span>{automation.enabled ? 'Monitoring events' : 'No events processed'}</span></footer></article>)}</div></>
}

function IntegrationsPage({ state, update }: { state: WorkspaceState; update: (mutate: (current: WorkspaceState) => WorkspaceState, eventText?: string) => void }) {
  return <><WorkspaceHeading eyebrow="Connected platform" title="Integrations" copy="Connect channels and systems through one governed FoundingOS integration layer." /><div className="retail-app-automation-grid">{state.integrations.map((integration) => <article className="retail-app-panel" key={integration.id}><div className="retail-app-panel-heading"><div><p>{integration.category}</p><h2>{integration.name}</h2></div><span className={`retail-app-status ${integration.connected ? 'status-active' : 'status-draft'}`}>{integration.connected ? 'Connected' : 'Available'}</span></div><p>{integration.connected ? 'Data is flowing into the shared event backbone.' : 'Ready to configure with production credentials.'}</p><button className={integration.connected ? 'retail-app-secondary' : 'retail-app-primary'} onClick={() => update((current) => ({ ...current, integrations: current.integrations.map((item) => item.id === integration.id ? { ...item, connected: !item.connected } : item) }), `${integration.name} ${integration.connected ? 'disconnected' : 'connected'}`)} type="button">{integration.connected ? 'Disconnect demo' : 'Connect demo'}</button></article>)}</div></>
}

function ReportsPage({ config }: { config: WorkspaceConfig }) {
  return <><WorkspaceHeading eyebrow="Intelligence" title="Reports & forecasts" copy={`Understand ${config.label.toLowerCase()} performance, trends, risk, and expected outcomes.`} /><section className="retail-app-metrics">{config.metrics.map((metric) => <Metric key={metric.label} {...metric} />)}</section><section className="retail-app-dashboard-grid lower"><article className="retail-app-panel"><div className="retail-app-panel-heading"><div><p>Performance</p><h2>Operating trend</h2></div><span>Last 12 weeks</span></div><div className="complete-workspace-bars">{[48, 62, 55, 73, 69, 84, 78, 91, 88, 96, 89, 100].map((height, index) => <i key={index} style={{ height: `${height}%` }} />)}</div></article><article className="retail-app-panel"><div className="retail-app-panel-heading"><div><p>FoundAI forecast</p><h2>Next best decisions</h2></div></div><div className="retail-app-priorities">{config.subjects.map((subject, index) => <div className="complete-workspace-insight" key={subject}><i data-tone={index === 0 ? 'risk' : 'watch'} /><div><strong>{subject}</strong><span>{index % 2 ? 'Expected upside if actioned this week' : 'Requires owner review today'}</span></div><b>{92 - index * 4}%</b></div>)}</div></article></section></>
}

function EventFeedPage({ events }: { events: WorkspaceEvent[] }) {
  const visible = events.length ? events : workspaceOrder.flatMap((workspace, index) => [
    { id: `${workspace}-seed`, workspace, text: `${configs[workspace].label} published its latest operating summary`, time: `${index * 9 + 2}m ago` },
  ])
  return <><WorkspaceHeading eyebrow="Shared backbone" title="Shared Event Feed" copy="Every confirmed action, automation, and cross-workspace handoff appears in one traceable operating timeline." /><div className="retail-app-table-card full"><div className="retail-app-panel-heading"><div><p>Event graph</p><h2>{visible.length} recent events</h2></div><span>Newest first</span></div><div className="complete-workspace-event-feed">{visible.map((event) => <article key={event.id}><i style={{ background: configs[event.workspace].accent }} /><div><strong>{event.text}</strong><span>{configs[event.workspace].label} · {configs[event.workspace].suite}</span></div><time>{event.time}</time></article>)}</div></div></>
}

function SettingsPage({ config, state, update }: { config: WorkspaceConfig; state: WorkspaceState; update: (mutate: (current: WorkspaceState) => WorkspaceState, eventText?: string) => void }) {
  const save = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    update((current) => ({ ...current, settings: { businessName: String(form.get('businessName')), region: String(form.get('region')), notifications: form.get('notifications') === 'on' } }), `${config.label} settings updated`)
  }
  return <><WorkspaceHeading eyebrow="Administration" title="Settings" copy={`Configure the ${config.label} workspace identity, region, access, and notifications.`} /><form className="retail-app-settings retail-app-panel" onSubmit={save}><section><h2>Workspace identity</h2><p>Shared across records, reports, notifications, and integrations.</p><label>Business name<input defaultValue={state.settings.businessName} name="businessName" required /></label><label>Operating region<select defaultValue={state.settings.region} name="region"><option>United Kingdom</option><option>Nigeria</option><option>United States</option><option>European Union</option></select></label></section><section><h2>Event notifications</h2><label className="retail-app-check"><input defaultChecked={state.settings.notifications} name="notifications" type="checkbox" /> Notify owners about high-priority events and required approvals</label></section><footer><button className="retail-app-primary" type="submit">Save settings</button></footer></form></>
}

export function CompleteWorkspaceApplication({ workspace, section = 'overview' }: { workspace: BusinessWorkspaceSlug; section?: string }) {
  const config = configs[workspace]
  const current = config.modules.find((item) => item.id === section) ?? config.modules[0]
  const { state, events, update, reset } = useWorkspaceState(workspace)
  const groups = useMemo(() => [...new Set(config.modules.map((item) => item.group))], [config.modules])
  let content: React.ReactNode
  if (current.id === 'overview') content = <Overview config={config} events={events} state={state} workspace={workspace} />
  else if (current.id === 'automations') content = <AutomationsPage config={config} state={state} update={update} />
  else if (current.id === 'integrations') content = <IntegrationsPage state={state} update={update} />
  else if (['reports', 'forecasting', 'attribution'].includes(current.id)) content = <ReportsPage config={config} />
  else if (current.id === 'event-feed') content = <EventFeedPage events={events} />
  else if (current.id === 'settings') content = <SettingsPage config={config} state={state} update={update} />
  else content = <RecordsPage config={config} item={current} state={state} update={update} workspace={workspace} />
  return <main className="retail-product-shell complete-workspace-shell" style={{ ['--retail-accent' as string]: config.accent }}>
    <aside className="retail-product-sidebar"><Link className="retail-product-brand" href="/"><span>F</span><div><strong>FoundingOS</strong><small>{config.suite}</small></div></Link><div className="retail-product-store"><span>{config.label.slice(0, 2).toUpperCase()}</span><div><strong>{state.settings.businessName}</strong><small>{config.label} Workspace</small></div><b>⌄</b></div><nav aria-label={`${config.label} workspace navigation`}>{groups.map((group) => <div key={group}><p>{group}</p>{config.modules.filter((item) => item.group === group).map((item) => <Link className={item.id === current.id ? 'active' : ''} href={`/test-workspaces/${workspace}${item.id === 'overview' ? '' : `/${item.id}`}`} key={item.id}><i>{item.id === 'overview' ? '⌂' : '◇'}</i><span>{item.label}</span>{state.records[item.id]?.length ? <em>{state.records[item.id].length}</em> : null}</Link>)}</div>)}</nav><Link className="retail-product-switcher" href="/test-workspaces"><span>All workspaces</span><b>↗</b></Link></aside>
    <section className="retail-product-main"><header className="retail-product-topbar"><form onSubmit={(event) => event.preventDefault()}><span>⌕</span><input aria-label="Global workspace search" placeholder={`Search ${config.label}, or ask FoundAI…`} /></form><div><span className="complete-workspace-live">● SIMULATION LIVE</span><span className="retail-product-user">BS</span></div></header><div className="retail-product-content"><div className="retail-product-notice"><span>✓</span> Complete interactive simulation · actions persist and publish to the Shared Event Feed</div>{content}</div><footer className="retail-product-footer"><span>{config.label} Workspace · browser-persistent shared simulation</span><button onClick={reset} type="button">Reset {config.label} data</button></footer></section>
  </main>
}
