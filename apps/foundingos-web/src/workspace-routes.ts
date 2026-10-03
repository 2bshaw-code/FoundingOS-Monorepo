import { talentModules } from '@foundingos/ui/talent-workspace'

export const workspaceSections = {
  retail: ['overview', 'products', 'inventory', 'sales-pipeline', 'orders', 'point-of-sale', 'crm', 'segments', 'loyalty', 'inbox', 'campaigns', 'automations', 'content', 'promotions', 'channels', 'production-orders', 'boms', 'purchasing', 'suppliers', 'fulfilment', 'returns', 'service', 'payments', 'reports', 'team', 'integrations', 'security', 'settings'],
  logistics: ['overview', 'dispatch', 'routes', 'deliveries', 'tracking', 'exceptions', 'fleet', 'drivers', 'warehouses', 'customers', 'quotes', 'billing', 'reports', 'automations', 'team', 'integrations', 'security', 'settings'],
  finance: ['overview', 'cashflow', 'invoices', 'bills', 'banking', 'reconciliation', 'expenses', 'payments', 'budgets', 'forecasting', 'tax', 'approvals', 'reports', 'automations', 'team', 'integrations', 'security', 'settings'],
  marketing: ['overview', 'campaigns', 'calendar', 'audiences', 'segments', 'leads', 'content', 'brand-studio', 'channels', 'journeys', 'inbox', 'attribution', 'reports', 'automations', 'team', 'integrations', 'security', 'settings'],
  talent: talentModules.map((module) => module.id),
  hr: ['overview', 'people', 'onboarding', 'contracts', 'employee-relations', 'legal-register', 'right-to-work', 'documents', 'policies', 'rotas', 'timesheets', 'time-off', 'sickness', 'performance', 'learning', 'engagement', 'payroll', 'reports', 'automations', 'team', 'integrations', 'security', 'settings'],
  health: ['overview', 'appointments', 'patients', 'care-plans', 'triage', 'clinical-inbox', 'follow-ups', 'practitioners', 'locations', 'inventory', 'billing', 'claims', 'compliance', 'reports', 'automations', 'team', 'integrations', 'security', 'settings'],
  legal: ['overview', 'matters', 'clients', 'conflicts', 'deadlines', 'time-entries', 'communications', 'expenses', 'evidence', 'documents', 'ndas', 'contracts', 'subscriptions', 'obligations', 'pre-bills', 'invoices', 'billing-audit', 'compliance', 'reports', 'automations', 'team', 'integrations', 'security', 'settings'],
  intelligence: ['overview', 'outcomes', 'strategic-overview', 'signals', 'risks', 'recommendations', 'forecasts', 'scenarios', 'anomalies', 'event-feed', 'workflows', 'models', 'data-sources', 'reports', 'automations', 'team', 'integrations', 'security', 'settings'],
} satisfies Record<string, string[]>

export function workspaceStaticParams() {
  return Object.entries(workspaceSections).flatMap(([workspace, sections]) =>
    ['test-workspaces', 'app'].flatMap((root) => [
      { slug: [root, workspace] },
      ...sections.filter((section) => section !== 'overview').map((section) => ({ slug: [root, workspace, section] })),
    ]))
}
