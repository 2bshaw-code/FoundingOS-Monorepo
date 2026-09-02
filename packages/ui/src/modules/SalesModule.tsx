/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
'use client'

import { DataWorkbench, consoleStyle, type BrandConsoleConfig, type DataField, type DataRow } from '../console'
import { ModuleTabs, type ModuleTab } from '../module-tabs'

// Real, tabbed Sales module — previously "sales" had no dedicated page at all anywhere in the
// ecosystem (it fell through to a generic informational card in the tester demo flow). Built
// fresh: Pipeline, Quotes, Activities, and Analytics, each a genuinely interactive client-state
// workspace (same honesty level as every other illustrative module — not backed by a real CPQ/
// deal-tracking database; real deal tracking with real numeric fields already exists
// separately in CRM Deals, wired to Prisma).

const pipelineFields: DataField[] = [
  { key: 'dealName', label: 'Deal' },
  { key: 'stage', label: 'Stage', type: 'select', options: ['Prospecting', 'Qualified', 'Proposal', 'Negotiation', 'Won', 'Lost'] },
  { key: 'value', label: 'Value' },
  { key: 'owner', label: 'Owner' },
  { key: 'closeDate', label: 'Expected close', type: 'date' },
]
const pipelineRows = (brand: string): DataRow[] => [
  { id: `${brand}-deal-1`, values: { dealName: 'Northside Group — annual contract', stage: 'Negotiation', value: '£8,400', owner: 'Ava', closeDate: '2026-09-15' } },
  { id: `${brand}-deal-2`, values: { dealName: 'Harbour Team — pilot', stage: 'Proposal', value: '£2,100', owner: 'Noah', closeDate: '2026-09-20' } },
  { id: `${brand}-deal-3`, values: { dealName: 'Summit Co — expansion', stage: 'Qualified', value: '£5,600', owner: 'Mia', closeDate: '2026-10-01' } },
  { id: `${brand}-deal-4`, values: { dealName: 'Bluebird Ltd — renewal', stage: 'Won', value: '£3,200', owner: 'Zoe', closeDate: '2026-08-28' } },
]

const quoteFields: DataField[] = [
  { key: 'quoteNumber', label: 'Quote #' },
  { key: 'customer', label: 'Customer' },
  { key: 'amount', label: 'Amount' },
  { key: 'status', label: 'Status', type: 'select', options: ['Draft', 'Sent', 'Accepted', 'Rejected'] },
  { key: 'validUntil', label: 'Valid until', type: 'date' },
]
const quoteRows = (brand: string): DataRow[] => [
  { id: `${brand}-quote-1`, values: { quoteNumber: 'Q-1042', customer: 'Northside Group', amount: '£8,400', status: 'Sent', validUntil: '2026-09-10' } },
  { id: `${brand}-quote-2`, values: { quoteNumber: 'Q-1043', customer: 'Harbour Team', amount: '£2,100', status: 'Draft', validUntil: '2026-09-15' } },
  { id: `${brand}-quote-3`, values: { quoteNumber: 'Q-1041', customer: 'Bluebird Ltd', amount: '£3,200', status: 'Accepted', validUntil: '2026-08-25' } },
]

const activityFields: DataField[] = [
  { key: 'type', label: 'Type', type: 'select', options: ['Call', 'Email', 'Meeting'] },
  { key: 'subject', label: 'Subject' },
  { key: 'contact', label: 'Contact' },
  { key: 'date', label: 'Date', type: 'date' },
  { key: 'outcome', label: 'Outcome' },
]
const activityRows = (brand: string): DataRow[] => [
  { id: `${brand}-act-1`, values: { type: 'Call', subject: 'Contract terms discussion', contact: 'Northside Group', date: '2026-09-01', outcome: 'Positive — sending revised terms' } },
  { id: `${brand}-act-2`, values: { type: 'Email', subject: 'Pilot proposal sent', contact: 'Harbour Team', date: '2026-08-30', outcome: 'Awaiting response' } },
  { id: `${brand}-act-3`, values: { type: 'Meeting', subject: 'Expansion scoping call', contact: 'Summit Co', date: '2026-08-28', outcome: 'Follow-up scheduled' } },
]

export function SalesModule({ config }: { config: BrandConsoleConfig }) {
  const accentStyle = consoleStyle(config)
  const brand = config.name.toLowerCase().replaceAll(' ', '-')

  const tabs: ModuleTab[] = [
    {
      id: 'pipeline',
      label: 'Pipeline',
      icon: '📈',
      render: () => (
        <DataWorkbench
          title="Sales pipeline"
          description="Every real deal in motion, from first contact to close."
          fields={pipelineFields}
          rows={pipelineRows(brand)}
          cards={[
            { label: 'Open deals', value: '3', trend: 'In progress', icon: '◍' },
            { label: 'Pipeline value', value: '£16,100', trend: 'Illustrative', icon: '£' },
            { label: 'Won (30d)', value: '1', trend: '£3,200', icon: '✓' },
          ]}
          accentStyle={accentStyle}
          pageSize={5}
          emptyCopy="Add your first deal."
        />
      ),
    },
    {
      id: 'quotes',
      label: 'Quotes',
      icon: '📃',
      render: () => (
        <DataWorkbench
          title="Quotes"
          description="Send, track, and follow up on every quote."
          fields={quoteFields}
          rows={quoteRows(brand)}
          cards={[
            { label: 'Sent', value: '1', trend: 'Awaiting reply', icon: '↗' },
            { label: 'Accepted', value: '1', trend: 'Won', icon: '✓' },
            { label: 'Draft', value: '1', trend: 'Not sent yet', icon: '✎' },
          ]}
          accentStyle={accentStyle}
          pageSize={5}
          emptyCopy="Create your first quote."
        />
      ),
    },
    {
      id: 'activities',
      label: 'Activities',
      icon: '📞',
      render: () => (
        <DataWorkbench
          title="Activities"
          description="Every call, email, and meeting logged against a real deal."
          fields={activityFields}
          rows={activityRows(brand)}
          cards={[
            { label: 'This week', value: '3', trend: 'Logged', icon: '◍' },
          ]}
          accentStyle={accentStyle}
          pageSize={5}
          emptyCopy="Log your first activity."
        />
      ),
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: '📊',
      render: () => (
        <div className="module-card-grid">
          <article className="module-card fo-card quantum-frame">
            <div className="module-card-top"><span>£</span><strong>Pipeline value</strong></div>
            <p style={{ fontSize: 28, fontWeight: 700 }}>£16,100</p>
            <p><small>Illustrative — real deal values with real numeric fields live in CRM Deals.</small></p>
          </article>
          <article className="module-card fo-card quantum-frame">
            <div className="module-card-top"><span>🏆</span><strong>Win rate</strong></div>
            <p style={{ fontSize: 28, fontWeight: 700 }}>62%</p>
          </article>
          <article className="module-card fo-card quantum-frame">
            <div className="module-card-top"><span>📐</span><strong>Avg deal size</strong></div>
            <p style={{ fontSize: 28, fontWeight: 700 }}>£4,825</p>
          </article>
          <article className="module-card fo-card quantum-frame">
            <div className="module-card-top"><span>🎯</span><strong>Quota progress</strong></div>
            <p style={{ fontSize: 28, fontWeight: 700 }}>81%</p>
          </article>
        </div>
      ),
    },
  ]

  return (
    <ModuleTabs
      title="Sales"
      description={`Pipeline, quotes, and activity tracking for ${config.name}'s sales team.`}
      tabs={tabs}
      accentStyle={accentStyle}
    />
  )
}

export default SalesModule
