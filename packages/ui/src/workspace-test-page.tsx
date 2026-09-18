'use client'

import Link from 'next/link'
import { CompleteWorkspaceApplication, type BusinessWorkspaceSlug } from './complete-workspace-application'

export type TestWorkspaceSlug = BusinessWorkspaceSlug

const workspaces: Array<{ slug: TestWorkspaceSlug; label: string; suite: string; summary: string; modules: number; accent: string }> = [
  { slug: 'retail', label: 'Retail', suite: 'Core.Operations', summary: 'Sales, CRM, orders, inventory, purchasing, fulfilment, service, and payments.', modules: 25, accent: '#24c47a' },
  { slug: 'logistics', label: 'Logistics', suite: 'Core.Operations', summary: 'Dispatch, routes, deliveries, tracking, fleet, drivers, billing, and exceptions.', modules: 17, accent: '#2f80ed' },
  { slug: 'finance', label: 'Finance', suite: 'Core.Operations', summary: 'Cash flow, invoices, bills, banking, reconciliation, budgets, tax, and approvals.', modules: 18, accent: '#7c5ce7' },
  { slug: 'marketing', label: 'Marketing', suite: 'Core.Operations', summary: 'Campaigns, audiences, leads, content, journeys, channels, and attribution.', modules: 18, accent: '#ef6c57' },
  { slug: 'talent', label: 'Talent', suite: 'Core.Workforce', summary: 'Hiring, interviews, onboarding, people, performance, leave, learning, and payroll.', modules: 18, accent: '#d65db1' },
  { slug: 'health', label: 'Health', suite: 'Core.Operations', summary: 'Appointments, patients, care plans, triage, practitioners, billing, claims, and compliance.', modules: 18, accent: '#00a6a6' },
  { slug: 'intelligence', label: 'SuperDashboard', suite: 'Core.Intelligence', summary: 'Executive control across every workspace, with signals, risks, forecasts, decisions, and the Event Feed.', modules: 17, accent: '#b77aff' },
]

export function WorkspaceDirectory({ basePath = '/test-workspaces' }: { basePath?: '/test-workspaces' | '/app' }) {
  const production = basePath === '/app'
  return <main className="complete-workspace-directory">
    <header>
      <Link className="complete-workspace-access-brand" href="/"><span>F</span><div><strong>FoundingOS</strong><small>{production ? 'Production workspaces' : 'Interactive test workspaces'}</small></div></Link>
      <div><p className="eyebrow">{production ? 'Your operating system' : 'Choose a workspace to test'}</p><h1>One business. Seven connected workspaces.</h1><p>{production ? 'Open any enabled workspace. Access and records remain tenant-scoped.' : 'Every workspace is interactive, browser-persistent, and connected through the Shared Event Feed.'}</p></div>
    </header>
    <section aria-label="FoundingOS workspaces">
      {workspaces.map((workspace) => <Link href={`${basePath}/${workspace.slug}`} key={workspace.slug} style={{ ['--workspace-accent' as string]: workspace.accent }}>
        <span>{workspace.label.slice(0, 2).toUpperCase()}</span>
        <div><small>{workspace.suite}</small><h2>{workspace.label}</h2><p>{workspace.summary}</p></div>
        <footer><strong>{workspace.modules} modules</strong><b>Open workspace →</b></footer>
      </Link>)}
    </section>
  </main>
}

export function WorkspaceTestPage({ workspace, section }: { workspace: TestWorkspaceSlug; section?: string }) {
  return <CompleteWorkspaceApplication section={section} workspace={workspace} />
}
