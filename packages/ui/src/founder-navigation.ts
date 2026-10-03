export type FounderTab = 'overview' | 'finance' | 'sales' | 'marketing' | 'legal'
export const founderSections: Record<Exclude<FounderTab, 'overview'>, Array<[key: string, label: string]>> = {
  finance: [['books', 'Books & runway'], ['scenario', 'WhatsApp growth scenario'], ['finance/invoices', 'Invoices'], ['finance/bills', 'Bills'], ['finance/expenses', 'Expenses'], ['finance/banking', 'Banking'], ['finance/reconciliation', 'Reconciliation'], ['finance/budgets', 'Budgets'], ['finance/tax', 'Tax & VAT'], ['reports', 'Reports']],
  sales: [['forecast', 'Forecast'], ['retail/sales-pipeline', 'Deals & quotes'], ['subscribers', 'Subscribers'], ['retail/crm', 'Customers'], ['marketing/leads', 'Leads'], ['retail/orders', 'Orders'], ['retail/service', 'Support']],
  marketing: [['media', 'Media library'], ['posts', 'FoundAI posts'], ['marketing/campaigns', 'Campaigns'], ['marketing/content', 'Content'], ['marketing/calendar', 'Calendar'], ['marketing/audiences', 'Audiences'], ['marketing/journeys', 'Journeys'], ['reports', 'ROI & attribution']],
  legal: [['business', 'Business legal'], ['subscriptions', 'Subscription readiness'], ['privacy', 'Privacy & data'], ['markets', 'Country launch reviews'], ['company', 'Company obligations'], ['legal/contracts', 'Agreement documents'], ['legal/ndas', 'NDAs']],
}
