/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
'use client'

import { DataWorkbench, consoleStyle, type BrandConsoleConfig, type DataField, type DataRow } from '../console'
import { ModuleTabs, type ModuleTab } from '../module-tabs'

// Real, tabbed Marketing Suite — replaces the previous single generic table. Four real
// sections matching what a marketing team actually does day to day: plan and run campaigns,
// keep a library of reusable message templates, define audience segments, and track results.
// Each tab is its own genuinely interactive DataWorkbench (create/edit/search/filter/paginate,
// client-state — same honesty level as every other illustrative module this session, clearly
// not backed by a real send/delivery engine).

const campaignFields: DataField[] = [
  { key: 'name', label: 'Campaign' },
  { key: 'channel', label: 'Channel', type: 'select', options: ['Email', 'SMS', 'WhatsApp', 'Social'] },
  { key: 'status', label: 'Status', type: 'select', options: ['Draft', 'Scheduled', 'Live', 'Completed'] },
  { key: 'budget', label: 'Budget' },
  { key: 'startDate', label: 'Start date', type: 'date' },
  { key: 'notes', label: 'Notes', type: 'textarea' },
]
const campaignRows = (brand: string): DataRow[] => [
  { id: `${brand}-camp-1`, values: { name: 'Spring Launch', channel: 'Email', status: 'Live', budget: '£1,200', startDate: '2026-08-15', notes: 'Promoting the new seasonal range to the full list.' } },
  { id: `${brand}-camp-2`, values: { name: 'Loyalty Reminder', channel: 'WhatsApp', status: 'Scheduled', budget: '£300', startDate: '2026-09-10', notes: 'Nudges repeat customers who haven\u2019t ordered in 30 days.' } },
  { id: `${brand}-camp-3`, values: { name: 'Flash Sale', channel: 'SMS', status: 'Completed', budget: '£450', startDate: '2026-07-22', notes: '48-hour discount push — strong open rate last time.' } },
  { id: `${brand}-camp-4`, values: { name: 'Brand Awareness', channel: 'Social', status: 'Draft', budget: '£800', startDate: '2026-09-25', notes: 'Awaiting creative approval before scheduling.' } },
]

const templateFields: DataField[] = [
  { key: 'name', label: 'Template' },
  { key: 'channel', label: 'Channel', type: 'select', options: ['Email', 'SMS', 'WhatsApp', 'Social'] },
  { key: 'subject', label: 'Subject / preview' },
  { key: 'status', label: 'Status', type: 'select', options: ['Draft', 'Approved'] },
]
const templateRows = (brand: string): DataRow[] => [
  { id: `${brand}-tpl-1`, values: { name: 'Welcome series — Step 1', channel: 'Email', subject: 'Welcome to the family 🎉', status: 'Approved' } },
  { id: `${brand}-tpl-2`, values: { name: 'Abandoned cart nudge', channel: 'WhatsApp', subject: 'Still thinking it over?', status: 'Approved' } },
  { id: `${brand}-tpl-3`, values: { name: 'Order shipped', channel: 'SMS', subject: 'Your order is on its way', status: 'Approved' } },
  { id: `${brand}-tpl-4`, values: { name: 'Winback — 60 days', channel: 'Email', subject: 'We miss you — here\u2019s 15% off', status: 'Draft' } },
]

const segmentFields: DataField[] = [
  { key: 'name', label: 'Segment' },
  { key: 'criteria', label: 'Criteria' },
  { key: 'size', label: 'Size (contacts)' },
  { key: 'lastUpdated', label: 'Last updated', type: 'date' },
]
const segmentRows = (brand: string): DataRow[] => [
  { id: `${brand}-seg-1`, values: { name: 'VIP customers', criteria: 'Lifetime value > £500', size: '184', lastUpdated: '2026-08-28' } },
  { id: `${brand}-seg-2`, values: { name: 'Lapsed (60+ days)', criteria: 'No order in 60 days', size: '512', lastUpdated: '2026-08-30' } },
  { id: `${brand}-seg-3`, values: { name: 'New this month', criteria: 'First order in last 30 days', size: '96', lastUpdated: '2026-09-01' } },
]

export function MarketingModule({ config }: { config: BrandConsoleConfig }) {
  const accentStyle = consoleStyle(config)
  const brand = config.name.toLowerCase().replaceAll(' ', '-')

  const tabs: ModuleTab[] = [
    {
      id: 'campaigns',
      label: 'Campaigns',
      icon: '📣',
      guide: 'Click "Create new" below to start a campaign — give it a name, pick a channel (Email/SMS/WhatsApp/Social), set a budget, and choose a start date. Click a row\u2019s Edit to update its status as it moves from Draft → Scheduled → Live → Completed.',
      render: () => (
        <DataWorkbench
          title="Campaigns"
          description="Plan, schedule, and track every marketing campaign in one place."
          fields={campaignFields}
          rows={campaignRows(brand)}
          cards={[
            { label: 'Live campaigns', value: '1', trend: 'Running now', icon: '▶' },
            { label: 'Scheduled', value: '1', trend: 'Upcoming', icon: '◷' },
            { label: 'Total budget', value: '£2,750', trend: 'This quarter', icon: '£' },
          ]}
          accentStyle={accentStyle}
          pageSize={5}
          emptyCopy="Create your first campaign to get started."
        />
      ),
    },
    {
      id: 'templates',
      label: 'Templates',
      icon: '📄',
      guide: 'Build a reusable message here once, then reuse it across every future campaign instead of rewriting it each time. Set its Subject/preview text, then move its Status from Draft to Approved once it\u2019s ready to send.',
      render: () => (
        <DataWorkbench
          title="Message templates"
          description="Reusable, on-brand templates for every channel — approve once, reuse everywhere."
          fields={templateFields}
          rows={templateRows(brand)}
          cards={[
            { label: 'Approved', value: '3', trend: 'Ready to use', icon: '✓' },
            { label: 'In draft', value: '1', trend: 'Needs review', icon: '✎' },
          ]}
          accentStyle={accentStyle}
          pageSize={5}
          emptyCopy="Create your first template."
        />
      ),
    },
    {
      id: 'segments',
      label: 'Segments',
      icon: '👥',
      guide: 'Group your contacts by real criteria (e.g. "spent over £100" or "hasn\u2019t ordered in 60 days") so a campaign can target exactly the right people instead of everyone at once. The Size field is how many contacts currently match.',
      render: () => (
        <DataWorkbench
          title="Audience segments"
          description="Define who a campaign reaches — combine order history, spend, and recency."
          fields={segmentFields}
          rows={segmentRows(brand)}
          cards={[
            { label: 'Segments', value: '3', trend: 'Active', icon: '◍' },
            { label: 'Total reach', value: '792', trend: 'Contacts covered', icon: '👥' },
          ]}
          accentStyle={accentStyle}
          pageSize={5}
          emptyCopy="Build your first segment."
        />
      ),
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: '📊',
      guide: 'A quick read on how your marketing is performing overall — open rate, click-through, and conversion. These are illustrative summary cards for now; use them as a template for what a real analytics view should show once a send/delivery engine is wired up.',
      render: () => (
        <div className="module-card-grid">
          <article className="module-card fo-card quantum-frame">
            <div className="module-card-top"><span>📬</span><strong>Open rate</strong></div>
            <p style={{ fontSize: 28, fontWeight: 700 }}>34.2%</p>
            <p><small>Illustrative — no real send/delivery engine wired up yet.</small></p>
          </article>
          <article className="module-card fo-card quantum-frame">
            <div className="module-card-top"><span>🖱</span><strong>Click-through rate</strong></div>
            <p style={{ fontSize: 28, fontWeight: 700 }}>8.6%</p>
            <p><small>Illustrative benchmark figure.</small></p>
          </article>
          <article className="module-card fo-card quantum-frame">
            <div className="module-card-top"><span>💰</span><strong>Revenue attributed</strong></div>
            <p style={{ fontSize: 28, fontWeight: 700 }}>£4,120</p>
            <p><small>Illustrative — real revenue lives in the real monetary fields (Accounting/Finance), not here.</small></p>
          </article>
          <article className="module-card fo-card quantum-frame">
            <div className="module-card-top"><span>🚫</span><strong>Unsubscribe rate</strong></div>
            <p style={{ fontSize: 28, fontWeight: 700 }}>0.4%</p>
            <p><small>Illustrative — healthy benchmark for context.</small></p>
          </article>
        </div>
      ),
    },
  ]

  return (
    <ModuleTabs
      title="Marketing Suite"
      description={`Campaigns, templates, audience segments, and performance for ${config.name} — all in one workspace.`}
      tabs={tabs}
      accentStyle={accentStyle}
    />
  )
}

export default MarketingModule
