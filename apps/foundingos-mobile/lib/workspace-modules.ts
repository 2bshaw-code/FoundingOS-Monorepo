/*
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
// Mirrors the exact workspace/module catalogue from the web app
// (packages/ui/src/complete-workspace-application.tsx) so mobile and web
// present the same modules, groups, and Kanban stage names, and so mobile can
// read/write the same generic backend records
// (/api/v1/ops/platform/workspaces/:workspace/:module/records) with no
// per-module custom logic required.
export type WorkspaceSlug = 'retail' | 'logistics' | 'finance' | 'marketing' | 'talent' | 'hr' | 'health' | 'intelligence'

export type WorkspaceModuleDef = { id: string; label: string; group: string; statuses?: string[] }
export type WorkspaceDef = { slug: WorkspaceSlug; label: string; accent: string; description: string; modules: WorkspaceModuleDef[] }

const mod = (id: string, label: string, group: string, statuses?: string[]): WorkspaceModuleDef => ({ id, label, group, statuses })
const standard = ['New', 'In progress', 'Review', 'Complete']

export const WORKSPACES: WorkspaceDef[] = [
  {
    slug: 'retail', label: 'Retail', accent: '#159151',
    description: 'Run sales, customer relationships, marketing, commerce, service, and finance from one connected workspace.',
    modules: [
      mod('overview', 'Home', 'Workspace'), mod('sales-pipeline', 'Sales pipeline', 'Sales', ['Lead', 'Qualified', 'Proposal', 'Won']), mod('orders', 'Orders', 'Sales', ['New', 'Picking', 'Ready', 'Delivered']), mod('point-of-sale', 'Point of sale', 'Sales', ['Open basket', 'Payment due', 'Paid', 'Closed']),
      mod('crm', 'CRM', 'Customers', ['New', 'Engaged', 'Active', 'VIP']), mod('segments', 'Segments', 'Customers'), mod('loyalty', 'Loyalty', 'Customers'), mod('inbox', 'Omnichannel inbox', 'Customers', ['Unread', 'Assigned', 'Waiting', 'Resolved']),
      mod('campaigns', 'Campaigns', 'Marketing', ['Draft', 'Scheduled', 'Live', 'Complete']), mod('automations', 'Automations', 'Marketing'), mod('content', 'Content studio', 'Marketing', ['Idea', 'Draft', 'Approved', 'Published']),
      mod('products', 'Products', 'Commerce'), mod('inventory', 'Inventory', 'Commerce', ['Low stock', 'Available', 'Reserved', 'Replenished']), mod('promotions', 'Promotions', 'Commerce', ['Draft', 'Scheduled', 'Live', 'Ended']), mod('channels', 'Sales channels', 'Commerce'),
      mod('production-orders', 'Production orders', 'Commerce', ['Planned', 'In production', 'Quality check', 'Complete']), mod('boms', 'Bills of materials', 'Commerce'),
      mod('purchasing', 'Purchasing', 'Operations', ['Draft', 'Approved', 'Ordered', 'Received']), mod('suppliers', 'Suppliers', 'Operations'), mod('fulfilment', 'Fulfilment', 'Operations', ['Queued', 'Picking', 'Packed', 'Dispatched']), mod('returns', 'Returns', 'Operations', ['Requested', 'Approved', 'Received', 'Refunded']),
      mod('service', 'Customer service', 'Service', ['Open', 'Assigned', 'Waiting', 'Resolved']), mod('payments', 'Payments', 'Finance', ['Pending', 'Authorised', 'Paid', 'Reconciled']), mod('reports', 'Reports & forecasts', 'Intelligence'),
      mod('team', 'Team & access', 'Administration'), mod('integrations', 'Integrations', 'Administration'), mod('security', 'Security & Access', 'Administration'), mod('settings', 'Settings', 'Administration'),
    ],
  },
  {
    slug: 'logistics', label: 'Logistics', accent: '#ff496e',
    description: 'Coordinate dispatch, routes, drivers, fleet, warehouses, tracking, and customer delivery promises.',
    modules: [mod('overview', 'Control tower', 'Workspace'), mod('dispatch', 'Dispatch board', 'Delivery', ['Unassigned', 'Assigned', 'Loaded', 'Departed']), mod('routes', 'Routes', 'Delivery', ['Planned', 'Optimised', 'Active', 'Complete']), mod('deliveries', 'Deliveries', 'Delivery', ['Booked', 'Out for delivery', 'Attempted', 'Delivered']), mod('tracking', 'Live tracking', 'Delivery'), mod('exceptions', 'Exceptions', 'Delivery', ['Open', 'Investigating', 'Recovering', 'Resolved']), mod('fleet', 'Fleet', 'Resources'), mod('drivers', 'Drivers', 'Resources'), mod('warehouses', 'Warehouses', 'Resources'), mod('customers', 'Customers', 'Commercial'), mod('quotes', 'Quotes', 'Commercial', standard), mod('billing', 'Billing', 'Commercial', ['Draft', 'Issued', 'Paid', 'Reconciled']), mod('reports', 'Performance', 'Intelligence'), mod('automations', 'Automations', 'Intelligence'), mod('team', 'Team & access', 'Administration'), mod('integrations', 'Integrations', 'Administration'), mod('security', 'Security & Access', 'Administration'), mod('settings', 'Settings', 'Administration')],
  },
  {
    slug: 'finance', label: 'Finance', accent: '#ffb33e',
    description: 'Control cash, invoices, bills, banking, reconciliation, budgets, tax, and financial approvals.',
    modules: [mod('overview', 'Finance home', 'Workspace'), mod('cashflow', 'Cash flow', 'Money'), mod('invoices', 'Invoices', 'Money', ['Draft', 'Sent', 'Overdue', 'Paid']), mod('bills', 'Bills', 'Money', ['Received', 'Approved', 'Scheduled', 'Paid']), mod('banking', 'Banking', 'Money'), mod('reconciliation', 'Reconciliation', 'Money', ['Unmatched', 'Suggested', 'Matched', 'Verified']), mod('expenses', 'Expenses', 'Spend', ['Submitted', 'Review', 'Approved', 'Reimbursed']), mod('payments', 'Payments', 'Spend', ['Pending', 'Authorised', 'Paid', 'Reconciled']), mod('budgets', 'Budgets', 'Planning'), mod('forecasting', 'Forecasting', 'Planning'), mod('tax', 'Tax', 'Compliance', standard), mod('approvals', 'Approvals', 'Compliance', ['Requested', 'Review', 'Approved', 'Actioned']), mod('reports', 'Reports', 'Intelligence'), mod('automations', 'Automations', 'Intelligence'), mod('team', 'Team & access', 'Administration'), mod('integrations', 'Integrations', 'Administration'), mod('security', 'Security & Access', 'Administration'), mod('settings', 'Settings', 'Administration')],
  },
  {
    slug: 'marketing', label: 'Marketing', accent: '#f56fc2',
    description: 'Plan campaigns, build audiences, create content, nurture leads, and prove attributed revenue.',
    modules: [mod('overview', 'Marketing home', 'Workspace'), mod('campaigns', 'Campaigns', 'Campaigns', ['Draft', 'Scheduled', 'Live', 'Complete']), mod('calendar', 'Calendar', 'Campaigns'), mod('audiences', 'Audiences', 'Audience'), mod('segments', 'Segments', 'Audience'), mod('leads', 'Leads', 'Audience', ['New', 'Nurturing', 'Qualified', 'Converted']), mod('content', 'Content studio', 'Creative', ['Idea', 'Draft', 'Approved', 'Published']), mod('brand-studio', 'Brand Studio', 'Creative'), mod('channels', 'Channels', 'Distribution'), mod('journeys', 'Customer journeys', 'Distribution', ['Draft', 'Active', 'Paused', 'Complete']), mod('inbox', 'Campaign inbox', 'Distribution', ['Unread', 'Assigned', 'Waiting', 'Resolved']), mod('attribution', 'Attribution', 'Intelligence'), mod('reports', 'Analytics', 'Intelligence'), mod('automations', 'Automations', 'Intelligence'), mod('team', 'Team & access', 'Administration'), mod('integrations', 'Integrations', 'Administration'), mod('security', 'Security & Access', 'Administration'), mod('settings', 'Settings', 'Administration')],
  },
  {
    slug: 'talent', label: 'Talent', accent: '#ff8a33',
    description: 'Recruit for your own business or run an agency: jobs, candidates, interviews, offers, checks, clients and placements.',
    modules: [mod('overview', 'Recruitment home', 'Workspace'), mod('jobs', 'Jobs', 'Hiring', ['Draft', 'Open', 'Interviewing', 'Filled']), mod('candidates', 'Candidates', 'Hiring', ['Applied', 'Screening', 'Interview', 'Offer']), mod('interviews', 'Interviews', 'Hiring', ['Planned', 'Confirmed', 'Complete', 'Decision']), mod('offers', 'Offers', 'Hiring', ['Draft', 'Sent', 'Accepted', 'Onboarding']), mod('references', 'References & checks', 'Hiring', ['Requested', 'Chasing', 'Received', 'Cleared']), mod('talent-pool', 'Talent pool', 'Pipeline', ['Available', 'Contacted', 'Shortlisted', 'Placed']), mod('clients', 'Agency clients', 'Agency', ['Prospect', 'Active', 'Hiring', 'Paused']), mod('placements', 'Placements', 'Agency', ['Offered', 'Started', 'Invoiced', 'Paid']), mod('reports', 'Recruitment reports', 'Intelligence'), mod('automations', 'Automations', 'Intelligence'), mod('team', 'Team & access', 'Administration'), mod('integrations', 'Integrations', 'Administration'), mod('security', 'Security & Access', 'Administration'), mod('settings', 'Settings', 'Administration')],
  },
  {
    slug: 'hr', label: 'HR', accent: '#2ec4b6',
    description: 'Run the team you have: employees, contracts, rotas, timesheets, holiday, sickness, right-to-work, policies and payroll inputs.',
    modules: [mod('overview', 'People home', 'Workspace'), mod('people', 'Employees', 'People'), mod('onboarding', 'Onboarding', 'People', standard), mod('contracts', 'Contracts', 'People', ['Draft', 'Sent', 'Signed', 'Ended']), mod('right-to-work', 'Right to work', 'Compliance', ['Requested', 'Submitted', 'Checked', 'Verified']), mod('documents', 'Documents', 'Compliance', ['Draft', 'Sent', 'Signed', 'Filed']), mod('policies', 'Policies & handbook', 'Compliance', ['Draft', 'Review', 'Published', 'Archived']), mod('rotas', 'Rotas & shifts', 'Time', ['Unfilled', 'Draft', 'Published', 'Worked']), mod('timesheets', 'Timesheets', 'Time', ['Draft', 'Submitted', 'Approved', 'Paid']), mod('time-off', 'Holiday', 'Time', ['Requested', 'Review', 'Approved', 'Complete']), mod('sickness', 'Sickness & absence', 'Time', ['Off sick', 'Returned', 'Return-to-work done', 'Closed']), mod('performance', 'Performance', 'Development', standard), mod('learning', 'Learning', 'Development', standard), mod('engagement', 'Engagement', 'Development'), mod('payroll', 'Payroll inputs', 'Reward', ['Preparing', 'Review', 'Approved', 'Paid']), mod('reports', 'HR reports', 'Intelligence'), mod('automations', 'Automations', 'Intelligence'), mod('team', 'Team & access', 'Administration'), mod('integrations', 'Integrations', 'Administration'), mod('security', 'Security & Access', 'Administration'), mod('settings', 'Settings', 'Administration')],
  },
  {
    slug: 'health', label: 'Health', accent: '#4cc9ff',
    description: 'Coordinate patients, appointments, care plans, practitioners, follow-ups, billing, and compliance.',
    modules: [mod('overview', 'Care operations', 'Workspace'), mod('appointments', 'Appointments', 'Care', ['Booked', 'Confirmed', 'Checked in', 'Complete']), mod('patients', 'Patients', 'Care'), mod('care-plans', 'Care plans', 'Care', standard), mod('triage', 'Triage', 'Care', ['New', 'Assessed', 'Assigned', 'Complete']), mod('clinical-inbox', 'Clinical inbox', 'Care', ['Unread', 'Assigned', 'Waiting', 'Resolved']), mod('follow-ups', 'Follow-ups', 'Care', standard), mod('practitioners', 'Practitioners', 'Resources'), mod('locations', 'Locations', 'Resources'), mod('inventory', 'Clinical inventory', 'Resources', ['Low stock', 'Available', 'Reserved', 'Replenished']), mod('billing', 'Billing', 'Finance', ['Draft', 'Issued', 'Paid', 'Reconciled']), mod('claims', 'Claims', 'Finance', ['Prepared', 'Submitted', 'Review', 'Settled']), mod('compliance', 'Compliance', 'Governance', standard), mod('reports', 'Care reports', 'Intelligence'), mod('automations', 'Automations', 'Intelligence'), mod('team', 'Team & access', 'Administration'), mod('integrations', 'Integrations', 'Administration'), mod('security', 'Security & Access', 'Administration'), mod('settings', 'Settings', 'Administration')],
  },
  {
    slug: 'intelligence', label: 'Intelligence', accent: '#b77aff',
    description: 'Monitor the event graph, surface risks, forecast outcomes, and coordinate recommended decisions.',
    modules: [mod('overview', 'Command centre', 'Workspace'), mod('outcomes', 'Outcomes & value', 'Workspace'), mod('strategic-overview', 'Strategic overview', 'Workspace'), mod('signals', 'Signals', 'Decisioning', ['Detected', 'Enriched', 'Reviewed', 'Resolved']), mod('risks', 'Risks', 'Decisioning', ['Open', 'Investigating', 'Mitigating', 'Resolved']), mod('recommendations', 'Recommendations', 'Decisioning', ['Proposed', 'Review', 'Approved', 'Executed']), mod('forecasts', 'Forecasts', 'Planning'), mod('scenarios', 'Scenarios', 'Planning', standard), mod('anomalies', 'Anomalies', 'Monitoring', ['Detected', 'Investigating', 'Recovering', 'Resolved']), mod('event-feed', 'Shared Event Feed', 'Monitoring'), mod('workflows', 'AI workflows', 'Automation', standard), mod('models', 'Models', 'Automation'), mod('data-sources', 'Data sources', 'Data'), mod('reports', 'Intelligence reports', 'Data'), mod('automations', 'Automations', 'Data'), mod('team', 'Team & access', 'Administration'), mod('integrations', 'Integrations', 'Administration'), mod('security', 'Security & Access', 'Administration'), mod('settings', 'Settings', 'Administration')],
  },
]

export function findWorkspace(slug: string): WorkspaceDef | undefined {
  return WORKSPACES.find((workspace) => workspace.slug === slug)
}

export function findModule(workspaceSlug: string, moduleId: string): WorkspaceModuleDef | undefined {
  return findWorkspace(workspaceSlug)?.modules.find((item) => item.id === moduleId)
}
