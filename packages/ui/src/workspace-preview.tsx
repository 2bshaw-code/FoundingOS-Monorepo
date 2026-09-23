'use client'

import Link from 'next/link'
import { useState } from 'react'
import { LocalizedGbp } from './globalisation'

export type WorkspacePreviewProduct = {
  slug: string
  name: string
  suite: string
  audience: string
  summary: string
  outcome: string
  modules: string[]
  metrics: Array<{ label: string; value?: string; amountGbp?: number; change: string }>
  workQueue: Array<{ task: string; detail: string; status: string }>
  workflow: string[]
  automation: string
  insight: string
  aiCreations?: WorkspaceAiCreation[]
}

export type WorkspaceAiCreationStatus = 'Ready to approve' | 'Needs review' | 'Draft'

export type WorkspaceAiCreation = {
  title: string
  channel: string
  status: WorkspaceAiCreationStatus
  summary: string
  preview: { heading: string; body: string; meta?: string }
}

function aiCreationDotClass(status: WorkspaceAiCreationStatus) {
  if (status === 'Ready to approve') return 'status-insight'
  if (status === 'Needs review') return 'status-action'
  return ''
}

export function AiCreationsPanel({
  eyebrow = 'FoundAI',
  title = 'AI creations awaiting your review',
  items,
}: {
  eyebrow?: string
  title?: string
  items: WorkspaceAiCreation[]
}) {
  const [openTitle, setOpenTitle] = useState<string | null>(items[0]?.title ?? null)
  const [decisions, setDecisions] = useState<Record<string, 'approved' | 'changes'>>({})

  if (!items.length) return null

  return (
    <article className="ai-creations-panel" aria-label={title}>
      <div className="panel-heading">
        <div>
          <p className="eyebrow">{eyebrow}</p>
          <h3>{title}</h3>
        </div>
        <span>{items.length} generated</span>
      </div>
      <div className="ai-creation-list">
        {items.map((item) => {
          const isOpen = openTitle === item.title
          const decision = decisions[item.title]
          const statusLabel = decision === 'approved' ? 'Approved' : decision === 'changes' ? 'Changes requested' : item.status
          return (
            <div className={`ai-creation-item${isOpen ? ' open' : ''}`} key={item.title}>
              <button
                aria-expanded={isOpen}
                className="ai-creation-summary"
                onClick={() => setOpenTitle(isOpen ? null : item.title)}
                type="button"
              >
                <span className={`status-dot ${aiCreationDotClass(item.status)}`} />
                <span className="ai-creation-copy">
                  <strong>{item.title}</strong>
                  <small>{item.channel} · {item.summary}</small>
                </span>
                <small className={`ai-creation-status${decision ? ` ai-creation-status-${decision}` : ''}`}>{statusLabel}</small>
              </button>
              {isOpen ? (
                <div className="ai-creation-preview">
                  <p className="eyebrow">What FoundAI created</p>
                  <h4>{item.preview.heading}</h4>
                  <p>{item.preview.body}</p>
                  {item.preview.meta ? <span className="ai-creation-meta">{item.preview.meta}</span> : null}
                  <div className="ai-creation-actions">
                    <button
                      className="btn btn-primary"
                      onClick={() => setDecisions((prev) => ({ ...prev, [item.title]: 'approved' }))}
                      type="button"
                    >
                      Approve &amp; publish
                    </button>
                    <button
                      className="btn btn-secondary"
                      onClick={() => setDecisions((prev) => ({ ...prev, [item.title]: 'changes' }))}
                      type="button"
                    >
                      Request changes
                    </button>
                  </div>
                </div>
              ) : null}
            </div>
          )
        })}
      </div>
    </article>
  )
}

const moduleDescriptions: Record<string, string> = {
  POS: 'Take sales, connect customers and payments, and update stock from the same transaction.',
  Inventory: 'Track available, reserved, incoming, and low-stock quantities across locations.',
  Suppliers: 'Keep supplier contacts, lead times, purchase context, and follow-up in one place.',
  Sales: 'See trading performance, order value, product movement, and sales trends.',
  Customers: 'Maintain first-party customer records, order history, preferences, and consent.',
  Orders: 'Capture, approve, fulfil, and track every order from creation to payment.',
  Products: 'Manage the sellable catalogue, prices, variants, availability, and product information.',
  Stores: 'Compare locations, managers, activity, stock health, and operational exceptions.',
  Promotions: 'Create offers and connect campaign activity to orders and revenue.',
  'Inventory alerts': 'Surface low-stock, excess-stock, and replenishment risks before sales are lost.',
  Fleet: 'See vehicles, capacity, availability, location, and operating status.',
  Routes: 'Coordinate routes, stops, promised windows, progress, and exceptions.',
  Warehousing: 'Manage warehouse-ready orders, movements, dispatch queues, and capacity.',
  Deliveries: 'Track every delivery from assignment through proof and customer confirmation.',
  Dispatch: 'Assign work to drivers and vehicles using capacity and delivery priorities.',
  Tracking: 'Maintain a shared live status for dispatchers, operators, and customers.',
  Maintenance: 'Track vehicle readiness, maintenance work, downtime, and follow-up.',
  Fuel: 'Monitor fuel activity and its effect on route and delivery cost.',
  Compliance: 'Keep required checks, evidence, exceptions, and audit-ready records.',
  'Route planner': 'Build and adjust delivery plans around distance, capacity, and promised windows.',
  Invoicing: 'Create, brand, issue, and track invoices connected to operational source records.',
  Cashflow: 'See current and expected cash movement from operational activity.',
  Reconciliation: 'Match bank and mobile-money transactions to invoices and investigate exceptions.',
  Reporting: 'Turn operational and financial records into decision-ready reporting.',
  Payables: 'Track supplier obligations, due dates, approval, and payment state.',
  Receivables: 'Prioritise unpaid invoices, overdue accounts, and collection activity.',
  Forecasting: 'Project cash and operating outcomes using current records and events.',
  Risk: 'Surface concentration, overdue, exception, and liquidity risks for action.',
  'Portfolio alerts': 'Monitor material financial changes and route them to the right owner.',
  ATS: 'Move applicants through a clear, auditable hiring process.',
  CRM: 'Maintain candidate, client, and workforce relationships with complete history.',
  Onboarding: 'Track documents, checks, policies, readiness, and first-day tasks.',
  Candidates: 'Search, assess, communicate with, and progress candidate records.',
  Jobs: 'Manage vacancies, requirements, owners, status, and hiring demand.',
  Pipelines: 'Visualise stages, bottlenecks, ownership, and next actions.',
  Interviews: 'Coordinate interview stages, availability, feedback, and decisions.',
  Offers: 'Prepare, approve, issue, and monitor employment offers.',
  'Candidate pipeline': 'See candidate movement and intervene when hiring momentum slows.',
  'CV parser': 'Turn submitted CV information into structured, searchable candidate data.',
  Patients: 'Maintain patient identity, contact, consent, and operational history.',
  Appointments: 'Coordinate bookings, capacity, attendance, and follow-up.',
  Records: 'Keep authorised care and operational records connected to the patient journey.',
  Billing: 'Generate charges, invoices, receipts, and payment follow-up from completed care.',
  Referrals: 'Track referral origin, destination, status, evidence, and next steps.',
  Staffing: 'Match workforce capacity to appointments, services, and locations.',
  Supplies: 'Monitor critical stock, consumption, replenishment, and availability.',
  Treatments: 'Coordinate treatment status, resources, completion, and follow-up.',
  'Patient flow': 'See demand and movement through booking, arrival, care, billing, and discharge.',
  'Supply alerts': 'Warn teams before critical supplies fall below safe operating levels.',
}

function moduleDescription(module: string, product: WorkspacePreviewProduct) {
  return moduleDescriptions[module] ?? `${module} is included in ${product.name} and connected to the same records, permissions, Event Feed, and Intelligence layer.`
}

export function WorkspacePreview({ product }: { product: WorkspacePreviewProduct }) {
  const [selectedModule, setSelectedModule] = useState('Overview')
  const isOverview = selectedModule === 'Overview'
  const tabs = ['Overview', ...product.modules]

  return (
    <>
      <section className="console-product-intro">
        <Link className="text-link" href="/workspaces">← All workspaces</Link>
        <p className="eyebrow">{product.suite} · Interactive product preview</p>
        <h1>{product.name}</h1>
        <p className="console-audience">{product.audience}</p>
        <p>{product.summary} {product.outcome}</p>
        <div className="hero-actions">
          <Link className="btn btn-primary" href={`/test-workspaces/${product.slug}`}>Test this workspace</Link>
          <a className="btn btn-secondary" href="#product-preview">See what is included</a>
        </div>
      </section>

      <section id="product-preview" className="product-preview" aria-label={`${product.name} interactive sample workspace`}>
        <aside className="preview-sidebar">
          <div className="preview-brand"><span>F</span><strong>FoundingOS</strong></div>
          <p>{product.name}</p>
          <div className="preview-tabs" role="tablist" aria-label={`${product.name} modules`}>
            {tabs.map((module) => (
              <button
                aria-selected={selectedModule === module}
                className={selectedModule === module ? 'active' : ''}
                key={module}
                onClick={() => setSelectedModule(module)}
                role="tab"
                type="button"
              >
                {module}
              </button>
            ))}
          </div>
        </aside>
        <div className="preview-workspace">
          <header>
            <div>
              <p className="eyebrow">{isOverview ? 'Live workspace overview' : 'Included workspace module'}</p>
              <h2>{isOverview ? 'Good morning, Operations' : selectedModule}</h2>
            </div>
            <span className="demo-badge">Interactive sample data</span>
          </header>

          <div className="preview-metrics">
            {product.metrics.map((metric) => (
              <article key={metric.label}>
                <p>{metric.label}</p>
                <strong>{metric.amountGbp === undefined ? metric.value : <LocalizedGbp amount={metric.amountGbp} />}</strong>
                <span>{metric.change}</span>
              </article>
            ))}
          </div>

          {isOverview ? (
            <div className="preview-panels">
              <article>
                <div className="panel-heading"><div><p className="eyebrow">Today</p><h3>Priority work queue</h3></div><span>{product.workQueue.length} items</span></div>
                <div className="work-queue">
                  {product.workQueue.map((item) => (
                    <div key={item.task}><span className={`status-dot status-${item.status.toLowerCase()}`} /><div><strong>{item.task}</strong><p>{item.detail}</p></div><small>{item.status}</small></div>
                  ))}
                </div>
              </article>
              <article className="insight-card">
                <p className="eyebrow">Core Intelligence</p>
                <h3>Recommended next action</h3>
                <p>{product.insight}</p>
                <button type="button">Review recommendation</button>
              </article>
              {product.aiCreations?.length ? <AiCreationsPanel items={product.aiCreations} /> : null}
            </div>
          ) : (
            <div className="preview-panels">
              <article>
                <div className="panel-heading"><div><p className="eyebrow">What is included</p><h3>{selectedModule}</h3></div><span>Enabled</span></div>
                <p className="module-description">{moduleDescription(selectedModule, product)}</p>
                <div className="module-capability-list">
                  <div><strong>Operational records</strong><p>Create, update, search, and review the records used by this module.</p></div>
                  <div><strong>Role-based workflow</strong><p>Give each operator the actions, approvals, and queues relevant to their role.</p></div>
                  <div><strong>Connected history</strong><p>Changes feed the shared timeline and remain connected to downstream work.</p></div>
                </div>
              </article>
              <article className="insight-card">
                <p className="eyebrow">Automation + Intelligence</p>
                <h3>More than a static tab</h3>
                <p>{product.automation}</p>
                <p>{product.insight}</p>
              </article>
            </div>
          )}

          <div className="preview-flow" aria-label={`${product.name} connected workflow`}>
            {product.workflow.map((step, index) => <span key={step}><b>{index + 1}</b>{step}</span>)}
          </div>
        </div>
      </section>

      <section className="product-explainer">
        <article><p className="eyebrow">What you buy</p><h2>Every listed module is included and explorable</h2><p>{product.summary}</p><ul>{product.modules.map((module) => <li key={module}>{module}</li>)}</ul></article>
        <article><p className="eyebrow">Daily workflow</p><h2>One connected process</h2><ol>{product.workflow.map((step) => <li key={step}>{step}</li>)}</ol></article>
        <article><p className="eyebrow">Automation included</p><h2>Less manual chasing</h2><p>{product.automation}</p><p>Events flow into the shared Event Feed and produce cross-suite alerts in Core Intelligence.</p></article>
      </section>
    </>
  )
}
