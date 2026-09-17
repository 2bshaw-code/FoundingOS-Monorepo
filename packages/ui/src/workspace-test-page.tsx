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

  return (
    <main className="workspace-test-page">
      <header className="workspace-test-header">
        <div>
          <Link className="text-link" href="/workspaces">← Back to workspace overview</Link>
          <p className="eyebrow">Interactive FoundingOS test environment</p>
          <h1>{current?.label} Workspace</h1>
          <p>Use the controls below. Changes are simulated, saved in this browser, and can be reset without affecting a real business.</p>
        </div>
        <span className="demo-badge">Safe simulated data</span>
      </header>

      <nav className="workspace-test-nav" aria-label="Test another workspace">
        {workspaces.map((item) => (
          <Link aria-current={item.slug === workspace ? 'page' : undefined} className={item.slug === workspace ? 'active' : ''} href={`/test-workspaces/${item.slug}`} key={item.slug}>
            {item.label}
          </Link>
        ))}
      </nav>

      <ActiveWorkspace workspace={workspace} />
    </main>
  )
}
