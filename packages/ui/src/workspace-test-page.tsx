'use client'

import Link from 'next/link'
import { AccountNavLinks } from './account-nav'
import { CompleteWorkspaceApplication, type BusinessWorkspaceSlug } from './complete-workspace-application'
import { talentModules } from './talent-workspace'
import { FoundingOSBrandMark } from './brand-mark'
import { workspaceBrandIcons } from './brand-icons'

export type TestWorkspaceSlug = BusinessWorkspaceSlug

const workspaces: Array<{ slug: TestWorkspaceSlug; label: string; suite: string; summary: string; modules: number; accent: string }> = [
  { slug: 'retail', label: 'Retail', suite: 'Core.Operations', summary: 'Sales, CRM, orders, inventory, purchasing, fulfilment, service, and payments.', modules: 25, accent: '#24c47a' },
  { slug: 'logistics', label: 'Logistics', suite: 'Core.Operations', summary: 'Dispatch, routes, deliveries, tracking, fleet, drivers, billing, and exceptions.', modules: 17, accent: '#2f80ed' },
  { slug: 'finance', label: 'Finance', suite: 'Core.Operations', summary: 'Cash flow, invoices, bills, banking, reconciliation, budgets, tax, and approvals.', modules: 18, accent: '#7c5ce7' },
  { slug: 'marketing', label: 'Marketing', suite: 'Core.Operations', summary: 'Campaigns, audiences, leads, content, journeys, channels, and attribution.', modules: 18, accent: '#ef6c57' },
  { slug: 'talent', label: 'Talent', suite: 'Core.Workforce', summary: 'Recruitment: jobs, candidates, interviews, offers, client submissions, outreach follow-ups, recruiter activity and placements.', modules: talentModules.length, accent: '#d65db1' },
  { slug: 'hr', label: 'HR', suite: 'Core.Workforce', summary: 'Employees, contracts, rotas, timesheets, holiday, sickness, right-to-work, policies and payroll inputs.', modules: 21, accent: '#2ec4b6' },
  { slug: 'health', label: 'Health', suite: 'Core.Operations', summary: 'Appointments, patients, care plans, triage, practitioners, billing, claims, and compliance.', modules: 18, accent: '#00a6a6' },
  { slug: 'legal', label: 'Legal', suite: 'Core.Operations', summary: 'Matters, billable activity, calls, letters, evidence, NDAs, contracts, subscriptions and defensible client bills.', modules: 24, accent: '#3158d4' },
  { slug: 'intelligence', label: 'Core Intelligence', suite: 'Core.Intelligence', summary: 'Executive control across your business workspaces, with signals, risks, forecasts, decisions, and the Event Feed. This is not the founder SuperDash.', modules: 17, accent: '#b77aff' },
]

export function WorkspaceDirectory({ basePath = '/test-workspaces' }: { basePath?: '/test-workspaces' | '/app' }) {
  const production = basePath === '/app'
  return <main className="complete-workspace-directory">
    <header>
      <Link className="complete-workspace-access-brand" href="/"><FoundingOSBrandMark /><div><strong>FoundingOS</strong><small>{production ? 'Production workspaces' : 'Interactive test workspaces'}</small></div></Link>
      <div><p className="eyebrow">{production ? 'Your operating system' : 'Choose a workspace to test'}</p><h1>One business. Nine connected workspaces.</h1><p>{production ? 'Open any enabled workspace. Access and records remain tenant-scoped.' : 'Every workspace is interactive, browser-persistent, and connected through the Shared Event Feed.'}</p></div>
    </header>
    <section aria-label="FoundingOS workspaces">
      <AccountNavLinks variant="card" />
      {workspaces.map((workspace) => <Link href={`${basePath}/${workspace.slug}`} key={workspace.slug} style={{ ['--workspace-accent' as string]: workspaceBrandIcons[workspace.slug].accent }}>
        <FoundingOSBrandMark workspace={workspace.slug} />
        <div><small>{workspace.suite}</small><h2>{workspace.label}</h2><p>{workspace.summary}</p></div>
        <footer><strong>{workspace.modules} modules</strong><b>Open workspace →</b></footer>
      </Link>)}
    </section>
  </main>
}

export function WorkspaceTestPage({ workspace, section }: { workspace: TestWorkspaceSlug; section?: string }) {
  return <CompleteWorkspaceApplication section={section} workspace={workspace} />
}
