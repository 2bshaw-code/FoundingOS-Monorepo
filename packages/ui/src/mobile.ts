export type MobileSuite = 'Operations' | 'Workforce' | 'Intelligence'

export type MobileModule = {
  id: string
  label: string
  suite: MobileSuite
}

export const MOBILE_ONBOARDING_STEPS = [
  'Choose suite',
  'Choose package',
  'Enter business details',
  'Verify account',
  'Enter dashboard',
] as const

export const MOBILE_SUITE_NAVIGATION: Record<MobileSuite, MobileModule[]> = {
  Operations: [
    { id: 'retail', label: 'Retail', suite: 'Operations' },
    { id: 'logistics', label: 'Logistics', suite: 'Operations' },
    { id: 'finance', label: 'Finance', suite: 'Operations' },
  ],
  Workforce: [
    { id: 'talent', label: 'Talent', suite: 'Workforce' },
    { id: 'health', label: 'Health', suite: 'Workforce' },
  ],
  Intelligence: [
    { id: 'superdashboard', label: 'SuperDashboard', suite: 'Intelligence' },
    { id: 'mapping', label: 'Mapping', suite: 'Intelligence' },
    { id: 'orchestration', label: 'Orchestration', suite: 'Intelligence' },
    { id: 'itops', label: 'ITOps', suite: 'Intelligence' },
  ],
}

export const MOBILE_MODULES_BY_APP = {
  foundingos: ['superdashboard', 'mapping', 'orchestration', 'itops'],
  retail: ['customers', 'inventory', 'orders', 'products'],
  talent: ['applicants', 'recruiters', 'jobs', 'workforce-intel'],
  foundthat: ['market-intel', 'lead-capture', 'data-quality', 'reports'],
  finance: ['cashflow', 'invoicing', 'reconciliation', 'reporting'],
  health: ['patients', 'scheduling', 'records', 'compliance'],
  logistics: ['fleet', 'routes', 'warehousing', 'deliveries'],
} as const

export const MOBILE_APP_CONFIGS = {
  retail: { suite: 'Operations', name: 'FoundingOS Retail', accent: '#00A651', modules: ['Customers', 'Inventory', 'Orders', 'Products'] },
  talent: { suite: 'Workforce', name: 'FoundingOS Talent', accent: '#FF7A00', modules: ['Applicants', 'Recruiters', 'Jobs', 'Workforce Intel'] },
  foundthat: { suite: 'Intelligence', name: 'FoundingOS Intelligence', accent: '#FFD300', modules: ['Market Intel', 'Lead Capture', 'Data Quality', 'Reports'] },
  finance: { suite: 'Operations', name: 'FoundingOS Finance', accent: '#A8A8A8', modules: ['Cashflow', 'Invoicing', 'Reconciliation', 'Reporting'] },
  health: { suite: 'Workforce', name: 'FoundingOS Health', accent: '#4FC3F7', modules: ['Patients', 'Scheduling', 'Records', 'Compliance'] },
  logistics: { suite: 'Operations', name: 'FoundingOS Logistics', accent: '#DC143C', modules: ['Fleet', 'Routes', 'Warehousing', 'Deliveries'] },
} as const
